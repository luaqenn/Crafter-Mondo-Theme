"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPageMetadata } from "@/lib/functions/metadata";
import type { AppConfig } from "@/lib/types/app";

interface UseClientMetadataProps {
  pageType: string;
  dynamicData?: Record<string, any>;
  appConfig?: AppConfig;
}

export function useClientMetadata({ 
  pageType, 
  dynamicData = {}, 
  appConfig 
}: UseClientMetadataProps) {
  const pathname = usePathname();
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (!appConfig) return;

    const pageMetadata = createPageMetadata(pageType, dynamicData);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullUrl = pathname ? `${baseUrl}${pathname}` : baseUrl;

    const finalTitle = dynamicData.title || pageMetadata.title;
    const finalDescription = dynamicData.description || pageMetadata.description;
    const finalKeywords = [
      ...(pageMetadata.keywords || []),
      ...(dynamicData.keywords || []),
      ...(appConfig.keywords || [])
    ];
    const canonicalUrl = pageMetadata.canonical || fullUrl;
    const ogImage = dynamicData.image || pageMetadata.image || 
      `${baseUrl}/api/og?title=${encodeURIComponent(finalTitle)}&description=${encodeURIComponent(finalDescription)}&brand=${encodeURIComponent(appConfig.appName)}`;

    setMetadata({
      title: finalTitle,
      description: finalDescription,
      keywords: finalKeywords,
      canonical: canonicalUrl,
      ogImage,
      noIndex: pageMetadata.noIndex,
      appConfig
    });

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

  }, [pageType, dynamicData, appConfig, pathname]);

  return metadata;
} 