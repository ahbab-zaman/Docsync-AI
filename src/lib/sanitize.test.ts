import { describe, it, expect } from "vitest";
import { escapeHtml, sanitizeHtml, stripHtml } from "@/lib/sanitize";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("sanitizeHtml", () => {
  it("strips disallowed tags", () => {
    const result = sanitizeHtml("<p>Hello</p><script>alert(1)</script>");
    expect(result).not.toContain("<script");
  });

  it("preserves allowed tags", () => {
    const result = sanitizeHtml("<p>Hello <strong>world</strong></p>");
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
  });

  it("blocks javascript URLs", () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain("javascript:");
  });

  it("removes event handler attributes", () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
  });

  it("keeps safe href attributes", () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>');
    expect(result).toContain('href="https://example.com"');
  });
});

describe("stripHtml", () => {
  it("removes all tags", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });

  it("trims whitespace", () => {
    expect(stripHtml("  <p>text</p>  ")).toBe("text");
  });

  it("returns empty string for tag-only input", () => {
    expect(stripHtml("<div></div>")).toBe("");
  });
});
