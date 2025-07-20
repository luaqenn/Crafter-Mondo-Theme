import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, KeyRound, ArrowLeft, Save, X, Eye, EyeOff } from 'lucide-react';
import { User } from '@/lib/types/user';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordChangeFormProps {
    user: User;
    onSave: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
    user,
    onSave,
    onCancel,
    loading = false
}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});
    const [isValid, setIsValid] = useState(false);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Mevcut şifre kontrolü
        if (!currentPassword) {
            newErrors.currentPassword = 'Mevcut şifre gereklidir';
        }

        // Yeni şifre kontrolü
        if (!newPassword) {
            newErrors.newPassword = 'Yeni şifre gereklidir';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
        }

        // Şifre onay kontrolü
        if (newPassword && !confirmPassword) {
            newErrors.confirmPassword = 'Şifre onayı gereklidir';
        } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        setErrors(newErrors);
        const isValidForm = Object.keys(newErrors).length === 0;
        setIsValid(isValidForm);
        return isValidForm;
    };

    const validateFormWithValue = (field: keyof typeof errors, value: string) => {
        const newErrors: typeof errors = { ...errors };

        switch (field) {
            case 'currentPassword':
                newErrors.currentPassword = value ? undefined : 'Mevcut şifre gereklidir';
                break;
            case 'newPassword':
                if (!value) {
                    newErrors.newPassword = 'Yeni şifre gereklidir';
                } else if (value.length < 8) {
                    newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    newErrors.newPassword = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
                } else {
                    newErrors.newPassword = undefined;
                }
                // Yeni şifre değiştiğinde şifre onay alanını da kontrol et
                if (value && confirmPassword && value !== confirmPassword) {
                    newErrors.confirmPassword = 'Şifreler eşleşmiyor';
                } else if (value && !confirmPassword) {
                    newErrors.confirmPassword = 'Şifre onayı gereklidir';
                } else if (value && confirmPassword && value === confirmPassword) {
                    newErrors.confirmPassword = undefined;
                }
                break;
            case 'confirmPassword':
                if (newPassword && !value) {
                    newErrors.confirmPassword = 'Şifre onayı gereklidir';
                } else if (newPassword && value && newPassword !== value) {
                    newErrors.confirmPassword = 'Şifreler eşleşmiyor';
                } else if (newPassword && value && newPassword === value) {
                    newErrors.confirmPassword = undefined;
                }
                break;
        }

        setErrors(newErrors);
        const isValidForm = Object.keys(newErrors).filter(key => newErrors[key as keyof typeof newErrors]).length === 0;
        setIsValid(isValidForm);
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        await onSave({ currentPassword, newPassword });
    };

    return (
        <div>
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                            <KeyRound className="mr-3 h-6 w-6 text-orange-500" />
                            Şifre Değiştir
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mevcut Şifre */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mevcut Şifre
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCurrentPassword(value);
                                        // Form geçerliliğini kontrol et
                                        validateFormWithValue('currentPassword', value);
                                    }}
                                    placeholder="Mevcut şifrenizi girin"
                                    className={`pr-10 transition-all duration-200 ${
                                        errors.currentPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                            <AnimatePresence>
                                {errors.currentPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.currentPassword}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Yeni Şifre */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Yeni Şifre
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewPassword(value);
                                        // Form geçerliliğini kontrol et
                                        validateFormWithValue('newPassword', value);
                                    }}
                                    placeholder="Yeni şifrenizi girin"
                                    className={`pr-10 transition-all duration-200 ${
                                        errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                            <AnimatePresence>
                                {errors.newPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.newPassword}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Şifre en az 8 karakter olmalı ve büyük harf, küçük harf ve rakam içermelidir
                            </p>
                        </div>

                        {/* Şifre Onay */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Şifre Onayı
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setConfirmPassword(value);
                                        // Form geçerliliğini kontrol et
                                        validateFormWithValue('confirmPassword', value);
                                    }}
                                    placeholder="Yeni şifrenizi tekrar girin"
                                    className={`pr-10 transition-all duration-200 ${
                                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                            <AnimatePresence>
                                {errors.confirmPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {errors.confirmPassword}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Güvenlik Uyarısı */}
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Güvenlik Notu:</strong> Şifrenizi değiştirdikten sonra tüm cihazlardan çıkış yapılacaktır. 
                                Yeni şifrenizle tekrar giriş yapmanız gerekecektir.
                            </AlertDescription>
                        </Alert>

                        {/* Butonlar */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !isValid}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Değiştiriliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Şifreyi Değiştir
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordChangeForm; 