import DOMPurify from "isomorphic-dompurify";

// Whitelist mengikuti persis node/mark yang bisa dihasilkan RichTextEditor
// (lihat src/components/admin/rich-text-editor.tsx). Mode "Lihat HTML" di
// editor itu mengizinkan user mengetik HTML mentah, jadi konten berita HARUS
// disaring di sini sebelum disimpan MAUPUN sebelum dirender — <script>,
// atribut event (onerror, dst), dan href/src "javascript:" akan dibuang.
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "sub", "sup",
  "h1", "h2", "h3", "ul", "ol", "li", "blockquote", "pre", "code",
  "hr", "a", "img", "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "class", "style", "colspan", "rowspan"];

export function sanitizeBeritaHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}
