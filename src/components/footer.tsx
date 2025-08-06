"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteContext } from "@/lib/context/website.context";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Moon,
  Play,
  Heart,
  ExternalLink,
  Mail,
  MapPin,
  Clock,
  Users,
  Globe,
  Shield,
  Star,
  Sparkles,
  Copy,
  Check,
  Sun,
  Twitter,
  Github,
  ShoppingCart,
  HelpCircle,
  Gift,
  Gamepad2,
} from "lucide-react";
import { Server } from "@/lib/types/server";
import Link from "next/link";
import { useTheme } from "next-themes";

type Props = {
  server: Server | null;
};

const Footer = ({ server }: Props) => {
  const { website } = useContext(WebsiteContext);
  
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { theme, setTheme, resolvedTheme } = useTheme();

  const copyToClipboard = async (text: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [buttonId]: true }));

      // 2 saniye sonra animasyonu sıfırla
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [buttonId]: false }));
      }, 2000);
    } catch (err) {
    }
  };

  const handleServerIPClick = () => {
    const serverIP = server?.ip || "play.hypixel.net";
    copyToClipboard(serverIP, "server-ip");
  };

  const socialMedias = [
    {
      key: "instagram",
      url: website?.social_media?.instagram,
      icon: <Instagram className="h-5 w-5" />,
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:border-pink-500 transition-all duration-300",
    },
    {
      key: "youtube",
      url: website?.social_media?.youtube,
      icon: <Youtube className="h-5 w-5" />,
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:border-red-500 transition-all duration-300",
    },
    {
      key: "discord",
      url: website?.social_media?.discord,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
        </svg>
      ),
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:border-indigo-500 transition-all duration-300",
    },
    {
      key: "twitter",
      url: website?.social_media?.twitter,
      icon: <Twitter className="h-5 w-5" />,
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:border-blue-500 transition-all duration-300",
    },
    {
      key: "github",
      url: website?.social_media?.github,
      icon: <Github className="h-5 w-5" />,
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 hover:border-gray-800 transition-all duration-300",
    },
    {
      key: "tiktok",
      url: website?.social_media?.tiktok,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      buttonClass:
        "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-cyan-500 hover:border-pink-500 transition-all duration-300",
    },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Sol Blok: Logo & Hakkımızda */}
          <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-2 items-start">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image || "/images/default-logo.png"}`}
                alt={website?.name || `Logo`}
                width={200}
                height={200}
                className="p-2"
                priority
              />
              <h3 className="text-xl font-extrabold mt-2 text-slate-900 dark:text-white">{website?.name}</h3>
              <p className="text-slate-700 dark:text-slate-200 text-sm max-w-xs leading-relaxed">{website?.description}</p>
              <p className="text-xs text-slate-500 font-semibold mt-2">We are not affiliated with Mojang AB or Minecraft.</p>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {socialMedias
                .filter((media) => media.url && media.url !== "#")
                .map((media) => (
                  <a
                    key={media.key}
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={media.buttonClass}
                    >
                      {media.icon}
                    </Button>
                  </a>
                ))}
            </div>
          </div>

          {/* Orta Blok: Hızlı Menü */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Hızlı Menü
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <Play className="h-4 w-4 mr-2" /> Anasayfa
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/store">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Mağaza
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/redeem">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <Gift className="h-4 w-4 mr-2" /> Kod Kullan
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/forum">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <Users className="h-4 w-4 mr-2" /> Forum
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <HelpCircle className="h-4 w-4 mr-2" /> Yardım
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-start w-full transition-colors duration-200">
                    <Shield className="h-4 w-4 mr-2" /> Destek
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-cyan-400" />
              Bağlantılar
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/rules" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Kurallar</Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Hizmet Şartları</Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Gizlilik Politikası</Link>
              </li>
            </ul>
          </div>

          {/* Orta Blok: Sunucu Bilgileri */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              Sunucu Bilgileri
            </h4>
            <div className="space-y-4">
              {/* Modern info card for server_info */}
              {website?.server_info && (
                <Card className="bg-gradient-to-br from-purple-50 to-slate-100 dark:from-gray-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-4 w-4 text-indigo-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm min-w-[90px]">Oyun:</span>
                      {website.server_info.game ? (
                        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 ml-0">{website.server_info.game}</Badge>
                      ) : null}
                    </div>
                    {website.server_info.version && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm min-w-[90px]">Sürüm:</span>
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 ml-0">{website.server_info.version}</Badge>
                      </div>
                    )}
                    {website.server_info.needs_original_minecraft !== null && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-pink-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm min-w-[90px]">Hesap Türü:</span>
                        <Badge className={`ml-0 ${website.server_info.needs_original_minecraft ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>{website.server_info.needs_original_minecraft ? 'Orijinal' : 'Crack'}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sağ Blok: Bağlantılar */}

        </div>

        <Separator className="bg-slate-200 dark:bg-slate-800 mb-8" />

        {/* Alt Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <div className="flex flex-row items-center gap-2">
            <p className="text-slate-700 dark:text-slate-200 text-sm">
              © {website?.name || "Hypixel"}, 2025 • Tüm hakları saklıdır.
            </p>
          </div>
          <div className="flex items-center justify-center flex-1">
            <Link href="https://crafter.net.tr" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Powered by</span>
              <Image
                src={(theme === "system" ? resolvedTheme : theme) === "dark" ? "/images/crafter.png" : "/images/crafter-light.png"}
                alt="Crafter"
                width={200}
                height={200}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="text-sm">Para Birimi & Dili değiştir</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {(theme === "system" ? resolvedTheme : theme) === "dark" ? (<Sun className="h-4 w-4" />) : (<Moon className="h-4 w-4" />)}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
