import { FilterXSS } from "xss";

// Whitelist mengikuti persis node/mark yang bisa dihasilkan RichTextEditor
// (lihat src/components/admin/rich-text-editor.tsx). Mode "Lihat HTML" di
// editor itu mengizinkan user mengetik HTML mentah, jadi konten berita HARUS
// disaring di sini sebelum disimpan MAUPUN sebelum dirender — <script>,
// atribut event (onerror, dst), dan href/src "javascript:" akan dibuang.
//
// Pakai "xss" (js-xss) — murni CommonJS, TANPA jsdom (isomorphic-dompurify)
// atau dependency ESM-only (sanitize-html -> htmlparser2@12). Keduanya sudah
// dicoba dan gagal di Vercel serverless / build Next.js karena masalah
// kompatibilitas modul, jadi sengaja dihindari.
const ALLOWED_ATTR_UMUM = ["style"];

const myxss = new FilterXSS({
  whiteList: {
    p: ALLOWED_ATTR_UMUM,
    br: [],
    strong: [],
    em: [],
    u: [],
    s: [],
    sub: [],
    sup: [],
    h1: ALLOWED_ATTR_UMUM,
    h2: ALLOWED_ATTR_UMUM,
    h3: ALLOWED_ATTR_UMUM,
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    pre: [],
    code: [],
    hr: [],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "class"],
    table: [],
    thead: [],
    tbody: [],
    tr: [],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  css: {
    whiteList: { "text-align": /^(left|right|center|justify)$/ },
  },
});

export function sanitizeBeritaHtml(html: string): string {
  return myxss.process(html);
}
