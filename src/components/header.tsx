"use client";

import DiscordIcon from "@/assets/icons/social/DiscordIcon";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Navbar } from "./navbar";
import ServerStatusBar from "./header-components/ServerStatusBar";

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

  useEffect(() => {
    async function fetchDataMinecraft() {
      try {
        const servers = await getServers();
        if (servers && servers.length > 0) {
          const selectedServer =
            servers.find((s) => s.port === 25565) || servers[0];
          const { ip, port } = selectedServer;
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

  return (
    <header id="header" className="relative">
      <div className="h-80 flex flex-col relative z-30">
        {/* Server Info & Buttons */}
        <div
          className="absolute w-full top-24 md:top-32"
          style={{ zIndex: 9999 }}
        >
          <div className="px-8 md:px-20 container mx-auto w-full flex justify-start flex-col md:flex-row md:justify-between gap-4">
            {/* Server Status */}
            <div className="mt-6 md:mt-0 hidden md:flex flex-row items-center justify-start gap-4 md:block">
              <div className="transition-all duration-300 hover:scale-[1.03] hover:bg-blue-100/5 p-1 rounded-lg">
                <ServerStatusBar status={serverStatus} />
              </div>
            </div>

            {/* Discord Button */}
            <a
              href={discordStatus?.invite || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 md:mt-0 hidden md:flex flex-row-reverse items-center justify-end gap-4 md:block group transition-all duration-300 hover:scale-[1.03] hover:bg-blue-100/5 p-1 rounded-lg"
            >
              <div className="md:text-right font-medium">
                <div className="text-gray-300 group-hover:text-blue-300 transition">
                  {discordStatus ? discordStatus.online : "-"} ÜYE ÇEVRİMİÇİ
                </div>
                <span className="text-white text-sm uppercase opacity-50 group-hover:opacity-80">
                  DISCORD TOPLULUĞU
                </span>
              </div>
              <div className="header-icon w-14 h-14 bg-blue-100/10 rounded-lg flex items-center justify-center group-hover:bg-blue-100/20 transition">
                <DiscordIcon className="w-10 h-10" />
              </div>
            </a>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center mt-10 md:mt-auto mb-12 md:mb-0 w-full relative z-20 md:z-30">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
              website?.image || "/images/default-logo.png"
            }`}
            alt={website?.name || "Logo"}
            width={200}
            height={35}
            className="max-h-logo mb-20 z-30 hover:scale-105 transition-all duration-300"
            priority
          />
        </div>

        {/* Background Image */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.theme.header.bannerImage || "/images/header-bg.webp"})` }}
        />
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
