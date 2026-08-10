"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Subscript as SubIcon, Superscript as SupIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote,
  Link as LinkIcon, Unlink, ImageIcon, TableIcon, Code, Minus, Eraser,
  Undo2, Redo2, Code2, Heading1, Heading2, Heading3,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const supabase = createClient();
  const [modeSumber, setModeSumber] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      TiptapImage.configure({ HTMLAttributes: { class: "rounded-md" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[260px] rounded-b-md border border-border border-t-0 px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  async function handleInsertGambar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploadingImg(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi login berakhir.");

      const compressed = await compressImage(file);
      const path = `${user.id}/konten/${Date.now()}-${compressed.name}`;

      const { error: uploadError } = await supabase.storage.from("gambar-website").upload(path, compressed);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("gambar-website").getPublicUrl(path);
      editor.chain().focus().setImage({ src: publicUrl.publicUrl }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal upload gambar.");
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  }

  function handleSetLink() {
    if (!editor) return;
    const urlSebelumnya = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Masukkan URL tautan:", urlSebelumnya ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  const tombol = (aktif: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded ${aktif ? "bg-primary text-primary-foreground" : "hover:bg-accent/10"}`;

  return (
    <div>
      {!modeSumber && (
        <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-border bg-accent/5 p-1">
          <button type="button" title="Urungkan" onClick={() => editor.chain().focus().undo().run()} className={tombol(false)}>
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" title="Ulangi" onClick={() => editor.chain().focus().redo().run()} className={tombol(false)}>
            <Redo2 className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={tombol(editor.isActive("heading", { level: 1 }))}>
            <Heading1 className="h-4 w-4" />
          </button>
          <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={tombol(editor.isActive("heading", { level: 2 }))}>
            <Heading2 className="h-4 w-4" />
          </button>
          <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={tombol(editor.isActive("heading", { level: 3 }))}>
            <Heading3 className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Tebal" onClick={() => editor.chain().focus().toggleBold().run()} className={tombol(editor.isActive("bold"))}>
            <Bold className="h-4 w-4" />
          </button>
          <button type="button" title="Miring" onClick={() => editor.chain().focus().toggleItalic().run()} className={tombol(editor.isActive("italic"))}>
            <Italic className="h-4 w-4" />
          </button>
          <button type="button" title="Garis bawah" onClick={() => editor.chain().focus().toggleUnderline().run()} className={tombol(editor.isActive("underline"))}>
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button type="button" title="Coret" onClick={() => editor.chain().focus().toggleStrike().run()} className={tombol(editor.isActive("strike"))}>
            <Strikethrough className="h-4 w-4" />
          </button>
          <button type="button" title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} className={tombol(editor.isActive("subscript"))}>
            <SubIcon className="h-4 w-4" />
          </button>
          <button type="button" title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={tombol(editor.isActive("superscript"))}>
            <SupIcon className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Rata kiri" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={tombol(editor.isActive({ textAlign: "left" }))}>
            <AlignLeft className="h-4 w-4" />
          </button>
          <button type="button" title="Rata tengah" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={tombol(editor.isActive({ textAlign: "center" }))}>
            <AlignCenter className="h-4 w-4" />
          </button>
          <button type="button" title="Rata kanan" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={tombol(editor.isActive({ textAlign: "right" }))}>
            <AlignRight className="h-4 w-4" />
          </button>
          <button type="button" title="Rata kiri-kanan" onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={tombol(editor.isActive({ textAlign: "justify" }))}>
            <AlignJustify className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Daftar poin" onClick={() => editor.chain().focus().toggleBulletList().run()} className={tombol(editor.isActive("bulletList"))}>
            <List className="h-4 w-4" />
          </button>
          <button type="button" title="Daftar bernomor" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={tombol(editor.isActive("orderedList"))}>
            <ListOrdered className="h-4 w-4" />
          </button>
          <button type="button" title="Kutipan" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={tombol(editor.isActive("blockquote"))}>
            <Quote className="h-4 w-4" />
          </button>
          <button type="button" title="Blok kode" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={tombol(editor.isActive("codeBlock"))}>
            <Code className="h-4 w-4" />
          </button>
          <button type="button" title="Garis pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={tombol(false)}>
            <Minus className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Tautan" onClick={handleSetLink} className={tombol(editor.isActive("link"))}>
            <LinkIcon className="h-4 w-4" />
          </button>
          <button type="button" title="Hapus tautan" onClick={() => editor.chain().focus().unsetLink().run()} className={tombol(false)}>
            <Unlink className="h-4 w-4" />
          </button>

          <label className={`${tombol(false)} cursor-pointer`} title="Sisipkan gambar">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInsertGambar} className="hidden" disabled={uploadingImg} />
            <ImageIcon className="h-4 w-4" />
          </label>

          <button
            type="button"
            title="Sisipkan tabel"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className={tombol(false)}
          >
            <TableIcon className="h-4 w-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button type="button" title="Hapus format" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className={tombol(false)}>
            <Eraser className="h-4 w-4" />
          </button>

          <div className="ml-auto">
            <Button type="button" variant="outline" size="sm" onClick={() => setModeSumber(true)}>
              <Code2 className="mr-1 h-3.5 w-3.5" /> Lihat HTML
            </Button>
          </div>
        </div>
      )}

      {uploadingImg && <p className="border-x border-border bg-accent/5 px-2 py-1 text-xs text-foreground/60">Mengunggah gambar…</p>}

      {modeSumber ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={12}
            className="w-full rounded-md border border-border bg-white px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              editor.commands.setContent(value);
              setModeSumber(false);
            }}
          >
            Kembali ke Editor Normal
          </Button>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
