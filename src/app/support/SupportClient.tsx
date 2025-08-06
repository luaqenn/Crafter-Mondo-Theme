"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/context/auth.context";
import { useRouter } from "next/navigation";
import { useWebsiteTicketService } from "@/lib/services/ticket.service";
import TicketList from "@/components/support/TicketList";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const { getTickets } = useWebsiteTicketService();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/sign-in?return=/support");
      return;
    }
    getTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCreate = () => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in?return=/support/create");
    } else {
      router.push("/support/create");
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Destek Taleplerim</h1>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow">
          Destek Talebi Oluştur
        </Button>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </main>
  );
}
