"use client";

import { useEffect } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { createPageMetadata } from "@/lib/functions/metadata";

interface DynamicHeadProps {
  pageType: string;
  dynamicData?: Record<string, any>;
  appConfig?: any;
}

export default function DynamicHead({ 
  pageType, 
  dynamicData = {}, 
  appConfig 
}: DynamicHeadProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (!appConfig) return;
    
    const pageMetadata = createPageMetadata(pageType, dynamicData);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fullUrl = pathname ? `${baseUrl}${pathname}` : baseUrl;
    
    // Title güncelle
    const finalTitle = dynamicData.title || pageMetadata.title;
    document.title = `${finalTitle} | ${appConfig.appName}`;
    
    // Meta description güncelle
    const finalDescription = dynamicData.description || pageMetadata.description;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', finalDescription);
    
    // Keywords güncelle
    const finalKeywords = [
      ...(pageMetadata.keywords || []),
      ...(dynamicData.keywords || []),
      ...(appConfig.keywords || [])
    ].join(', ');
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', finalKeywords);
    
    // Canonical URL güncelle
    const canonicalUrl = pageMetadata.canonical || fullUrl;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    
    // Open Graph meta'ları güncelle
    const ogImage = dynamicData.image || pageMetadata.image || 
      `${baseUrl}/api/og?title=${encodeURIComponent(finalTitle)}&description=${encodeURIComponent(finalDescription)}&brand=${encodeURIComponent(appConfig.appName)}`;
    
    // OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', finalTitle);
    
    // OG Description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', finalDescription);
    
    // OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);
    
    // OG Image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.setAttribute('content', ogImage);
    
    // Twitter meta'ları güncelle
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', finalTitle);
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', finalDescription);
    
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', ogImage);
    
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
  
  return null; // Bu component sadece head'i günceller, UI render etmez
} 