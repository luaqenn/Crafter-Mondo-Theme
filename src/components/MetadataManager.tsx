"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createPageMetadata } from "@/lib/functions/metadata";
import type { AppConfig } from "@/lib/types/app";

interface MetadataManagerProps {
  appConfig: AppConfig;
}

export function MetadataManager({ appConfig }: MetadataManagerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!appConfig || !pathname) return;

    const getPageTypeFromPath = (path: string): string => {
      if (path === "/") return "home";
      if (path.startsWith("/store")) return "store";
      if (path.startsWith("/cart")) return "cart";
      if (path.startsWith("/profile")) return "profile";
      if (path.startsWith("/chest")) return "chest";
      if (path.startsWith("/wallet")) return "wallet";
      if (path.startsWith("/redeem")) return "redeem";
      if (path.startsWith("/forum")) return "forum";
      if (path.startsWith("/help")) return "help";
      if (path.startsWith("/support")) return "support";
      if (path.startsWith("/posts")) return "posts";
      if (path.startsWith("/staff-forms")) return "staffForms";
      if (path.startsWith("/legal")) return "legal";
      if (path.startsWith("/auth/sign-in")) return "auth.signIn";
      if (path.startsWith("/auth/sign-up")) return "auth.signUp";
      if (path.startsWith("/auth/password/forgot")) return "auth.forgotPassword";
      if (path.startsWith("/auth/password/reset")) return "auth.resetPassword";
      return "home";
    };

    const pageType = getPageTypeFromPath(pathname);
    const pageMetadata = createPageMetadata(pageType);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}${pathname}`;

    const finalTitle = pageMetadata.title;
    const finalDescription = pageMetadata.description;
    const finalKeywords = [
      ...(pageMetadata.keywords || []),
      ...(appConfig.keywords || [])
    ];
    const canonicalUrl = pageMetadata.canonical || fullUrl;
    const ogImage = pageMetadata.image || 
      `${baseUrl}/api/og?title=${encodeURIComponent(finalTitle)}&description=${encodeURIComponent(finalDescription)}&brand=${encodeURIComponent(appConfig.appName)}`;

    // Document title güncelle
    document.title = `${finalTitle} | ${appConfig.appName}`;

    // Meta description güncelle
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', finalDescription);

    // Keywords güncelle
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', finalKeywords.join(', '));

    // Canonical URL güncelle
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Open Graph meta'ları güncelle
    const ogMetaTags = [
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDescription },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: appConfig.appName },
      { property: 'og:locale', content: 'tr_TR' }
    ];

    ogMetaTags.forEach(({ property, content }) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Twitter meta'ları güncelle
    const twitterMetaTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: ogImage }
    ];

    twitterMetaTags.forEach(({ name, content }) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Robots meta güncelle
    if (pageMetadata.noIndex) {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    }

  }, [appConfig, pathname]);

  return null; // Bu component sadece metadata yönetimi yapar, UI render etmez
} 