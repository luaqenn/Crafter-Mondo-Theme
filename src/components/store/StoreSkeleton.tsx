"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Server Card Skeleton
export const ServerCardSkeleton = () => (
  <Card className="group relative overflow-hidden transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <CardContent className="p-0">
      <div className="relative">
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Player Count Badge Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Image Skeleton */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900 dark:to-cyan-900 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-0.5 w-full mt-2" />
      </div>
    </CardContent>
  </Card>
);

// Category Card Skeleton
export const CategoryCardSkeleton = () => (
  <Card className="group relative overflow-hidden transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <CardContent className="p-0">
      <div className="relative">
        {/* Badge Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Image Skeleton */}
        <div className="flex justify-center items-center h-48 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
          <Skeleton className="w-24 h-24 rounded-lg" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-1" />
        <Skeleton className="h-0.5 w-full mt-2" />
      </div>
    </CardContent>
  </Card>
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <Card className="group relative flex flex-col h-full w-full mx-auto overflow-hidden transition-all duration-300 border-2 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <CardContent className="p-0 flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="flex flex-col flex-1 p-4 min-h-0">
        {/* Title Skeleton */}
        <div className="h-16 flex items-center justify-center mb-3">
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Price Skeleton */}
        <div className="flex flex-col items-center justify-center mb-4 min-h-[4rem]">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Button Skeleton */}
        <div className="flex flex-col gap-2 w-full mt-auto pt-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Store Page Header Skeleton
export const StoreHeaderSkeleton = () => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-32" />
    </div>
    <Skeleton className="h-6 w-96 mb-6" />
    
    {/* Stats Card Skeleton */}
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Server Page Header Skeleton
export const ServerHeaderSkeleton = () => (
  <div className="mb-8">
    {/* Breadcrumb Skeleton */}
    <div className="mb-6">
      <Skeleton className="h-10 w-32 mb-4" />
    </div>

    {/* Server Header Skeleton */}
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-80 mb-3" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Category Page Header Skeleton
export const CategoryHeaderSkeleton = () => (
  <div className="mb-8">
    {/* Breadcrumb Skeleton */}
    <div className="mb-6">
      <Skeleton className="h-10 w-32 mb-4" />
    </div>

    {/* Category Header Skeleton */}
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-80 mb-3" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Grid Skeleton Components
export const ServerGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ServerCardSkeleton key={i} />
    ))}
  </div>
);

export const CategoryGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductGridSkeleton = ({ count = 10 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
); 