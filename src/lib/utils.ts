import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import React from "react";

declare global {
  interface ImportMeta {
    hot?: {
      accept: (cb: () => void) => void;
    };
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatTimeAgo(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true, locale: tr }).replace('yaklaşık ', '');
  } catch (error) {
    return "bir süre önce";
  }
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy', { locale: tr });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: tr });
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Image optimization utilities
export function getImageUrl(url: string, width: number = 400): string {
  if (!url) return '';
  
  // If it's already a Next.js Image component URL, return as is
  if (url.includes('_next/image')) return url;
  
  // For external images, you might want to use an image optimization service
  // For now, return the original URL
  return url;
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Memory management utilities
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Bundle size optimization - dynamic imports helper
export function lazyLoad(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<React.ComponentType<any>> {
  return React.lazy(() => 
    importFunc().catch(() => {
      if (fallback) {
        return { default: fallback };
      }
      throw new Error('Component failed to load');
    })
  );
}

/**
 * Development ortamında cache kontrolü
 */
export const isDevelopmentCacheEnabled = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Lexical JSON'dan düz metin çıkaran yardımcı fonksiyon
export function lexicalToPlainText(content: any): string {
  if (!content || typeof content !== 'object') return '';
  // Lexical JSON'da kök genellikle { root: { children: [...] } }
  const root = content.root || content;
  let text = '';
  function traverse(node: any) {
    if (!node) return;
    if (node.type === 'text' && typeof node.text === 'string') {
      text += node.text + ' ';
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  }
  if (Array.isArray(root.children)) {
    root.children.forEach(traverse);
  }
  return text.trim();
}

export function translatePostType(type: string) {
  switch (type) {
    case "blog": return "Blog";
    case "announcement": return "Duyuru";
    case "news": return "Haber";
    case "update": return "Güncelleme";
    default: return type;
  }
}