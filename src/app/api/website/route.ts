import { NextResponse } from "next/server";
import { serverWebsiteService } from "@/lib/services/website.service";
import { LICENSE_KEY, WEBSITE_ID } from "@/lib/constants/base";

export async function GET() {
  const { verifyLicenseKey, getWebsite } = serverWebsiteService();

  try {
    const license = await verifyLicenseKey({ key: LICENSE_KEY || "" });

    if (license.success) {
      const website = await getWebsite({ id: license.website.id || "" });

      let secureWebsite = {
        id: website.id,
        name: website.name,
        url: website.url,
        description: website.description,
        favicon: website.favicon,
        image: website.image,
        keywords: website.keywords,
        google_analytics: website.google_analytics,
        sliders: website.sliders,
        discord: website.discord,
        servers: website.servers,
        broadcast_items: website.broadcast_items,
        social_media: website.social_media,
        server_info: website.server_info,
        security: website.security,
        theme: website.theme,
        maintenance: website.maintenance,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt,
      };

      return NextResponse.json({
        success: true,
        website: secureWebsite,
        isExpired: false,
      });
    } else {
      const website = await getWebsite({ id: WEBSITE_ID || "" });

      // Create a secure version of the website data that excludes sensitive information
      let secureWebsite = {
        id: website.id,
        name: website.name,
        url: website.url,
        description: website.description,
        favicon: website.favicon,
        image: website.image,
        keywords: website.keywords,
        google_analytics: website.google_analytics,
        sliders: website.sliders,
        discord: website.discord,
        servers: website.servers,
        broadcast_items: website.broadcast_items,
        social_media: website.social_media,
        server_info: website.server_info,
        security: website.security.cf_turnstile ? { cf_turnstile: { site_key: website.security.cf_turnstile.site_key } } : null,
        theme: website.theme,
        maintenance: website.maintenance,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt,
      };

      return NextResponse.json({
        success: true,
        website: secureWebsite,
        isExpired: true,
      });
    }
  } catch (error: any) {
    console.error(error)
    
    return NextResponse.json(
      error && error.status ? error : {
        success: false,
        message: "Website bilgileri alınamadı, lütfen https://crafter.net.tr/ adresini ziyaret edin."
      },
      { status: error?.status || 500 }
    );
  }
}
