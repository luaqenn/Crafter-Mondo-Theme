import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "../blocks/editor-00/editor";
import { SerializedEditorState } from "lexical";

interface TicketReplyFormProps {
  onSend: (content: SerializedEditorState) => void;
  loading?: boolean;
  initialValue?: SerializedEditorState;
}

// Lexical için boş serialized state
const EMPTY_EDITOR_STATE = { root: { children: [], direction: null, format: "", indent: 0, type: "root", version: 1 } };

// Lexical editör serialized state'i boş mu kontrolü
function isEditorStateEmpty(state: SerializedEditorState) {
  if (!state || !state.root || !Array.isArray(state.root.children)) return true;
  return (
    state.root.children.length === 0 ||
    state.root.children.every(
      (child: any) =>
        (child.type === "paragraph" && (!child.children || child.children.length === 0)) ||
        (child.type === "paragraph" &&
          child.children.every(
            (grandchild: any) =>
              grandchild.type === "text" && (!grandchild.text || grandchild.text.trim() === "")
          ))
    )
  );
}

export default function TicketReplyForm({ onSend, loading, initialValue }: TicketReplyFormProps) {
  const [message, setMessage] = useState<SerializedEditorState | any>(initialValue || EMPTY_EDITOR_STATE);

  useEffect(() => {
    setMessage(initialValue || EMPTY_EDITOR_STATE);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditorStateEmpty(message)) return;
    onSend(message);
    setMessage(EMPTY_EDITOR_STATE);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-white/10">
      <Editor
        
        onSerializedChange={val => setMessage(val || EMPTY_EDITOR_STATE)}
      />
      <Button
        type="submit"
        disabled={loading || isEditorStateEmpty(message)}
        className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
      >
        Gönder
      </Button>
    </form>
  );
} 