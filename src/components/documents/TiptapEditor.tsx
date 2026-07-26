"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

export default function TiptapEditor({ content, onUpdate }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] px-8 py-6 text-text-primary",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const ToolbarButton = ({
    label,
    action,
    isActive,
  }: {
    label: string;
    action: () => void;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-text-secondary hover:bg-surface-tertiary hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2 bg-surface-secondary">
        <ToolbarButton
          label="Bold"
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        />
        <ToolbarButton
          label="Italic"
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        />
        <ToolbarButton
          label="Strike"
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        />
        <span className="w-px bg-border mx-1" />
        <ToolbarButton
          label="H1"
          action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        />
        <ToolbarButton
          label="H2"
          action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarButton
          label="H3"
          action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        />
        <span className="w-px bg-border mx-1" />
        <ToolbarButton
          label="Bullet"
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        />
        <ToolbarButton
          label="Ordered"
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        />
        <ToolbarButton
          label="Quote"
          action={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        />
        <ToolbarButton
          label="Code"
          action={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
