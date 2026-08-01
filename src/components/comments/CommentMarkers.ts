import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { DecorationSet, Decoration } from "@tiptap/pm/view";
import type { CommentRange } from "@/types/comments";

let currentComments: CommentRange[] = [];

export function updateCommentRanges(comments: CommentRange[]) {
  currentComments = comments;
}

export const CommentMarkers = Extension.create({
  name: "commentMarkers",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("commentMarkers"),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr) {
            const comments = currentComments;
            if (comments.length === 0) return DecorationSet.empty;

            const decorations: Decoration[] = [];
            const seen = new Set<string>();

            for (const c of comments) {
              if (seen.has(c.id)) continue;
              seen.add(c.id);
              if (c.from < 0 || c.to < 0) continue;
              if (c.from >= tr.doc.content.size || c.to > tr.doc.content.size) continue;

              decorations.push(
                Decoration.inline(c.from, c.to, {
                  class: c.resolved ? "comment-marker-resolved" : "comment-marker",
                  "data-comment-id": c.id,
                  style: `background-color: ${c.userColor}1A; border-bottom: 2px solid ${c.userColor}66;`,
                })
              );
            }

            return DecorationSet.create(tr.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
