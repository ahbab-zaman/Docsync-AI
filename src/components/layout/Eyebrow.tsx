import React from "react";

interface EyebrowProps {
    icon?: React.ReactNode;
    children: React.ReactNode;
    tone?: "light" | "dark";
}

export function Eyebrow({
    icon,
    children,
    tone = "light",
}: EyebrowProps) {
    return (
        <div
            className={`mx-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur transform-gpu transition-transform duration-300 ease-out hover:-translate-y-0.5 ${tone === "light"
                    ? "border-[#E6E0D6] bg-[#FCFAF6]/80 text-[#8B867D]"
                    : "border-white/10 bg-white/5 text-white/60"
                }`}
        >
            {icon ?? (
                <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B4BFF] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#5B4BFF]" />
                </span>
            )}

            {children}
        </div>
    );
}
