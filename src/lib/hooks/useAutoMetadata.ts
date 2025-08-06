"use client";

import { usePathname } from "next/navigation";
import { useClientMetadata } from "./useClientMetadata";
import { getPageMetadataByPath } from "@/lib/utils/metadata-utils";
import { usePWA } from "@/lib/context/pwa-provider.context";

// Otomatik metadata hook'u - pathname'e göre otomatik metadata oluşturur
export function useAutoMetadata(additionalData?: Record<string, any>) {
  const pathname = usePathname();
  const { config: appConfig } = usePWA();
  
  const { pageType, dynamicData } = getPageMetadataByPath(pathname);
  
  // Ek verileri birleştir
  const finalDynamicData = {
    ...dynamicData,
    ...additionalData
  };
  
  return useClientMetadata({
    pageType,
    dynamicData: finalDynamicData,
    appConfig: appConfig || undefined
  });
} 