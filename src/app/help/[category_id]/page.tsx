"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWebsiteHelpCenterService, HelpCenterCategory, HelpCenterItem } from "@/lib/services/helpcenter.service";
import LexicalViewer from "@/components/LexicalViewer";
import { Separator } from "@/components/ui/separator";

const sidebarClass = "bg-white/5 dark:bg-gray-800/20 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 p-6 min-w-[220px] max-w-xs w-full flex flex-col gap-4";
const itemButtonClass = (active: boolean) => `w-full text-left px-3 py-2 rounded-lg transition font-medium ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"}`;
const contentCardClass = "bg-white/5 dark:bg-gray-800/20 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 p-8 flex-1 min-h-[300px] flex flex-col";

export default function HelpCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.category_id as string;
  const { getCategory, getHelpCenter } = useWebsiteHelpCenterService();
  const [category, setCategory] = useState<HelpCenterCategory | null>(null);
  const [items, setItems] = useState<HelpCenterItem[]>([]);
  const [selected, setSelected] = useState<HelpCenterItem | null>(null);

  // categoryId değiştiğinde seçili makaleyi sıfırla
  useEffect(() => {
    setSelected(null);
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    getCategory({ websiteId: "default", categoryId }).then(setCategory);
    getHelpCenter({ websiteId: "default", query: { categoryId, activeOnly: true } })
      .then(data => {
        setItems(data.items || []);
      });
  }, [categoryId]);

  // items değiştiğinde ilk makaleyi otomatik seç
  useEffect(() => {
    if (items.length > 0) {
      setSelected(items[0]);
    } else {
      setSelected(null);
    }
  }, [items]);

  return (
    <section className="max-w-5xl mx-auto py-10 px-2 md:px-0">
      <button
        onClick={() => router.push("/help")}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition font-medium"
        aria-label="Geri Dön"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Geri Dön
      </button>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">Yardım Merkezi</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className={sidebarClass}>
          <div className="mb-2">
            <h2 className="text-lg font-bold mb-1">{category?.name || "Kategori"}</h2>
            <p className="text-muted-foreground text-sm">{category?.description}</p>
          </div>
          <Separator className="mb-2" />
          <nav className="flex flex-col gap-1">
            {items.length === 0 && <span className="text-muted-foreground text-sm">Bu kategoride makale yok.</span>}
            {items.map(item => (
              <button
                key={item.id}
                className={itemButtonClass(selected?.id === item.id)}
                onClick={() => setSelected(item)}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </aside>
        {/* Content */}
        <main className={contentCardClass}>
          {selected ? (
            <>
              <h1 className="text-2xl font-bold mb-4">{selected.title}</h1>
              <LexicalViewer content={selected.content} />
            </>
          ) : (
            <div className="text-muted-foreground text-center my-auto">Bir makale seçin.</div>
          )}
        </main>
      </div>
    </section>
  );
}
