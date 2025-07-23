"use client";

import React, { useEffect, useState } from "react";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ServerCard from "@/components/store/ServerCard";
import {
  Store as StoreIcon,
  Server as ServerIcon,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import ContentFooter from "@/components/store/ContentFooter";
import { 
  StoreHeaderSkeleton, 
  ServerGridSkeleton 
} from "@/components/store/StoreSkeleton";
import { ProgressiveLoader, ServerCardSkeletonItem } from "@/components/store/ProgressiveLoader";
import { useStorePreload } from "@/components/store/StorePreloader";
import { useIntelligentPreload } from "@/components/store/StorePreloadManager";

// Remove ServerStatus and ServerWithStatus interfaces
// Remove fetchServerStatus and fetchServersWithStatus functions
// Remove all state and logic related to online status and player count
// Only fetch and display listed servers

export default function Store() {
  const [servers, setServers] = React.useState<Server[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  const { getServers } = useServerService();

  useStorePreload();
  useIntelligentPreload();

  const fetchServers = async () => {
    try {
      const serverData = await getServers();
      const listedServers = (serverData || []).filter((server: Server) => server.isListed);
      setServers(listedServers);
      setLoading(false);
    } catch (error) {
      setServers([]);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <StoreHeaderSkeleton />
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Oyunlar
              </CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <ServerGridSkeleton count={10} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalServers = servers?.length || 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StoreIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mağaza</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Oyun sunucularımızı keşfedin ve favori eşyalarınızı satın alın
          </p>
        </div>
        {/* Servers Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Oyunlar
              </CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            {!servers || totalServers === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <ServerIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Henüz sunucu bulunmuyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Şu anda aktif sunucu bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.
                </p>
              </div>
            ) : (
              // Servers Grid with Progressive Loading
              <ProgressiveLoader
                items={servers}
                renderItem={(server: Server, index) => (
                  <ServerCard
                    key={server.id}
                    server={{
                      id: server.id,
                      name: server.name,
                      image: server.image || "/images/default-category.png",
                    }}
                  />
                )}
                skeletonComponent={ServerCardSkeletonItem}
                itemsPerPage={5}
                initialItems={8}
              />
            )}
          </CardContent>
        </Card>
        {/* Footer Info */}
        {totalServers > 0 && (
          <ContentFooter
            header="Premium Eşya Koleksiyonu"
            message="Her sunucuda özel tasarlanmış eşyalar ve avantajlı fiyatlarla oyun deneyiminizi geliştirin"
            color="purple"
          />
        )}
      </div>
    </>
  );
}
