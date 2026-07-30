const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"'/]/g, (char) => ENTITY_MAP[char] || char);
}

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a", "img",
]);

const ALLOWED_ATTRS = new Set(["href", "src", "alt", "title", "target", "rel"]);

export function sanitizeHtml(html: string): string {
  return html.replace(/<[^>]*>/g, (tag) => {
    const lower = tag.toLowerCase();
    const tagName = lower.match(/<\/?(\w+)/)?.[1];
    if (!tagName || !ALLOWED_TAGS.has(tagName)) {
      return escapeHtml(tag);
    }
    const attrs = tag.match(/(\w+)=["']([^"']*)["']/g) || [];
    const safeAttrs = attrs
      .filter((attr) => {
        const name = attr.split("=")[0].toLowerCase();
        return ALLOWED_ATTRS.has(name);
      })
      .map((attr) => {
        const [, name, value] = attr.match(/(\w+)=["']([^"']*)["']/) || [];
        if (name === "href" || name === "src") {
          const protocol = value.toLowerCase().split(":")[0];
          if (!["http", "https", "mailto"].includes(protocol)) {
            return `${name}="${escapeHtml(value)}"`;
          }
        }
        return `${name}="${escapeHtml(value)}"`;
      })
      .join(" ");
    const isClosing = tag.startsWith("</");
    return isClosing ? `</${tagName}>` : `<${tagName}${safeAttrs ? ` ${safeAttrs}` : ""}>`;
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
