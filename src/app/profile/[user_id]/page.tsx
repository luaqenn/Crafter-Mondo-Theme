"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import UserActionModal from "@/components/profile/UserActionModal";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { User } from "@/lib/types/user";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const UserProfilePage = () => {
    const { user: currentUser } = useContext(AuthContext);
    const { website } = useContext(WebsiteContext);
    const params = useParams();
    const websiteId = website?.id;
    const userService = useUserService();
    const reportService = useReportService();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!params?.user_id || !websiteId) return;
            try {
                const fetched = await userService.getUserById(params.user_id as string);
                setUser(fetched);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params?.user_id, websiteId]);

    // Form gösterildiğinde smooth scroll yap
    useEffect(() => {
        if (showEditForm || showPasswordForm) {
            setTimeout(() => {
                const element = document.getElementById('edit-profile');
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Alternatif: Sayfanın en üstüne scroll yap
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }, [showEditForm, showPasswordForm]);

    if (loading) return <div className="text-center text-white py-20">Yükleniyor...</div>;
    if (!user) return <div className="text-center text-red-400 py-20">Kullanıcı bulunamadı.</div>;

    const stats = {
        balance: user.balance,
        chestCount: user.chest?.length || 0,
        inventoryCount: user.inventory?.length || 0,
        supportCount: user.supportCount || 0,
    };

    const info = {
        user: {
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
        },
        lastLogin: user.lastLogin || "-",
        socialLinks: user.socialLinks || {},
    };

    const tabs = [
        { label: "Beğeniler", count: user.likes?.length || 0, content: <div>Herhangi bir beğeni işlemi bulunamadı!</div> },
        { label: "Yorumlar", count: user.comments?.length || 0, content: <div>Yorumlar burada listelenecek.</div> },
        { label: "Yıldızlı Ürünler", count: user.favorites?.length || 0, content: <div>Yıldızlı ürünler burada listelenecek.</div> },
    ];

    const historyEvents = user.historyEvents || [];

    // Ban ve report işlemleri
    const handleReport = () => setReportModalOpen(true);
    const handleBan = () => setBanModalOpen(true);

    // Profil düzenleme işlemleri
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
                text: "Profil bilgileri güncellendi.",
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
                text: "Şifre başarıyla değiştirildi. Lütfen yeni şifrenizle tekrar giriş yapın.",
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

    const handleReportSubmit = async ({ type, reason }: { type: string; reason: string }) => {
        if (!currentUser || !websiteId) return;
        setModalLoading(true);
        try {
            await reportService.createReport(user.id, { reason, reportType: type });
            setReportModalOpen(false);
            withReactContent(Swal).fire({
                title: "Raporlandı!",
                text: "Kullanıcı başarıyla raporlandı.",
                icon: "success",
                timer: 2000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Rapor işlemi başarısız oldu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleBanSubmit = async ({ banReason }: { banReason: string }) => {
        if (!currentUser || !websiteId) return;
        setModalLoading(true);
        try {
            await userService.banUser(user.id, banReason);
            setBanModalOpen(false);
            withReactContent(Swal).fire({
                title: "Banlandı!",
                text: "Kullanıcı başarıyla banlandı.",
                icon: "success",
                timer: 2000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Ban işlemi başarısız oldu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
            <UserActionModal
                open={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                onSubmit={handleReportSubmit}
                action="report"
                loading={modalLoading}
            />
            <UserActionModal
                open={banModalOpen}
                onClose={() => setBanModalOpen(false)}
                onSubmit={handleBanSubmit}
                action="ban"
                loading={modalLoading}
            />
            
            {/* Header veya Düzenleme Formları - Aynı Pozisyonda */}
            <AnimatePresence mode="wait">
                {!showEditForm && !showPasswordForm ? (
                    <motion.div
                        key="header"
                        initial={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        
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
                            <Wall currentUser={currentUser} profileUser={user} initialMessages={[]} />
                            <ProfileTabs tabs={tabs} />
                            <ProfileHistoryTimeline events={historyEvents} />
                        </div>
                        <div className="w-full md:w-80 flex flex-col gap-6">
                            <ProfileInfoCard {...info} />
                            <ProfileModerationPanel
                                currentUser={currentUser}
                                user={user}
                                onReport={handleReport}
                                onBan={handleBan}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfilePage;
