export function sanitizeHtml(input: string): string {
  let html = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|base|form|input|button)[^>]*>/gi, "");

  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/(href|src|action)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, "");

  return html;
}
