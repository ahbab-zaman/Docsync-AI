const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ENTITY_MAP[char] || char);
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a", "img",
]);

const ALLOWED_ATTRS = new Set(["href", "src", "alt", "title", "target", "rel"]);

const SAFE_PROTOCOLS = new Set(["http", "https", "mailto"]);

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return true;
  const protocol = trimmed.split(":")[0];
  if (!trimmed.includes(":")) return true;
  return SAFE_PROTOCOLS.has(protocol);
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<[^>]*>/g, (tag) => {
    const lower = tag.toLowerCase();
    const tagName = lower.match(/<\/?(\w+)/)?.[1];
    if (!tagName || !ALLOWED_TAGS.has(tagName)) {
      return escapeHtml(tag);
    }
    const attrs = tag.match(/(\w+)=["']([^"']*)["']/g) || [];
    const safeAttrs = attrs
      .map((attr) => {
        const [, name, value] = attr.match(/(\w+)=["']([^"']*)["']/) || [];
        const attrName = name?.toLowerCase() ?? "";
        if (!ALLOWED_ATTRS.has(attrName)) {
          return "";
        }
        if ((attrName === "href" || attrName === "src") && !isSafeUrl(value)) {
          return "";
        }
        return `${attrName}="${escapeAttr(value)}"`;
      })
      .filter(Boolean)
      .join(" ");
    const isClosing = tag.startsWith("</");
    return isClosing ? `</${tagName}>` : `<${tagName}${safeAttrs ? ` ${safeAttrs}` : ""}>`;
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
