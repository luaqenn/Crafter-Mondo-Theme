import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import {
  Flag,
  Ban,
  Edit,
  KeyRound,
  ShieldCheck,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { PERMISSIONS } from "@/lib/constants/permissions";
import type { User } from "@/lib/types/user";
import Link from "next/link";

interface ProfileHeaderProps {
  user: User;
  currentUser: User | null;
  onReport: () => void;
  onBan?: () => void;
  onEdit?: () => void;
  onChangePassword?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  currentUser,
  onReport,
  onBan,
  onEdit,
  onChangePassword,
}) => {
  const isSelf = currentUser && user.id === currentUser.id;
  const canBan = currentUser?.role.permissions.includes(
    PERMISSIONS.MANAGE_USERS
  );
  const roleColor = user.role?.color || "#a855f7";

  // Tarih formatlaması için (opsiyonel)
  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString(
    "tr-TR",
    {
      year: "numeric",
      month: "long",
    }
  );

  return (
    <>
      {/* Banlı kullanıcı uyarısı */}
      {user.banned && user.bannedBy && (
        <div className="w-full flex justify-center">
          <div className="bg-red-600 text-white text-2xl font-extrabold py-6 px-8 rounded-2xl shadow-2xl border-4 border-red-800 mb-6 mt-2 animate-pulse text-center max-w-2xl">
            Bu kullanıcı
            {user.bannedAt && (
              <span className="mx-2 underline">
                {new Date(user.bannedAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            tarihinde
            <Link href={`/profile/${user.bannedBy.id}`}>
              <span
                className="mx-2 font-bold underline"
                style={{ color: user.bannedBy.role.color }}
              >
                {user.bannedBy.username}
              </span>
            </Link>
            tarafından yasaklanmıştır.
          </div>
        </div>
      )}
      <div className="relative w-full">
        {/* Banner Bölümü */}
        <div
          className="h-48 md:h-64 rounded-2xl bg-cover bg-center relative shadow-lg"
          style={{ backgroundImage: 'url("/images/profile-bg.png")' }}
        >
          {/* Okunabilirlik için banner üzerine koyu bir katman */}
          <div className="absolute inset-0 bg-black/40 rounded-2xl" />
        </div>

        {/* Eylem Düğmeleri (Banner'ın üzerinde) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          {isSelf ? (
            <>
              <Button
                onClick={onEdit}
                size="sm"
                className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300"
              >
                <Edit size={16} className="mr-2" />
                Profili Düzenle
              </Button>
              <Button
                onClick={onChangePassword}
                size="sm"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white transition-all duration-300"
              >
                <KeyRound size={16} className="mr-2" />
                Şifre Değiştir
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onReport}
                size="sm"
                variant="destructive"
                className="bg-red-600/80 hover:bg-red-600 border border-red-500/50 backdrop-blur-sm text-white shadow-lg shadow-red-500/20 transition-all duration-300"
              >
                <Flag size={16} className="mr-2" />
                Rapor Et
              </Button>
              {canBan && onBan && (
                <Button
                  onClick={onBan}
                  size="sm"
                  className="bg-yellow-600/80 hover:bg-yellow-600 border border-yellow-500/50 backdrop-blur-sm text-white shadow-lg shadow-yellow-500/20 transition-all duration-300"
                >
                  <Ban size={16} className="mr-2" />
                  {user.banned ? "Yasağı kaldır" : "Yasakla"}
                </Button>
              )}
            </>
          )}
        </div>

        {/* Ana Profil Kartı */}
        <div className="relative px-4 sm:px-6 -mt-20">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-visible">
            <CardContent className="p-6 text-center">
              {/* Avatar */}
              <div className="relative w-36 h-36 mx-auto -mt-24 mb-4">
                <div
                  className="absolute inset-0 rounded-full blur-xl animate-pulse"
                  style={{
                    background: `linear-gradient(45deg, ${roleColor}60, #3b82f660)`,
                  }}
                />
                <Avatar
                  username={user.username}
                  size={128}
                  className="w-36 h-36 border-4 border-white/50 dark:border-gray-800/50 shadow-xl relative z-10"
                />
              </div>

              {/* Kullanıcı Bilgileri */}
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                  {user.username}
                </h1>
                {user.role && (
                  <Badge
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${roleColor}e0`, // Rengin opaklığını biraz artırdık
                      boxShadow: `0 4px 20px ${roleColor}50`,
                    }}
                  >
                    <ShieldCheck size={14} className="mr-1.5" />
                    {user.role.name}
                  </Badge>
                )}
                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm mt-2">
                  {user.email}
                </p>
              </div>

              {/* İstatistikler Bölümü */}
              <div className="mt-6 flex justify-center items-center gap-4 sm:gap-8 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-gray-500" />
                    <span className="text-lg font-semibold">
                      {formattedJoinDate}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Katılım Tarihi
                  </span>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-gray-500" />
                    <span className="text-lg font-semibold">
                      {user.messages?.length || 0}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Gönderi
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
