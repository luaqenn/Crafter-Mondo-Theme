import type { Metadata } from "next";
import type { AppConfig } from "@/lib/types/app";

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

export interface DynamicMetadataParams {
  appConfig: AppConfig;
  pageMetadata: PageMetadata;
  pathname?: string;
  dynamicData?: Record<string, any>;
}

export function generateDynamicMetadata({
  appConfig,
  pageMetadata,
  pathname,
  dynamicData = {}
}: DynamicMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = pathname ? `${baseUrl}${pathname}` : baseUrl;
  
  // Dinamik verileri description'a ekle
  let finalDescription = pageMetadata.description;
  if (dynamicData.description) {
    finalDescription = dynamicData.description;
  }
  
  // Dinamik title oluştur
  let finalTitle = pageMetadata.title;
  if (dynamicData.title) {
    finalTitle = dynamicData.title;
  }
  
  // Dinamik keywords
  const finalKeywords = [
    ...(pageMetadata.keywords || []),
    ...(dynamicData.keywords || []),
    ...appConfig.keywords
  ];
  
  // Dinamik image
  const finalImage = dynamicData.image || pageMetadata.image || `${baseUrl}/api/og?title=${encodeURIComponent(finalTitle)}&description=${encodeURIComponent(finalDescription)}&brand=${encodeURIComponent(appConfig.appName)}`;
  
  // Canonical URL
  const canonicalUrl = pageMetadata.canonical || fullUrl;

  return {
    title: {
      default: finalTitle,
      template: `%s | ${appConfig.appName}`,
    },
    description: finalDescription,
    keywords: finalKeywords,
    authors: [{ name: appConfig.appName }],
    creator: appConfig.appName,
    publisher: appConfig.appName,
    robots: {
      index: !pageMetadata.noIndex,
      follow: !pageMetadata.noIndex,
      googleBot: {
        index: !pageMetadata.noIndex,
        follow: !pageMetadata.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: canonicalUrl,
      title: finalTitle,
      description: finalDescription,
      siteName: appConfig.appName,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },
    alternates: {
      canonical: canonicalUrl,
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

// Sayfa türlerine göre varsayılan metadata
export const PAGE_METADATA: Record<string, PageMetadata | Record<string, PageMetadata>> = {
  // Ana sayfa
  home: {
    title: "Ana Sayfa",
    description: "Minecraft sunucumuzda eğlenceli vakit geçirin! Oyuncular, sunucu durumu ve daha fazlası.",
    keywords: ["minecraft", "sunucu", "oyun", "ana sayfa"],
  },
  
  // Mağaza
  store: {
    title: "Mağaza",
    description: "Minecraft sunucumuz için özel ürünler ve paketler. VIP, özel eşyalar ve daha fazlası.",
    keywords: ["mağaza", "vip", "paket", "satın al"]
  },
  
  // Sepet
  cart: {
    title: "Sepet",
    description: "Alışveriş sepetiniz. Ürünlerinizi gözden geçirin ve güvenli ödeme yapın.",
    keywords: ["sepet", "ödeme", "alışveriş"],
    noIndex: true,
  },
  
  // Profil
  profile: {
    title: "Profil",
    description: "Kullanıcı profiliniz. Ayarlar, istatistikler ve hesap yönetimi.",
    keywords: ["profil", "hesap", "ayarlar"],
  },
  
  // Sandık
  chest: {
    title: "Sandık",
    description: "Oyunda kazandığınız ödüller ve eşyalar. Sandığınızı açın ve ödüllerinizi alın.",
    keywords: ["sandık", "ödül", "eşya"],
  },
  
  // Cüzdan
  wallet: {
    title: "Cüzdan",
    description: "Dijital cüzdanınız. Bakiye, işlem geçmişi ve ödeme yöntemleri.",
    keywords: ["cüzdan", "bakiye", "ödeme"],
  },
  
  // Kod kullan
  redeem: {
    title: "Kod Kullan",
    description: "Hediye kodlarınızı kullanın ve özel ödüller kazanın.",
    keywords: ["kod", "hediye", "ödül"],
  },
  
  // Forum
  forum: {
    title: "Forum",
    description: "Topluluk forumu. Tartışmalar, sorular ve Minecraft deneyimlerinizi paylaşın.",
    keywords: ["forum", "topluluk", "tartışma"],
  },
  
  // Yardım
  help: {
    title: "Yardım Merkezi",
    description: "Sık sorulan sorular ve yardım rehberleri. Destek alın ve sorunlarınızı çözün.",
    keywords: ["yardım", "destek", "sss"],
  },
  
  // Destek
  support: {
    title: "Destek",
    description: "Teknik destek ve müşteri hizmetleri. Sorunlarınız için bizimle iletişime geçin.",
    keywords: ["destek", "ticket", "sorun"],
  },
  
  // Gönderiler
  posts: {
    title: "Gönderiler",
    description: "En son haberler, duyurular ve topluluk gönderileri.",
    keywords: ["gönderi", "haber", "duyuru"],
  },
  
  // Personel başvuruları
  staffForms: {
    title: "Personel Başvuruları",
    description: "Sunucu ekibimize katılmak için başvuru yapın. Moderasyon ve yönetim pozisyonları.",
    keywords: ["personel", "başvuru", "moderasyon"],
  },
  
  // Yasal
  legal: {
    title: "Yasal",
    description: "Kullanım şartları, gizlilik politikası ve yasal belgeler.",
    keywords: ["yasal", "şartlar", "gizlilik"],
  },
  
  // Kimlik doğrulama
  auth: {
    signIn: {
      title: "Giriş Yap",
      description: "Hesabınıza giriş yapın ve oyuna devam edin.",
      keywords: ["giriş", "login", "hesap"],
      noIndex: true,
    },
    signUp: {
      title: "Kayıt Ol",
      description: "Yeni hesap oluşturun ve topluluğumuza katılın.",
      keywords: ["kayıt", "üye ol", "hesap"],
      noIndex: true,
    },
    forgotPassword: {
      title: "Şifremi Unuttum",
      description: "Şifrenizi sıfırlayın ve hesabınıza erişim sağlayın.",
      keywords: ["şifre", "sıfırla", "erişim"],
      noIndex: true,
    },
    resetPassword: {
      title: "Şifre Sıfırla",
      description: "Yeni şifrenizi belirleyin ve hesabınızı güvence altına alın.",
      keywords: ["şifre", "yeni", "güvenlik"],
      noIndex: true,
    },
  },
};

// Dinamik sayfa metadata oluşturucu
export function createPageMetadata(
  pageType: string,
  dynamicData?: Record<string, any>
): PageMetadata {
  const baseMetadata = PAGE_METADATA[pageType];
  
  if (baseMetadata && typeof baseMetadata === 'object' && 'title' in baseMetadata) {
    return {
      ...(baseMetadata as PageMetadata),
      ...dynamicData,
    };
  }
  
  // Alt sayfalar için (örn: auth.signIn)
  const [parent, child] = pageType.split('.');
  if (parent && child && PAGE_METADATA[parent]) {
    const parentMetadata = PAGE_METADATA[parent];
    if (typeof parentMetadata === 'object' && child in parentMetadata) {
      return {
        ...(parentMetadata as Record<string, PageMetadata>)[child],
        ...dynamicData,
      };
    }
  }
  
  // Varsayılan metadata
  return {
    title: "Sayfa",
    description: "Minecraft sunucumuzda eğlenceli vakit geçirin!",
    keywords: ["minecraft", "sunucu"],
    ...dynamicData,
  };
} 