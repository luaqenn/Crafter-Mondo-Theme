"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";

import { Server } from "@/lib/types/server";
import { formatTimeAgo } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { useWebsitePostsService } from "@/lib/services/posts.service";
import LatestPostCard from "@/components/LatestPostCard";
import InnovativeSignups from "@/components/widgets/InnovativeSignups";

// Lazy load heavy components
const InnovativeCarousel = dynamic(
  () => import("@/components/ui/innovative-carousel").then(mod => ({ default: mod.InnovativeCarousel })),
  {
    ssr: false,
    loading: () => <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />
  }
);

const SlideContent = dynamic(
  () => import("@/components/ui/innovative-carousel").then(mod => ({ default: mod.SlideContent })),
  { ssr: false }
);

const AuthForm = dynamic(
  () => import("@/components/widgets/auth-form").then(mod => ({ default: mod.AuthForm })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />
  }
);

const DiscordWidget = dynamic(
  () => import("@/components/widgets/discord-widget"),
  {
    ssr: false,
    loading: () => <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />
  }
);

// UI ve Widget Component'leri
import Widget from "@/components/widgets/widget";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRocket, FaUsers, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";

// Boş liste durumunda gösterilecek component
const EmptyList = ({ message }: { message: string }) => (
  <div className="text-center p-8">
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
      <FaStar className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {message}
    </p>
  </div>
);

// Yükleniyor durumunda gösterilecek widget iskeleti
const WidgetSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-3/5" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);



export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();

  const { getPosts } = useWebsitePostsService(website?.id);
  const [server, setServer] = useState<Server | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<any[] | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // Memoized carousel items
  const carouselItems = useMemo(() =>
    website?.sliders?.map((slider) => ({
      id: slider.id,
      content: (
        <SlideContent
          image={`${process.env.NEXT_PUBLIC_BACKEND_URL}${slider.image}`}
          title={slider.text}
          description={slider.description}
          buttonText={slider.buttonText}
          buttonLink={slider.route}
        />
      ),
    })) || [], [website?.sliders]
  );

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    try {
      const servers = await getServers();
      setServer(servers.find((server) => server.port === 25565) || servers[0]);
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Sunucu bilgileri yüklenirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Son gönderileri çek
    const fetchPosts = async () => {
      if (!website?.id) return; // id yoksa fetch etme
      try {
        const res = await getPosts({ websiteId: website.id, params: { limit: 5, sortBy: 'createdAt', sortOrder: 'desc', status: 'published' } });

        setLatestPosts(res.data);
      } catch {
        setLatestPosts([]);
      } finally {
        setIsPostsLoading(false);
      }
    };
    fetchPosts();
  }, [website?.id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main id="main-content" className="pt-16 bg-black">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Hoş Geldiniz!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                En iyi Minecraft deneyimi için aramıza katılın ve harika anılar biriktirin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group text-lg"
                >
                  <FaRocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Hemen Başla
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 group text-lg"
                >
                  <FaUsers className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Topluluğu Keşfet
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div
              className={`${!isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"
                } space-y-6 order-2 lg:order-1`}
            >
              {carouselItems.length > 0 && (
                <Suspense fallback={<div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />}>
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <InnovativeCarousel
                      items={carouselItems}
                      autoplay={true}
                      autoplayDelay={5000}
                      showProgress={true}
                      height="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                    />
                  </div>
                </Suspense>
              )}

              {/* Son Gönderiler - Carousel altı yatay kartlar */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaStar className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Son Gönderiler
                  </h2>
                </div>
                
                {isPostsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-start space-x-4">
                          <Skeleton className="h-12 w-12 rounded-xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : latestPosts && latestPosts.length > 0 ? (
                  <div className="space-y-4">
                    {[...latestPosts].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
                      .map((post) => (
                        <div key={post.id} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                          <LatestPostCard post={post} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyList message="Henüz gönderi yok." />
                )}
              </div>
            </div>

            <div
              className={`${!isAuthenticated ? "lg:col-span-4" : "lg:col-span-3"
                } space-y-6 order-1 lg:order-2`}
            >
              {!isAuthenticated && (
                <div className="relative z-10">
                  <Suspense fallback={<div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />}>
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl">
                      <AuthForm asWidget={true} />
                    </div>
                  </Suspense>
                </div>
              )}



              {website?.discord && (
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl">
                  <Suspense fallback={<div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse rounded-2xl" />}>
                    <DiscordWidget guild_id={website?.discord.guild_id ?? ""} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
