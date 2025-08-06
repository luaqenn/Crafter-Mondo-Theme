"use client";

import { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipler
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import { Server } from "@/lib/types/server";

// Servisler
import { useProductService } from "@/lib/services/product.service";
import { useCategoryService } from "@/lib/services/category.service";
import { useServerService } from "@/lib/services/server.service";
import { useMarketplaceService } from "@/lib/services/marketplace.service";

// Context ve Bileşenler
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useCart } from "@/lib/context/cart.context";

// ShadCN UI Kütüphaneleri
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

// Lucide React Ikonları
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Package,
  Tag,
  Server as ServerIcon,
  PackageCheck,
  ImageIcon,
  NotebookText,
  Tags,
  CheckCircle,
  AlertTriangle,
  Star,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import NotFound from "@/components/not-found";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductPreload } from "@/components/store/StorePreloader";

export default function ProductPage({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const { product_id } = use(params);

  // State'ler
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [bulkDiscount, setBulkDiscount] = useState<null | {
    type: "percentage" | "fixed";
    amount: number;
    expireDate: string | null;
    products: string[];
  }>(null);

  // Servislerin kullanımı
  const { getProductById } = useProductService();
  const { getCategory } = useCategoryService();
  const { getServer } = useServerService();
  const { purchaseProduct, getMarketplaceSettings } = useMarketplaceService();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Preload product data
  useProductPreload(product_id);

  // Bulk discount'u çek
  useEffect(() => {
    getMarketplaceSettings().then((settings) => {
      setBulkDiscount(settings.bulkDiscount || null);
    });
  }, []);

  // Fiyat hesaplamaları
  const originalPrice = Number(product?.price) || 0;
  const discountValue = Number(product?.discountValue);
  const validDiscountType = product?.discountType === "percentage" || product?.discountType === "fixed";
  const hasProductDiscount = !isNaN(discountValue) && discountValue > 0 && validDiscountType;
  const productDiscountAmount =
    product?.discountType === "percentage"
      ? (originalPrice * discountValue) / 100
      : discountValue;
  const productDiscountedPrice = hasProductDiscount ? originalPrice - productDiscountAmount : originalPrice;

  // Bulk discount hesaplama
  let hasBulkDiscount = false;
  let bulkDiscountAmount = 0;
  let bulkDiscountedPrice = originalPrice;
  if (
    bulkDiscount &&
    bulkDiscount.amount > 0 &&
    (bulkDiscount.products.length === 0 || (product && bulkDiscount.products.includes(product.id)))
  ) {
    hasBulkDiscount = true;
    if (bulkDiscount.type === "percentage") {
      bulkDiscountAmount = (originalPrice * bulkDiscount.amount) / 100;
    } else {
      bulkDiscountAmount = bulkDiscount.amount;
    }
    bulkDiscountedPrice = originalPrice - bulkDiscountAmount;
  }

  // En iyi indirimi seç (en düşük fiyatı göster)
  let finalPrice = originalPrice;
  let showDiscountType: "product" | "bulk" | null = null;
  let showDiscountAmount = 0;
  if (hasProductDiscount && hasBulkDiscount) {
    if (bulkDiscountedPrice < productDiscountedPrice) {
      finalPrice = bulkDiscountedPrice;
      showDiscountType = "bulk";
      showDiscountAmount = bulkDiscountAmount;
    } else {
      finalPrice = productDiscountedPrice;
      showDiscountType = "product";
      showDiscountAmount = productDiscountAmount;
    }
  } else if (hasBulkDiscount) {
    finalPrice = bulkDiscountedPrice;
    showDiscountType = "bulk";
    showDiscountAmount = bulkDiscountAmount;
  } else if (hasProductDiscount) {
    finalPrice = productDiscountedPrice;
    showDiscountType = "product";
    showDiscountAmount = productDiscountAmount;
  }

  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock && product.stock > 0 && product.stock <= 10;
  const isUnlimitedStock = product?.stock === -1;

  // Veri Çekme Mantığı
  useEffect(() => {
    if (!product_id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Ana ürünü çek
        const productData = await getProductById(product_id);
        setProduct(productData);

        // 2. Ürün verisiyle kategori ve sunucuyu paralel olarak çek
        const [categoryData, serverData] = await Promise.all([
          getCategory(productData.category),
          getServer(productData.server_id),
        ]);

        setCategory(categoryData);
        setServer(serverData);
      } catch (err) {
        setError(
          "Ürün, kategori veya sunucu bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [product_id]);

  // Sepete ekleme işlemi
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    
    addToCart(product.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Satın alma işlemi
  const handlePurchase = async () => {
    if (!product || !isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (isOutOfStock) return;

    setPurchasing(true);
    
    try {
      withReactContent(Swal)
        .fire({
          title: "Satın Alma İşlemi",
          text: `"${product.name}" ürününü satın almak istediğinize emin misiniz?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Evet, satın al",
          cancelButtonText: "Hayır, iptal et",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await purchaseProduct([product.id]);
              withReactContent(Swal).fire({
                title: "Satın Alma Başarılı",
                text: "Ürün başarıyla satın alındı. Sandığa yönlendiriliyorsunuz...",
                icon: "success",
                confirmButtonText: "Tamam",
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                router.push("/chest");
              });
            } catch (error: any) {
              withReactContent(Swal).fire({
                title: "Satın Alma Hatası",
                text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
                icon: "error",
                confirmButtonText: "Tamam",
              });
            }
          }
        });
    } finally {
      setPurchasing(false);
    }
  };

  // Yüklenme ve Hata durumları için arayüzler
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Sol Taraf Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            </div>

            {/* Sağ Taraf Skeleton */}
            <div className="lg:col-span-1 space-y-8">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <NotFound error={error as string} header="Ürün Bulunamadı" navigateTo="/store" backToText="Mağazaya Geri Dön"/>
  }

  // Arayüz (JSX)
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Ürün Detayları
                </span>
                {category && (
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {category.name}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sol Taraf: Görsel ve Açıklama */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ürün Görseli */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/50">
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <ImageIcon className="h-16 w-16 mb-2" />
                    <span className="text-sm">Resim Yok</span>
                  </div>
                )}
                
                {/* Stok Durumu Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {isUnlimitedStock ? (
                    <Badge 
                      variant="secondary" 
                      className="bg-green-500 dark:bg-green-700 text-white border-green-600 dark:border-green-800 shadow-md text-xs font-medium px-3 py-1"
                    >
                      <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                      Sınırsız
                    </Badge>
                  ) : isOutOfStock ? (
                    <Badge 
                      variant="destructive" 
                      className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 text-white border-red-600 dark:border-red-800 shadow-lg text-xs font-medium px-3 py-1"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                      Stokta Yok
                    </Badge>
                  ) : isLowStock ? (
                    <Badge 
                      variant="secondary" 
                      className="bg-yellow-500 dark:bg-yellow-700 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-white border-amber-600 dark:border-amber-800 shadow-md text-xs font-medium px-3 py-1"
                    >
                      <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                      Son {product.stock}
                    </Badge>
                  ) : null}
                </div>

                {/* İndirim Badge */}
                {(showDiscountType && showDiscountAmount > 0) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-red-500 dark:bg-red-700 text-white text-xs font-medium px-3 py-1 shadow-lg">
                      {bulkDiscount && showDiscountType === "bulk"
                        ? (bulkDiscount.type === "percentage"
                            ? `%${bulkDiscount.amount} İndirim`
                            : `${bulkDiscount.amount.toFixed(0)}₺ İndirim`)
                        : (product?.discountType === "percentage"
                            ? `%${discountValue}`
                            : `${productDiscountAmount.toFixed(0)}₺`)
                      }
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Ürün Açıklaması */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
                  <NotebookText className="w-6 h-6 text-purple-600" />
                  Ürün Açıklaması
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {product.description ||
                    "Bu ürün için bir açıklama girilmemiş."}
                </p>
                
                {/* Etiketler Bölümü */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Tags className="w-5 h-5 text-purple-500" />
                      Etiketler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf: Satın Alma ve Bilgiler */}
          <div className="lg:col-span-1 space-y-8">
            {/* Fiyat Bilgisi */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 shadow-xl border-0 dark:bg-gray-900/80">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {(showDiscountType && showDiscountAmount > 0) ? (
                    <div className="space-y-2">
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {originalPrice.toFixed(2)} ₺
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-extrabold text-green-600 dark:text-green-400">
                          {finalPrice <= 0 ? 'Ücretsiz' : `${finalPrice.toFixed(2)} ₺`}
                        </span>
                        <Badge className="bg-red-500 dark:bg-red-700 text-white text-sm font-medium px-3 py-1">
                          {showDiscountType === "bulk" && bulkDiscount
                            ? (bulkDiscount.type === "percentage"
                                ? `%${bulkDiscount.amount} İndirim`
                                : `${bulkDiscount.amount.toFixed(0)}₺ İndirim`)
                            : (product?.discountType === "percentage"
                                ? `%${discountValue} İndirim`
                                : `${productDiscountAmount.toFixed(0)}₺ İndirim`)
                          }
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      {finalPrice <= 0 ? 'Ücretsiz' : `${originalPrice.toFixed(2)} ₺`}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Satın Alma Kartı */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 shadow-xl border-0 dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Hemen Sahip Ol</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Güvenli ve hızlı bir şekilde satın al.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isOutOfStock || purchasing}
                  className={`
                    w-full h-12 text-lg font-medium transition-all duration-200 ease-in-out hover:scale-[1.02]
                    ${isOutOfStock
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                      : hasProductDiscount || hasBulkDiscount
                      ? "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white shadow-lg"
                      : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-lg"
                    }
                  `}
                >
                  {purchasing ? (
                    <Spinner className="h-5 w-5 mr-2" />
                  ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                  )}
                  {isOutOfStock ? "Stok Tükendi" : purchasing ? "İşleniyor..." : "Hemen Satın Al"}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addedToCart}
                  className={`
                    w-full h-12 text-lg font-medium transition-all duration-300 ease-in-out hover:scale-[1.02]
                    ${isOutOfStock
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed border-gray-300 dark:border-gray-700"
                      : addedToCart
                      ? "bg-emerald-500 dark:bg-emerald-700 text-white cursor-default border-emerald-500 dark:border-emerald-700"
                      : "text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900 hover:text-orange-700 dark:hover:text-orange-300 bg-white dark:bg-gray-900"
                    }
                  `}
                >
                  {addedToCart ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  {addedToCart ? "Sepete Eklendi!" : "Sepete Ekle"}
                </Button>
              </CardContent>
            </Card>

            {/* Ürün Bilgileri */}
            <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Ürün Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-500" />
                    Kategori
                  </span>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                    onClick={() => category && router.push(`/store/category/${category.slug}`)}
                  >
                    {category?.name || "Yükleniyor..."}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <ServerIcon className="w-4 h-4 text-blue-500" />
                    Sunucu
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {server?.name || "Yükleniyor..."}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-green-500" />
                    Stok Durumu
                  </span>
                  <span
                    className={`font-medium ${
                      isUnlimitedStock
                        ? "text-green-600 dark:text-green-400"
                        : isOutOfStock
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {isUnlimitedStock
                      ? "Sınırsız"
                      : isOutOfStock
                      ? "Tükendi"
                      : `${product.stock} Adet`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Ürün ID
                  </span>
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {product.id}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
