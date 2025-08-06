"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";
import { useUserService } from "@/lib/services/user.service";
import { useReportService } from "@/lib/services/report.service";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileHistoryTimeline from "@/components/profile/ProfileHistoryTable";
import ProfileModerationPanel from "@/components/profile/ProfileModerationPanel";
import Wall from "@/components/profile/Wall";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import { User } from "@/lib/types/user";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ProfileClient = () => {
    const router = useRouter();
    const { user: authUser, isAuthenticated, isLoading } = useContext(AuthContext);
    const { website } = useContext(WebsiteContext);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const websiteId = website?.id;
    const userService = useUserService();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/sign-in?return=/profile");
            return;
        }
        if (!authUser || !websiteId) return;
        const fetchUser = async () => {
            try {
                const fetched = await userService.getUserById(authUser.id);
                setUser(fetched);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [authUser, websiteId, isAuthenticated, isLoading, router]);

    if (isLoading) return (
        <Loading show={true} message="Kullanıcı yükleniyor.."/>
    );
    if (!isAuthenticated) return null;
    if (loading) return (
        <Loading show={true} message="Kullanıcı yükleniyor.."/>
    );
    if (!user) return (
        <NotFound navigateTo={"/"} backToText={"Anasayfa'ya Dön!"} header="Aradığınız kullanıcıya ulaşamadık"></NotFound>
    );

    const stats = {
        balance: user.balance,
        chestCount: user.chest?.length || 0,
        inventoryCount: 0,
        supportCount: 0,
    };

    const info = {
        user: {
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
        },
        lastLogin: "-",
        socialLinks: {},
    };

    // Dummy tabs ve history yerine gerçek veriler eklenebilir
    const tabs = [
        { label: "Beğeniler", count: 0, content: <div>Herhangi bir beğeni işlemi bulunamadı!</div> },
        { label: "Yorumlar", count: 0, content: <div>Yorumlarınız burada listelenecek.</div> },
        { label: "Yıldızlı Ürünler", count: 0, content: <div>Yıldızlı ürünleriniz burada listelenecek.</div> },
    ];

    const historyEvents = user.historyEvents || [];

    const handleReport = async () => {
        withReactContent(Swal).fire({
            title: "Raporlama Hatası!",
            text: "Kendinizi raporlayamazsınzı!",
            icon: "error",
            timer: 2000
        })
    };

    const handleEdit = () => {
        setShowEditForm(true);
        setShowPasswordForm(false);
    };

    const handleChangePassword = () => {
        setShowPasswordForm(true);
        setShowEditForm(false);
    };

    const handleEditSave = async (data: { email: string; twoFactorEnabled: boolean }) => {
        if (!user || !websiteId) return;
        setFormLoading(true);
        try {
            await userService.updateUser(user.id, { email: data.email });
            setUser({ ...user, email: data.email });
            setShowEditForm(false);
            withReactContent(Swal).fire({
                title: "Başarılı!",
                text: "Profil bilgileriniz güncellendi.",
                icon: "success",
                timer: 2000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Profil güncellenirken bir hata oluştu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handlePasswordSave = async (data: { currentPassword: string; newPassword: string }) => {
        if (!user || !websiteId) return;
        setFormLoading(true);
        try {
            await userService.changePassword(user.id, data);
            setShowPasswordForm(false);
            withReactContent(Swal).fire({
                title: "Başarılı!",
                text: "Şifreniz başarıyla değiştirildi. Lütfen yeni şifrenizle tekrar giriş yapın.",
                icon: "success",
                timer: 3000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Şifre değiştirilirken bir hata oluştu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleCancel = () => {
        setShowEditForm(false);
        setShowPasswordForm(false);
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
            {/* Header veya Düzenleme Formları - Aynı Pozisyonda */}
            <AnimatePresence mode="wait">
                {!showEditForm && !showPasswordForm ? (
                    <motion.div
                        key="header"
                        initial={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <ProfileHeader 
                            user={user} 
                            currentUser={user} 
                            onReport={handleReport}
                            onEdit={handleEdit}
                            onChangePassword={handleChangePassword}
                        />
                    </motion.div>
                ) : showEditForm ? (
                    <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <ProfileEditForm
                            user={user}
                            onSave={handleEditSave}
                            onCancel={handleCancel}
                            loading={formLoading}
                        />
                    </motion.div>
                ) : showPasswordForm ? (
                    <motion.div
                        key="password-form"
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <PasswordChangeForm
                            user={user}
                            onSave={handlePasswordSave}
                            onCancel={handleCancel}
                            loading={formLoading}
                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>
            
            {/* Alt İçerik - Sadece Normal Durumda Görünür */}
            <AnimatePresence>
                {!showEditForm && !showPasswordForm && (
                    <motion.div 
                        key="content"
                        className="flex flex-col md:flex-row gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div className="flex-1">
                            <ProfileStats {...stats} />
                            <Wall currentUser={user} profileUser={user} initialMessages={[]} />
                            <ProfileTabs tabs={tabs} />
                            <ProfileHistoryTimeline events={historyEvents} />
                        </div>
                        <div className="w-full md:w-80 flex flex-col gap-6">
                            <ProfileInfoCard {...info} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileClient; 