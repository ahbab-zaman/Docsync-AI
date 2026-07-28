"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CommentBubble from "@/components/comments/CommentBubble";
import { CommentMarkers, updateCommentRanges } from "@/components/comments/CommentMarkers";
import type { CommentRange } from "@/types/comments";

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  editable?: boolean;
  commentRanges?: CommentRange[];
  onAddComment?: (from: number, to: number, text: string) => void;
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  action: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon: Icon, label, action, isActive }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={cn(
        "flex items-center justify-center h-8 w-8 rounded-md transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-text-secondary hover:bg-surface-tertiary hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-5 bg-border mx-0.5" />;
}

export default function TiptapEditor({
  content,
  onUpdate,
  editable = true,
  commentRanges = [],
  onAddComment,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CommentMarkers,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[500px] px-8 py-6 text-text-primary",
      },
    },
  });

  useEffect(() => {
    if (commentRanges.length > 0) {
      updateCommentRanges(commentRanges);
    }
  }, [commentRanges]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-surface relative">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-surface-secondary">
        <ToolbarButton
          icon={Bold}
          label="Bold"
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic"
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="Strike"
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        />
        <ToolbarDivider />
        <ToolbarButton
          icon={Heading1}
          label="Heading 1"
          action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        />
        <ToolbarButton
          icon={Heading2}
          label="Heading 2"
          action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarButton
          icon={Heading3}
          label="Heading 3"
          action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        />
        <ToolbarDivider />
        <ToolbarButton
          icon={List}
          label="Bullet List"
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Ordered List"
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        />
        <ToolbarButton
          icon={Quote}
          label="Blockquote"
          action={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        />
        <ToolbarButton
          icon={Code}
          label="Code Block"
          action={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        />
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton
            icon={Undo}
            label="Undo"
            action={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={Redo}
            label="Redo"
            action={() => editor.chain().focus().redo().run()}
          />
        </div>
      </div>
      {onAddComment && <CommentBubble editor={editor} onAddComment={onAddComment} />}
      <EditorContent editor={editor} />
    </div>
  );
}
