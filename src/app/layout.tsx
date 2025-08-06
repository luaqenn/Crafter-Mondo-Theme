import type { Metadata, Viewport } from "next";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";
import { PWAProvider } from "@/lib/context/pwa-provider.context";
import PWAInstaller from "@/components/pwa-installer";
import "@/styles/globals.css";
import { MainLayout } from "@/components/main-layout";
import { DEFAULT_APPCONFIG } from "@/lib/constants/pwa";
import { GoogleAnalytics } from '@next/third-parties/google'
import type { AppConfig } from "@/lib/types/app";
import { CartProvider } from "@/lib/context/cart.context";
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";
import { getAppConfigDirect } from "@/lib/services/app-config.service";
import { StorePreloadManager } from "@/components/store/StorePreloadManager";

async function getAppConfig(): Promise<AppConfig> {
  if (typeof window === "undefined") {
    // SSR/SSG
    return getAppConfigDirect();
  }
  try {
    const fetchOptions: any = {
      cache: 'no-store'
    };
    
    console.log('🔍 getAppConfig called, NODE_ENV:', process.env.NODE_ENV);
    
    // Server-side fetch için absolute URL gerekli
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/app-config`;
    
    console.log('🔍 Fetching URL:', url);
    console.log('🔍 Fetch options:', fetchOptions);
    
    const response = await fetch(url, fetchOptions);
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`Config API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🔍 Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ App config fetch error:', error);
    // Varsayılan değerler
    return DEFAULT_APPCONFIG;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();

  return {
    title: {
      default: appConfig.appName,
      template: `%s | ${appConfig.appName}`,
    },
    description: appConfig.description,
    manifest: "/api/manifest",
    keywords: appConfig.keywords,
    authors: [{ name: appConfig.appName }],
    creator: appConfig.appName,
    publisher: appConfig.appName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      title: appConfig.appName,
      description: appConfig.description,
      siteName: appConfig.appName,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${appConfig.appName}&description=${appConfig.description}&logo=${appConfig.icon192}&brand=${appConfig.appName}`,
          width: 192,
          height: 192,
          alt: appConfig.appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: appConfig.appName,
      description: appConfig.description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?title=${appConfig.appName}&description=${appConfig.description}&logo=${appConfig.icon192}&brand=${appConfig.appName}`,
          width: 192,
          height: 192,
          alt: appConfig.appName,
        },
      ],
    },
    icons: {
      icon: [
        {
          url: appConfig.favicon,
          sizes: "32x32",
          type: "image/x-icon",
        },
        {
          url: appConfig.icon192,
          sizes: "192x192",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: appConfig.icon192,
          sizes: "192x192",
          type: "image/png",
        },
      ],
      shortcut: [appConfig.favicon],
    },
    appleWebApp: {
      capable: true,
      title: appConfig.appName,
      statusBarStyle: "default",
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "format-detection": "telephone=no",
      "msapplication-TileColor": appConfig.themeColor,
      "msapplication-tap-highlight": "no",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const appConfig = await getAppConfig();

  return {
    themeColor: appConfig.themeColor,
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    viewportFit: "cover",
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

// RootLayout component'i aynı kalıyor
export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang="tr">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://minotar.net" />
        <link rel="preconnect" href="https://api.crafter.net.tr" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.crafter.net.tr" />
        <link rel="dns-prefetch" href="//minotar.net" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preload critical resources */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <link rel="preload" href="/api/manifest" as="fetch" crossOrigin="anonymous" />
            <link rel="preload" href={appConfig.favicon} as="image" />
          </>
        )}

        {/* Resource hints */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <link rel="prefetch" href="/store" />
            <link rel="prefetch" href="/cart" />
            <link rel="prefetch" href="/chest" />
            <link rel="prefetch" href="/profile" />
            <link rel="prefetch" href="/redeem" />
            <link rel="prefetch" href="/wallet" />
            <link rel="prefetch" href="/auth/sign-in" />
            <link rel="prefetch" href="/auth/sign-up" />
          </>
        )}

        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <ThemeProviderWrapper>
          <PWAProvider initialConfig={appConfig}>
            <WebsiteProvider>
              <AuthProvider>
                <CartProvider>

                  <MainLayout>{children}</MainLayout>
                  <PWAInstaller />
                  <StorePreloadManager />

                </CartProvider>
              </AuthProvider>
            </WebsiteProvider>
          </PWAProvider>
        </ThemeProviderWrapper>
      </body>
      {appConfig.gaId && (
        <GoogleAnalytics gaId={appConfig.gaId} />
      )}
    </html>
  );
}
