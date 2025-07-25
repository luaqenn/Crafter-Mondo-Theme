"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useStaffFormService } from "@/lib/services/staff-form.service";
import { StaffFormApplication } from "@/lib/types/staff-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/lib/context/auth.context";
import {
  FaClipboardCheck,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import dynamic from "next/dynamic";

const AuthForm = dynamic(
  () =>
    import("@/components/widgets/auth-form").then((mod) => ({
      default: mod.AuthForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
    ),
  }
);

const statusBadge = (status: string) => {
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold">
        <FaHourglassHalf className="inline text-sm" /> Beklemede
      </span>
    );
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold">
        <FaCheckCircle className="inline text-sm" /> Onaylandı
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold">
        <FaTimesCircle className="inline text-sm" /> Reddedildi
      </span>
    );
  return null;
};

export default function StaffApplicationsPage() {
  const router = useRouter();
  const { getMyApplications } = useStaffFormService();
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);
  const [applications, setApplications] = useState<StaffFormApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/sign-in?return=/staff-forms/applications");
      return;
    }
    if (!isAuthenticated) return;
    setLoading(true);
    getMyApplications()
      .then((apps) => setApplications(apps))
      .catch(() => setError("Başvurular yüklenemedi."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || loading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="mb-6">
          <FaClipboardCheck className="mx-auto text-5xl text-blue-500 mb-2" />
          <h1 className="text-3xl font-bold text-center">Başvurularım</h1>
        </div>
        <Suspense
          fallback={
            <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
          }
        >
          <AuthForm asWidget={true} />
        </Suspense>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <FaExclamationCircle className="text-5xl text-red-500 mb-2" />
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-xl px-6 py-4 text-center font-semibold shadow mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <FaClipboardCheck className="mx-auto text-5xl text-blue-500 mb-2" />
          <h1 className="text-4xl font-extrabold mb-2">Başvurularım</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Yaptığınız başvuruların durumunu buradan takip edebilirsiniz.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {applications.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <FaCheckCircle className="text-4xl text-green-500 mb-2" />
              <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-xl px-6 py-4 text-center font-semibold shadow">
                Henüz başvurunuz yok.
              </div>
            </div>
          )}
          {applications.map((app, i) => (
            <Card
              key={app.id}
              className="shadow-lg border-2 border-blue-100 dark:border-blue-900 hover:scale-[1.025] transition-transform"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <FaClipboardCheck className="inline text-lg" />
                  {app.form?.title || "Form"}
                </CardTitle>
                {/* Açıklama yoksa CardDescription gösterme */}
              </CardHeader>
              <CardContent>
                <div className="mb-2">{statusBadge(app.status?.toUpperCase?.())}</div>
                <div className="mb-2 text-sm text-gray-500">
                  Başvuru Tarihi: {new Date(app.createdAt).toLocaleString("tr-TR")}
                </div>
                {app.form?.slug && (
                  <Button
                    onClick={() => router.push(`/staff-forms/${app.form?.slug}`)}
                    variant="outline"
                    className="w-full"
                  >
                    Formu Görüntüle
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
