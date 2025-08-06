import type { AppConfig } from "@/lib/types/app";

// Sayfa türüne göre otomatik metadata oluşturucu
export function getPageMetadataByPath(pathname: string): {
  pageType: string;
  dynamicData: Record<string, any>;
} {
  const path = pathname.toLowerCase();
  
  // Ana sayfa
  if (path === '/' || path === '') {
    return {
      pageType: 'home',
      dynamicData: {}
    };
  }
  
  // Mağaza
  if (path.startsWith('/store')) {
    return {
      pageType: 'store',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Sepet
  if (path.startsWith('/cart')) {
    return {
      pageType: 'cart',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Profil
  if (path.startsWith('/profile')) {
    return {
      pageType: 'profile',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Sandık
  if (path.startsWith('/chest')) {
    return {
      pageType: 'chest',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Cüzdan
  if (path.startsWith('/wallet')) {
    return {
      pageType: 'wallet',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Kod kullan
  if (path.startsWith('/redeem')) {
    return {
      pageType: 'redeem',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Forum
  if (path.startsWith('/forum')) {
    return {
      pageType: 'forum',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Yardım
  if (path.startsWith('/help')) {
    return {
      pageType: 'help',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Destek
  if (path.startsWith('/support')) {
    return {
      pageType: 'support',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Gönderiler
  if (path.startsWith('/posts')) {
    return {
      pageType: 'posts',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Personel başvuruları
  if (path.startsWith('/staff-forms')) {
    return {
      pageType: 'staffForms',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Yasal
  if (path.startsWith('/legal')) {
    return {
      pageType: 'legal',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Kimlik doğrulama
  if (path.startsWith('/auth/sign-in')) {
    return {
      pageType: 'auth.signIn',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  if (path.startsWith('/auth/sign-up')) {
    return {
      pageType: 'auth.signUp',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  if (path.startsWith('/auth/password/forgot')) {
    return {
      pageType: 'auth.forgotPassword',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  if (path.startsWith('/auth/password/reset')) {
    return {
      pageType: 'auth.resetPassword',
      dynamicData: {
        canonical: pathname
      }
    };
  }
  
  // Varsayılan
  return {
    pageType: 'home',
    dynamicData: {
      title: 'Sayfa Bulunamadı',
      description: 'Aradığınız sayfa bulunamadı.',
      canonical: pathname
    }
  };
}

// Dinamik veri ile metadata oluşturucu
export function createDynamicMetadata(
  pageType: string,
  dynamicData: Record<string, any> = {},
  appConfig?: AppConfig
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Varsayılan metadata
  const defaultMetadata = {
    title: 'Sayfa',
    description: 'Minecraft sunucumuzda eğlenceli vakit geçirin!',
    keywords: ['minecraft', 'sunucu'],
    canonical: baseUrl,
    noIndex: false
  };
  
  // Sayfa türüne göre metadata
  const pageMetadata = {
    home: {
      title: 'Ana Sayfa',
      description: 'Minecraft sunucumuzda eğlenceli vakit geçirin! Oyuncular, sunucu durumu ve daha fazlası.',
      keywords: ['minecraft', 'sunucu', 'oyun', 'ana sayfa']
    },
    store: {
      title: 'Mağaza',
      description: 'Minecraft sunucumuz için özel ürünler ve paketler. VIP, özel eşyalar ve daha fazlası.',
      keywords: ['mağaza', 'vip', 'paket', 'satın al']
    },
    cart: {
      title: 'Sepet',
      description: 'Alışveriş sepetiniz. Ürünlerinizi gözden geçirin ve güvenli ödeme yapın.',
      keywords: ['sepet', 'ödeme', 'alışveriş'],
      noIndex: true
    },
    profile: {
      title: 'Profil',
      description: 'Kullanıcı profiliniz. Ayarlar, istatistikler ve hesap yönetimi.',
      keywords: ['profil', 'hesap', 'ayarlar']
    },
    chest: {
      title: 'Sandık',
      description: 'Oyunda kazandığınız ödüller ve eşyalar. Sandığınızı açın ve ödüllerinizi alın.',
      keywords: ['sandık', 'ödül', 'eşya']
    },
    wallet: {
      title: 'Cüzdan',
      description: 'Dijital cüzdanınız. Bakiye, işlem geçmişi ve ödeme yöntemleri.',
      keywords: ['cüzdan', 'bakiye', 'ödeme']
    },
    redeem: {
      title: 'Kod Kullan',
      description: 'Hediye kodlarınızı kullanın ve özel ödüller kazanın.',
      keywords: ['kod', 'hediye', 'ödül']
    },
    forum: {
      title: 'Forum',
      description: 'Topluluk forumu. Tartışmalar, sorular ve Minecraft deneyimlerinizi paylaşın.',
      keywords: ['forum', 'topluluk', 'tartışma']
    },
    help: {
      title: 'Yardım Merkezi',
      description: 'Sık sorulan sorular ve yardım rehberleri. Destek alın ve sorunlarınızı çözün.',
      keywords: ['yardım', 'destek', 'sss']
    },
    support: {
      title: 'Destek',
      description: 'Teknik destek ve müşteri hizmetleri. Sorunlarınız için bizimle iletişime geçin.',
      keywords: ['destek', 'ticket', 'sorun']
    },
    posts: {
      title: 'Gönderiler',
      description: 'En son haberler, duyurular ve topluluk gönderileri.',
      keywords: ['gönderi', 'haber', 'duyuru']
    },
    staffForms: {
      title: 'Personel Başvuruları',
      description: 'Sunucu ekibimize katılmak için başvuru yapın. Moderasyon ve yönetim pozisyonları.',
      keywords: ['personel', 'başvuru', 'moderasyon']
    },
    legal: {
      title: 'Yasal',
      description: 'Kullanım şartları, gizlilik politikası ve yasal belgeler.',
      keywords: ['yasal', 'şartlar', 'gizlilik']
    }
  };
  
  // Alt sayfalar için
  const subPageMetadata = {
    'auth.signIn': {
      title: 'Giriş Yap',
      description: 'Hesabınıza giriş yapın ve oyuna devam edin.',
      keywords: ['giriş', 'login', 'hesap'],
      noIndex: true
    },
    'auth.signUp': {
      title: 'Kayıt Ol',
      description: 'Yeni hesap oluşturun ve topluluğumuza katılın.',
      keywords: ['kayıt', 'üye ol', 'hesap'],
      noIndex: true
    },
    'auth.forgotPassword': {
      title: 'Şifremi Unuttum',
      description: 'Şifrenizi sıfırlayın ve hesabınıza erişim sağlayın.',
      keywords: ['şifre', 'sıfırla', 'erişim'],
      noIndex: true
    },
    'auth.resetPassword': {
      title: 'Şifre Sıfırla',
      description: 'Yeni şifrenizi belirleyin ve hesabınızı güvence altına alın.',
      keywords: ['şifre', 'yeni', 'güvenlik'],
      noIndex: true
    }
  };
  
  // Metadata'yı birleştir
  const baseMetadata = pageMetadata[pageType as keyof typeof pageMetadata] || 
                      subPageMetadata[pageType as keyof typeof subPageMetadata] || 
                      defaultMetadata;
  
  return {
    ...baseMetadata,
    ...dynamicData,
    keywords: [
      ...(baseMetadata.keywords || []),
      ...(dynamicData.keywords || []),
      ...(appConfig?.keywords || [])
    ]
  };
} 