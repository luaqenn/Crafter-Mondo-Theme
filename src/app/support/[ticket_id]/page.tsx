"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useWebsiteTicketService } from "@/lib/services/ticket.service";
import TicketDetailHeader from "@/components/support/TicketDetailHeader";
import TicketMessages from "@/components/support/TicketMessages";
import TicketReplyForm from "@/components/support/TicketReplyForm";
import TicketClosedNotice from "@/components/support/TicketClosedNotice";
import { Button } from "@/components/ui/button";
import { SerializedEditorState, ElementFormatType } from "lexical";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Editor } from "@/components/blocks/editor-00/editor";

// Lexical için boş serialized state
const EMPTY_EDITOR_STATE: SerializedEditorState = {
  root: {
    children: [],
    direction: "ltr",
    format: "left" as ElementFormatType,
    indent: 0,
    type: "root",
    version: 1,
  },
};

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

export default function TicketDetailPage() {
  const params = useParams<{ ticket_id: string }>();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { getTicket, replyToTicket, createTicket, getTicketCategories } = useWebsiteTicketService();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // State for create form
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<any>(EMPTY_EDITOR_STATE);
  const [createError, setCreateError] = useState("");

  // Fetch categories for create
  useEffect(() => {
    if (params.ticket_id === "create") {
      setLoading(true);
      getTicketCategories().then((cats) => {
        setCategories(cats);
        setLoading(false);
      });
    }
  }, [params.ticket_id]);

  // Fetch ticket for detail/reply
  const fetchTicket = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTicket({ ticketId: params.ticket_id });
      setTicket(data);
    } catch {
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [params.ticket_id]);

  useEffect(() => {
    if (params.ticket_id !== "create") {
      fetchTicket();
    }
  }, [fetchTicket, params.ticket_id]);

  // Handle send for reply
  const handleSend = async (content: SerializedEditorState) => {
    if (!ticket || isEditorStateEmpty(content)) return;
    setSending(true);
    try {
      await replyToTicket({ ticketId: ticket.id, reply: { message: content } });
      await fetchTicket();
    } finally {
      setSending(false);
    }
  };

  // Handle send for create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!categoryId || !title || isEditorStateEmpty(message) || !user) {
      setCreateError("Lütfen tüm alanları doldurun.");
      return;
    }
    setSending(true);
    try {
      const created = await createTicket({ ticket: { title, categoryId, message } });
      router.replace(`/support/${created.id}`);
    } catch (err) {
      setCreateError("Destek talebi oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg font-medium">{params.ticket_id === "create" ? "Kategori ve alanlar yükleniyor..." : "Destek Talebi Yükleniyor..."}</p>
      </div>
    );
  }

  // CREATE TICKET FORM
  if (params.ticket_id === "create") {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <Button variant="outline" onClick={() => router.push('/support')} className="mb-6 self-start">&larr; Geri Dön</Button>
        <div className="w-full mx-auto bg-[#101828]/90 dark:bg-[#101828]/80 rounded-2xl border border-white/10 p-6 flex flex-col gap-6 shadow-none">
          <h2 className="text-xl font-bold mb-2 text-white">Yeni Destek Talebi Oluştur</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} style={{ backgroundColor: cat.color }}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Kısa bir başlık yazın" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mesaj</Label>
              <Editor onSerializedChange={val => setMessage(val || EMPTY_EDITOR_STATE)} />
            </div>
            {createError && <div className="text-red-500 text-sm text-center">{createError}</div>}
            <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-none">
              {sending ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  // TICKET DETAIL/REPLY
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-300">
        <p className="text-lg font-medium text-red-500 dark:text-red-400">Destek talebi bulunamadı</p>
        <Button onClick={() => router.push('/support')} className="mt-4">Geri Dön</Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <Button variant="outline" onClick={() => router.push('/support')} className="mb-6">&larr; Geri Dön</Button>
      <TicketDetailHeader ticket={ticket} />
      <TicketMessages messages={ticket.messages || []} currentUserId={user?.id || ""} />
      {ticket.status === "CLOSED" ? (
        <TicketClosedNotice />
      ) : (
        <TicketReplyForm onSend={handleSend} loading={sending} initialValue={EMPTY_EDITOR_STATE} />
      )}
    </main>
  );
}
