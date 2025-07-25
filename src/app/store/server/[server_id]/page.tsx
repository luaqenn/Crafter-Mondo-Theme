"use client";

import { Category } from "@/lib/types/category";
import { useCategoryService } from "@/lib/services/category.service";
import { useContext, useEffect, useState, use } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { Spinner } from "@/components/ui/spinner";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/store/CategoryCard";
import {
  Server as ServerIcon,
  Grid3X3,
  ArrowLeft,
  Package,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NotFound from "@/components/not-found";
import ContentFooter from "@/components/store/ContentFooter";
import { 
  ServerHeaderSkeleton, 
  CategoryGridSkeleton 
} from "@/components/store/StoreSkeleton";
import { ProgressiveLoader, CategoryCardSkeletonItem } from "@/components/store/ProgressiveLoader";
import { useServerPreload } from "@/components/store/StorePreloader";

export default function ServerPage({
  params,
}: {
  params: Promise<{ server_id: string }>;
}) {
  // React.use() ile params'ı unwrap ediyoruz
  const { server_id } = use(params);
  const [server, setServer] = useState<Server | null>(null);
  const [serverCategories, setServerCategories] = useState<Category[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getServer } = useServerService();
  const { getCategories } = useCategoryService();
  const { website } = useContext(WebsiteContext);
  const router = useRouter();
  
  // Preload server data
  useServerPreload(server_id);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        setLoading(true);
        setError(null);

        const serverData = await getServer(server_id);
        const allCategories = await getCategories();
        const filteredCategories = allCategories.filter(
          (category) => category.server_id === serverData.id
        );

        setServerCategories(filteredCategories);
        setServer(serverData);
      } catch (error) {
        setError("Sunucu bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, [server_id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ServerHeaderSkeleton />
        
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Kategoriler
              </CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <CategoryGridSkeleton count={8} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !server) {
    return (
      <NotFound
        error={error as string}
        header="Sunucu Bulunamadı"
        navigateTo="/store"
        backToText="Mağazaya Geri Dön"
      />
    );
  }

  const totalCategories = serverCategories?.length || 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/store")}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Mağazaya Dön
          </Button>
        </div>

        {/* Server Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Server Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {server.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${server.image}`}
                        alt={server.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Server Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <ServerIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {server.name}
                    </h1>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Bu sunucuya ait kategorileri keşfedin ve eşyalarınızı seçin
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                    >
                      <Grid3X3 className="h-3 w-3 mr-1" />
                      {totalCategories} Kategori
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Kategoriler
              </CardTitle>
              {totalCategories > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {totalCategories} aktif
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="p-6">
            {totalCategories === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <Grid3X3 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Henüz kategori bulunmuyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Bu sunucu için henüz kategori eklenmemiş. Lütfen daha sonra
                  tekrar kontrol edin.
                </p>
              </div>
            ) : (
              // Categories Grid with Progressive Loading
              <ProgressiveLoader
                items={serverCategories || []}
                renderItem={(category: Category, index) => (
                  <CategoryCard
                    key={category.slug}
                    category={{
                      id: category.slug,
                      name: category.name,
                      image: category.image || "/images/default-category.png",
                    }}
                  />
                )}
                skeletonComponent={CategoryCardSkeletonItem}
                itemsPerPage={6}
                initialItems={6}
              />
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        {totalCategories > 0 && (
          <ContentFooter
            header={`${server.name} Özel Koleksiyonu`}
            message="Bu sunucuya özel tasarlanmış eşyalar ve kategorilerle oyun
                  deneyiminizi zenginleştirin"
            color="green"
          />
        )}
      </div>
    </>
  );
}
