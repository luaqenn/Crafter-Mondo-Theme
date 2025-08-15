"use client";

import DiscordIcon from "@/assets/icons/social/DiscordIcon";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Navbar } from "./navbar";
import ServerStatusBar from "./header-components/ServerStatusBar";
import { Button } from "./ui/button";
import { Play, Users, Zap, Star, ChevronDown, ArrowDown, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Header() {
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    players?: { online: number; max: number };
    version?: string;
    type?: string;
  } | null>(null);
  const [discordStatus, setDiscordStatus] = useState<{
    online: number;
    invite: string;
    name: string;
  } | null>(null);
  const [serverIP, setServerIP] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchDataMinecraft() {
      try {
        const servers = await getServers();
        if (servers && servers.length > 0) {
          const selectedServer =
            servers.find((s) => s.port === 25565) || servers[0];
          const { ip, port } = selectedServer;
          setServerIP(ip);
          const res = await fetch(
            `/api/status/minecraft?ip=${ip}&port=${port}`,
            { cache: "no-store" }
          );
          const data = await res.json();

          setServerStatus({
            online: data.online,
            players: data.players,
            version: data.version,
            type: data.type,
          });
        }
      } catch (error) {
        setServerStatus({ online: false });
      }
    }

    async function fetchDataDiscord() {
      try {
        if (!website?.discord?.guild_id) return;
        const res = await fetch(
          `/api/status/discord?guildId=${website?.discord.guild_id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setDiscordStatus(data);
      } catch (error) {
        setDiscordStatus(null);
      }
    }

    fetchDataMinecraft();
    fetchDataDiscord();

    const interval1 = setInterval(fetchDataMinecraft, 60_000);
    const interval2 = setInterval(fetchDataDiscord, 60_000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  const scrollToContent = () => {
    const navbarHeight = 80; // Navbar yüksekliği
    const element = document.getElementById('main-content');
    if (element) {
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const copyServerIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setIsCopied(true);
      toast.success('IP adresi kopyalandı!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('IP kopyalanamadı!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '600',
        },
      });
    }
  };

  return (
    <header className="relative h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="relative h-full flex flex-col">
          {/* Animated background particles */}
          <div className="absolute inset-10 overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500/30 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-purple-500/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-pink-500/30 rounded-full animate-bounce"></div>
            <div className="absolute top-60 left-1/4 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse"></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-purple-400/40 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-10 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-500/50 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-10 w-2 h-2 bg-purple-500/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-pink-500/30 rounded-full animate-bounce"></div>
          </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Top section with server info */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              {/* Logo */}
              <div className="relative group">
                <div className="relative z-10">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                      website?.image || "/images/default-logo.png"
                    }`}
                    alt={website?.name || "Logo"}
                    width={1000}
                    height={200}
                    className="max-h-32 w-auto sm:max-h-40 md:max-h-48 lg:max-h-64 xl:max-h-80 mx-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                    priority
                  />
                </div>
                {/* Glow effect - düzeltildi */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl group-hover:blur-4xl group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500 scale-150 rounded-full"></div>
              </div>

              {/* Tagline */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg tracking-wider">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-minecraft">
                    {website?.name || "Crafter"}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Minecraft'ın en büyük topluluğuna katılın ve efsanevi maceralara atılın!
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button 
                  size="lg" 
                  onClick={copyServerIP}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group text-lg font-semibold"
                >
                  {isCopied ? (
                    <Check className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  {isCopied ? "IP Kopyalandı!" : "Hemen Oyna"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl backdrop-blur-sm transition-all duration-300 group text-lg font-semibold"
                >
                  <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Discord'a Katıl
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom section with stats */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Server Status */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Sunucu Durumu</p>
                        <p className="text-xl font-semibold text-white">
                          {serverStatus?.online ? "Çevrimiçi" : "Çevrimdışı"}
                        </p>
                      </div>
                    </div>
                    {serverStatus?.players && (
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">
                          {serverStatus.players.online}
                        </p>
                        <p className="text-sm text-gray-300">
                          / {serverStatus.players.max} Oyuncu
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Discord Status */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <DiscordIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Discord</p>
                        <p className="text-xl font-semibold text-white">
                          {discordStatus?.online || 0} Üye
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Çevrimiçi</p>
                    </div>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Topluluk</p>
                        <p className="text-xl font-semibold text-white">
                          Aktif
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll down arrow */}
          <div className="absolute bottom-8 right-8 animate-bounce">
            <button
              onClick={scrollToContent}
              className="group p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <ArrowDown className="w-6 h-6 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent"></div>
      </div>

      <Navbar />

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden.md\\:flex {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
