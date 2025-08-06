import satori, { SatoriOptions } from "satori";
import { writeFileSync } from "fs";
import { join } from "path";

// Font yükleme fonksiyonu
async function loadGoogleFont(
  font: string,
  weights: number[] = [400, 700],
  text?: string
) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
      ";"
    )}&display=swap${text ? `&text=${encodeURIComponent(text)}` : ""}`
  ).then((res) => res.text());

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) {
    throw new Error("Font could not be loaded");
  }

  const res = await fetch(resource[1]);
  return res.arrayBuffer();
}

// Alternatif: Yerel font yükleme
async function loadLocalFont(fontPath: string) {
  const fs = require("fs");
  const path = require("path");

  try {
    return fs.readFileSync(path.resolve(process.cwd(), fontPath));
  } catch (error) {
    console.warn(`Local font not found: ${fontPath}`);
    return null;
  }
}

// Font cache
const fontCache = new Map<string, ArrayBuffer>();

async function getFontData(
  fontName: string = "Inter",
  weights: number[] = [400, 700]
) {
  const cacheKey = `${fontName}-${weights.join("-")}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey);
  }

  let fontData: ArrayBuffer | null = null;

  // Önce yerel fontu dene
  const localPaths = [
    `./public/fonts/${fontName}-Regular.ttf`,
    `./fonts/${fontName}-Regular.ttf`,
    `./assets/fonts/${fontName}-Regular.ttf`,
  ];

  for (const path of localPaths) {
    fontData = await loadLocalFont(path);
    if (fontData) break;
  }

  // Yerel font bulunamazsa Google Fonts'tan yükle
  if (!fontData) {
    try {
      fontData = await loadGoogleFont(fontName, weights);
    } catch (error) {
      console.warn(`Google font loading failed for ${fontName}:`, error);

      // Fallback olarak sistem fontu kullan
      fontData = await loadGoogleFont("Inter", [400, 700]);
    }
  }

  if (fontData) {
    fontCache.set(cacheKey, fontData);
  }

  return fontData;
}

// Resim boyutlandırma fonksiyonu - Sharp ile (Tüm formatları PNG'ye dönüştürür)
async function resizeImage(imageBuffer: ArrayBuffer, targetWidth: number = 320, targetHeight: number = 320): Promise<ArrayBuffer> {
  try {
    const sharp = require("sharp");
    
    // Sharp ile resmi yükle
    const sharpInstance = sharp(Buffer.from(imageBuffer));
    
    // Resim bilgilerini al
    const metadata = await sharpInstance.metadata();
    
    // Her formatı PNG'ye dönüştür ve boyutlandır
    const resizedBuffer = await sharpInstance
      .resize(targetWidth, targetHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png() // Her zaman PNG formatına dönüştür
      .toBuffer();
    
    return resizedBuffer;
  } catch (error) {
    return imageBuffer;
  }
}

// Crafter C+R logosu SVG (yüklenen logoya benzer)
function createCrafterLogo() {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2D3748;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1A202C;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="rGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1D4ED8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- C harfi -->
      <g transform="translate(40, 90)">
        <path d="M80 0 C120 0 160 30 160 80 C160 100 150 115 135 125 C130 120 125 110 120 100 C125 95 130 88 130 80 C130 50 110 30 80 30 C50 30 30 50 30 80 C30 110 50 130 80 130 C95 130 108 125 118 115 L135 135 C120 150 100 160 80 160 C35 160 0 125 0 80 C0 35 35 0 80 0 Z" fill="url(#cGradient)"/>
      </g>
      
      <!-- R harfi -->
      <g transform="translate(140, 90)">
        <path d="M0 0 L0 160 L30 160 L30 100 L70 100 C85 100 95 105 100 115 L120 160 L155 160 L130 105 C140 95 145 80 145 65 C145 25 120 0 80 0 L0 0 Z M30 30 L75 30 C95 30 115 35 115 65 C115 95 95 100 75 100 L30 100 L30 30 Z" fill="url(#rGradient)"/>
      </g>
      
      <!-- Glow effect -->
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow)" opacity="0.8">
        <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2"/>
      </g>
    </svg>
  `)}`;
}

// SEO resim oluşturma fonksiyonu
export async function generateSEOImage({
  title,
  description,
  logo,
  background = "radial-gradient(ellipse at top left, #1e3a8a 0%, #1e40af 25%, #1d4ed8 50%, #2563eb 75%, #0f172a 100%)",
  width = 1920,
  height = 1080,
  fontFamily = "Inter",
  brandName = "CRAFTER",
}: {
  title: string;
  description?: string;
  logo?: string;
  background?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
  brandName?: string;
}) {
  try {
    // Font verilerini yükle
    const fontData = await getFontData(fontFamily);

    if (!fontData) {
      throw new Error(`Font could not be loaded: ${fontFamily}`);
    }

    // Logo URL'ini doğrudan kullan (Satori loadImage fonksiyonu ile yüklenecek)
    let logoDataUrl = "";
    
    if (logo && logo.trim() !== "") {
      // URL'yi doğrudan kullan, Satori loadImage fonksiyonu ile yüklenecek
      logoDataUrl = logo;
    } else {
      logoDataUrl = createCrafterLogo();
    }

    // SVG içeriği oluştur - Nodesty düzenine uygun
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "100%",
            height: "100%",
            background: `${background}, radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.3) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`,
            fontFamily: fontFamily,
            position: "relative",
          },
          children: [
            // İçerik katmanı
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                },
                children: [
                  // Sol taraf - Metin içeriği
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "60%",
                        height: "100%",
                        padding: "80px 80px 80px 120px",
                      },
                      children: [
                        // Brand adı (CRAFTER)
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "24px",
                              fontWeight: 400,
                              color: "rgba(59, 130, 246, 0.9)",
                              letterSpacing: "4px",
                              marginBottom: "20px",
                              fontFamily: fontFamily,
                              textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                            },
                            children: brandName,
                          },
                        },
                        // Ana başlık
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "88px",
                              fontWeight: 700,
                              color: "white",
                              lineHeight: 0.9,
                              marginBottom: "40px",
                              fontFamily: fontFamily,
                              letterSpacing: "-0.02em",
                              textRendering: "optimizeLegibility",
                              WebkitFontSmoothing: "antialiased",
                              MozOsxFontSmoothing: "grayscale",
                            },
                            children: title,
                          },
                        },
                        // Açıklama metni
                        ...(description
                          ? [
                              {
                                type: "div",
                                props: {
                                  style: {
                                    fontSize: "24px",
                                    fontWeight: 400,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    lineHeight: 1.5,
                                    maxWidth: "500px",
                                    fontFamily: fontFamily,
                                    textRendering: "optimizeLegibility",
                                    WebkitFontSmoothing: "antialiased",
                                    MozOsxFontSmoothing: "grayscale",
                                  },
                                  children: description,
                                },
                              },
                            ]
                          : []),
                      ],
                    },
                  },
                  // Sağ taraf - Logo
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40%",
                        height: "100%",
                        position: "relative",
                      },
                      children: [
                        {
                          type: "img",
                          props: {
                            src: logoDataUrl,
                            width: 320,
                            height: 320,
                            style: {
                              width: "320px",
                              height: "320px",
                              filter:
                                "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      } as any,
      {
        width,
        height,
        fonts: [
          {
            name: fontFamily,
            data: fontData,
            weight: 400,
            style: "normal",
          },
          {
            name: fontFamily,
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
        embedFonts: true,
        loadAdditionalFonts: async () => {
          return [];
        },
        // Resim yükleme fonksiyonu
        loadImage: async (src: string) => {
          try {
            
            let imageBuffer: ArrayBuffer;
            
            // Eğer data URL ise, doğrudan kullan
            if (src.startsWith('data:')) {
              const response = await fetch(src);
              imageBuffer = await response.arrayBuffer();
            } else {
              // Eğer URL ise, yükle
              const response = await fetch(src, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              imageBuffer = await response.arrayBuffer();
            }
            
            // Her gelen resmi PNG'ye dönüştür ve boyutlandır
            const resizedBuffer = await resizeImage(imageBuffer, 320, 320);
            
            return resizedBuffer;
          } catch (error) {
            throw error;
          }
        },
        // Daha keskin font render için
        graphemeImages: {},
        debug: false,
      } as SatoriOptions
    );

    return svg;
  } catch (error) { 
    throw error;
  }
}

// PNG'ye dönüştürme için (isteğe bağlı)
export async function svgToPng(svg: string): Promise<Buffer> {
  // sharp kullanarak
  try {
    const sharp = require("sharp");
    return await sharp(Buffer.from(svg))
      .png({
        quality: 100,
        compressionLevel: 0,
        adaptiveFiltering: false,
        force: true,
      })
      .resize(1200, 630, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .sharpen({
        sigma: 0.8,
        flat: 1.5,
        jagged: 2.5,
      })
      .toBuffer();
  } catch (error) {
    // Canvas kullanarak (tarayıcı ortamında)
    if (typeof window !== "undefined") {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        // Canvas kalitesini artır
        canvas.width = 1200;
        canvas.height = 630;

        // Anti-aliasing için
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          // Daha keskin görüntü için
          ctx.filter = "contrast(1.1) brightness(1.05)";
        }

        img.onload = () => {
          ctx?.drawImage(img, 0, 0, 1920, 1080);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () =>
                  resolve(Buffer.from(reader.result as ArrayBuffer));
                reader.readAsArrayBuffer(blob);
              } else {
                reject(new Error("Canvas to blob conversion failed"));
              }
            },
            "image/png",
            1.0
          );
        };

        img.onerror = reject;
        img.src = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
          "base64"
        )}`;
      });
    }

    throw error;
  }
}

// Dosyaya kaydetme fonksiyonu
export async function saveSEOImage(
  svg: string,
  filename: string,
  outputDir = "public/og-images",
  format: "svg" | "png" = "svg"
) {
  const fs = require("fs");
  const path = require("path");

  // Dizin yoksa oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let data: string | Buffer = svg;
  let finalFilename = filename;

  // PNG formatında kaydetmek isteniyorsa
  if (format === "png") {
    data = await svgToPng(svg);
    finalFilename = filename.replace(/\.svg$/, ".png");
  }

  const filePath = path.join(outputDir, finalFilename);
  fs.writeFileSync(filePath, data);

  return filePath;
}

// API endpoint için hazır fonksiyon
export async function createOGImage(params: {
  title: string;
  description?: string;
  logo?: string;
  background?: string;
  fontFamily?: string;
  brandName?: string;
}) {
  const svg = await generateSEOImage(params);
  const timestamp = Date.now();
  const filename = `${timestamp}-og-image.svg`;
  const filePath = await saveSEOImage(svg, filename);

  return {
    svg,
    filename,
    filePath,
    url: `/og-images/${filename}`,
  };
}