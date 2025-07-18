"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import headerBg from "@/assets/images/auth-bg-login.jpg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { WebsiteContext } from "@/lib/context/website.context";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
  const { resetPassword } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setIsValidToken(false);
      withReactContent(Swal).fire({
        title: "Geçersiz Bağlantı",
        text: "Şifre sıfırlama bağlantısı geçersiz veya eksik. Lütfen e-postanızdaki bağlantıyı kullanın.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const new_password = formData.get("new_password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    if (new_password !== confirm_password) {
      withReactContent(Swal).fire({
        title: "Şifreler Eşleşmiyor",
        text: "Yeni şifre ve şifre onayı eşleşmiyor. Lütfen tekrar deneyin.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return;
    }

    if (new_password.length < 6) {
      withReactContent(Swal).fire({
        title: "Şifre Çok Kısa",
        text: "Şifre en az 6 karakter olmalıdır.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return;
    }

    try {
      await resetPassword({
        token,
        new_password,
        confirm_password,
      });
      withReactContent(Swal).fire({
        title: "Şifre Başarıyla Değiştirildi",
        text: "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.",
        icon: "success",
        confirmButtonText: "Giriş Yap",
      }).then(() => {
        router.push("/auth/sign-in");
      });
    } catch (e: any) {
      withReactContent(Swal).fire({
        title: "Hata",
        text: e.message || "Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
        <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Geçersiz Bağlantı
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama isteği gönderin.
            </p>
            <a
              href="/auth/password/forgot"
              className="inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Yeni Şifre Sıfırlama İsteği
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Left Column: Image and Welcome Text (Visible on Medium screens and up) */}
      <div className="relative hidden md:flex w-full md:w-1/2 flex-col items-center justify-center text-white text-center p-8 bg-gradient-to-br from-sky-400 to-blue-600 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0">
          <Image
            src={headerBg}
            alt="Arka Plan"
            layout="fill"
            objectFit="cover"
            className="opacity-20 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                website?.image || "/images/default-logo.png"
              }`}
              alt="Logo"
              width={200}
              height={200}
              objectFit="contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Yeni Şifrenizi Belirleyin
          </h1>
          <p className="mt-4 text-lg max-w-sm">
            Güvenli bir şifre seçin ve hesabınıza tekrar erişim sağlayın.
          </p>
        </div>
      </div>

      {/* Right Column: Reset Password Form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <div className="w-40 h-12 relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                  website?.image || "/images/default-logo.png"
                }`}
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Yeni Şifre Belirle
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2 mb-8">
            Yeni şifrenizi girin ve onaylayın.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new_password" className="sr-only">
                Yeni Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="new_password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="form-input block w-full pl-10 pr-10 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Yeni Şifre"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="sr-only">
                Şifre Onayı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="form-input block w-full pl-10 pr-10 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Şifre Onayı"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Şifreyi Değiştir
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
            Şifrenizi hatırladınız mı?{" "}
            <a
              href="/auth/sign-in"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              Giriş Yap
            </a>
          </p>

          <p className="flex flex-row items-center justify-center text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            Powered by{" "}
            <Link
              href={"https://crafter.net.tr/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={"/images/crafter.png"}
                alt={""}
                width={90}
                height={30}
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
