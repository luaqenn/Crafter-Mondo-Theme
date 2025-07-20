import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Toggle } from '../ui/toggle';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, Shield, ArrowLeft, Save, X } from 'lucide-react';
import { User } from '@/lib/types/user';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileEditFormProps {
    user: User;
    onSave: (data: { email: string; twoFactorEnabled: boolean }) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    user,
    onSave,
    onCancel,
    loading = false
}) => {
    const [email, setEmail] = useState(user.email);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('E-posta adresi gereklidir');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Geçerli bir e-posta adresi giriniz');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        validateEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        
        if (!isEmailValid) {
            setIsValid(false);
            return;
        }

        setIsValid(true);
        await onSave({ email, twoFactorEnabled });
    };

    return (
        <div id='edit-profile'>
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                            <Mail className="mr-3 h-6 w-6 text-blue-500" />
                            Profil Düzenle
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
                        {/* E-posta Alanı */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                E-posta Adresi
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                placeholder="ornek@email.com"
                                className={`transition-all duration-200 ${
                                    emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                }`}
                                disabled={loading}
                            />
                            <AnimatePresence>
                                {emailError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">
                                                {emailError}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                E-posta adresiniz güvenlik ve bildirimler için kullanılır
                            </p>
                        </div>

                        {/* 2FA Toggle */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                        <Shield className="mr-2 h-4 w-4 text-green-500" />
                                        İki Faktörlü Doğrulama (2FA)
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Hesabınızı daha güvenli hale getirmek için 2FA'yı etkinleştirin
                                    </p>
                                </div>
                                <Toggle
                                    pressed={twoFactorEnabled}
                                    onPressedChange={setTwoFactorEnabled}
                                    disabled={loading}
                                    className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                                >
                                    {twoFactorEnabled ? 'Aktif' : 'Pasif'}
                                </Toggle>
                            </div>
                            
                            <AnimatePresence>
                                {twoFactorEnabled && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                            <AlertDescription className="text-sm text-green-700 dark:text-green-300">
                                                <strong>2FA Aktif!</strong> Hesabınız artık daha güvenli. 
                                                Giriş yaparken ek doğrulama adımı gerekecek.
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Kaydet
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

export default ProfileEditForm; 