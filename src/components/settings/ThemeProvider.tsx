"use client";

import { useEffect, useRef } from "react";
import { getProfile } from "@/server/actions/settings";
import { defaultUserPreferences, type UserPreferences } from "@/types";
import { applyAppearance, resolveTheme, watchSystemTheme } from "@/lib/appearance";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemWatchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    const apply = (prefs: UserPreferences) => {
      applyAppearance(prefs);
      if (prefs.theme === "system") {
        const stopWatching = watchSystemTheme(() => {
          const root = document.documentElement;
          root.dataset.theme = resolveTheme("system");
        });
        systemWatchRef.current?.();
        systemWatchRef.current = stopWatching;
      } else {
        systemWatchRef.current?.();
        systemWatchRef.current = null;
      }
    };

    getProfile()
      .then(({ profile }) => {
        if (cancelled) return;
        apply(profile?.preferences ?? defaultUserPreferences);
      })
      .catch(() => {
        if (!cancelled) applyAppearance(defaultUserPreferences);
      });

    return () => {
      cancelled = true;
      systemWatchRef.current?.();
      systemWatchRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
