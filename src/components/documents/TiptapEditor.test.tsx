// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { useState, useEffect } from "react";
import { render, act, waitFor } from "@testing-library/react";
import TiptapEditor from "./TiptapEditor";

let externalSetContent: ((html: string) => void) | null = null;

function Harness({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  useEffect(() => {
    externalSetContent = setContent;
  }, []);
  return (
    <TiptapEditor
      content={content}
      onUpdate={(html) => setContent(html)}
      commentRanges={[]}
    />
  );
}

describe("TiptapEditor controlled sync", () => {
  it("applies an external content change into the editor", async () => {
    externalSetContent = null;
    render(<Harness initialContent="<p>Hello World</p>" />);

    await waitFor(() => {
      expect(document.querySelector<HTMLElement>(".ProseMirror")?.textContent).toContain(
        "Hello World"
      );
    });

    const external = "<h1>Updated title</h1><p>Body text after restore</p>";
    act(() => {
      externalSetContent?.(external);
    });

    await waitFor(() => {
      const pm = document.querySelector<HTMLElement>(".ProseMirror");
      expect(pm?.textContent).toContain("Updated title");
      expect(pm?.textContent).toContain("Body text after restore");
    });
  });

  it("preserves formatting present in content after the sync effect runs", async () => {
    render(<Harness initialContent="<p>Hello <strong>World</strong> and <em>friends</em></p>" />);

    await waitFor(() => {
      const pm = document.querySelector<HTMLElement>(".ProseMirror");
      expect(pm?.querySelector("strong")?.textContent).toBe("World");
      expect(pm?.querySelector("em")?.textContent).toBe("friends");
    });
  });
});