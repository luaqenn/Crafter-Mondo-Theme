"use client";

import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressiveLoaderProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  skeletonComponent: React.ComponentType<{ index: number }>;
  itemsPerPage?: number;
  initialItems?: number;
  className?: string;
}

export function ProgressiveLoader<T>({
  items,
  renderItem,
  skeletonComponent: SkeletonComponent,
  itemsPerPage = 10,
  initialItems = 5,
  className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
}: ProgressiveLoaderProps<T>) {
  const [visibleItems, setVisibleItems] = useState(initialItems);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (isIntersecting && visibleItems < items.length) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + itemsPerPage, items.length));
      }, 100); // Small delay for smooth animation
      
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, visibleItems, items.length, itemsPerPage]);

  const visibleItemsList = items.slice(0, visibleItems);
  const remainingItems = items.length - visibleItems;

  return (
    <div className="space-y-6">
      <div className={className}>
        {visibleItemsList.map((item, index) => renderItem(item, index))}
      </div>
      
      {remainingItems > 0 && (
        <div ref={elementRef} className="flex justify-center py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: Math.min(remainingItems, itemsPerPage) }).map((_, index) => (
                <SkeletonComponent key={index} index={index} />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {remainingItems} öğe daha yükleniyor...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton components for different card types
export const ServerCardSkeletonItem = ({ index }: { index: number }) => (
  <div className="group relative overflow-hidden transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg">
    <div className="relative">
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="absolute top-3 right-3 z-10">
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900 dark:to-cyan-900 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-0.5 w-full mt-2" />
    </div>
  </div>
);

export const CategoryCardSkeletonItem = ({ index }: { index: number }) => (
  <div className="group relative overflow-hidden transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg">
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-center items-center h-48 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <Skeleton className="w-24 h-24 rounded-lg" />
      </div>
    </div>
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2 mt-1" />
      <Skeleton className="h-0.5 w-full mt-2" />
    </div>
  </div>
);

export const ProductCardSkeletonItem = ({ index }: { index: number }) => (
  <div className="group relative flex flex-col h-full w-full mx-auto overflow-hidden transition-all duration-300 border-2 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute top-2 left-2 z-10">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
    <div className="flex flex-col flex-1 p-4 min-h-0">
      <div className="h-16 flex items-center justify-center mb-3">
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex flex-col items-center justify-center mb-4 min-h-[4rem]">
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex flex-col gap-2 w-full mt-auto pt-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  </div>
); 