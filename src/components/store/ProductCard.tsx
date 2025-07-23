import { Product } from "@/lib/types/product";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useState, useEffect } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useMarketplaceService } from "@/lib/services/marketplace.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/lib/context/cart.context";
import { Button } from "../ui/button";

export default function ProductCard({ item }: { item: Product }) {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  const { purchaseProduct, getMarketplaceSettings } = useMarketplaceService();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [bulkDiscount, setBulkDiscount] = useState<null | {
    type: "percentage" | "fixed";
    amount: number;
    expireDate: string | null;
    products: string[];
  }>(null);

  useEffect(() => {
    getMarketplaceSettings().then((settings) => {
      setBulkDiscount(settings.bulkDiscount || null);
    });
  }, []);

  if (!item || !item.id || !item.name) {
    return null;
  }

  // Fiyat ve indirim hesaplamaları
  const originalPrice = Number(item.price) || 0;
  const discountValue = Number(item.discountValue);
  const validDiscountType = item.discountType === "percentage" || item.discountType === "fixed";
  const hasProductDiscount = !isNaN(discountValue) && discountValue > 0 && validDiscountType;
  const productDiscountAmount =
    item.discountType === "percentage"
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
    (bulkDiscount.products.length === 0 || bulkDiscount.products.includes(item.id))
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

  const handleClick = () => {
    router.push(`/store/product/${item.id}`);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }
    
    withReactContent(Swal)
      .fire({
        title: "Satın Alma İşlemi",
        text: `Bu ürünü satın almak istediğinize emin misiniz?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Evet, satın al",
        cancelButtonText: "Hayır, iptal et",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          purchaseProduct([item.id])
            .then((data) => {
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
            })
            .catch((error) => {
              withReactContent(Swal).fire({
                title: "Satın Alma Hatası",
                text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
                icon: "error",
                confirmButtonText: "Tamam",
              });
            });
        }
      });
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(item.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 10;

  return (
    <Card
      onClick={handleClick}
      className={`
        group relative flex flex-col h-full w-full mx-auto
        overflow-hidden transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1 cursor-pointer 
        border-2 rounded-lg
        ${isOutOfStock
          ? "border-red-200 dark:border-red-700 bg-gray-50 dark:bg-gray-900 opacity-80"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-900"
        }
      `}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header with Image and Badges */}
        <div className="relative w-full">
          {/* Image Container - Responsive aspect ratio */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
            {item.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                alt={item.name}
                className="w-full h-full object-contain p-4 drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 h-full w-full">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">Resim Yok</span>
              </div>
            )}
            
            {/* Overlay for hover effect */}
            {!isOutOfStock && (
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 dark:from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
          </div>

          {/* Badges - Better positioning */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 max-w-[calc(100%-1rem)]">
            {isOutOfStock ? (
              <Badge 
                variant="destructive" 
                className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 text-white border-red-600 dark:border-red-800 shadow-lg text-xs font-medium px-2 py-1 whitespace-nowrap"
              >
                <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Stokta Yok</span>
              </Badge>
            ) : isLowStock ? (
              <Badge 
                variant="secondary" 
                className="bg-yellow-500 dark:bg-yellow-700 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-white border-amber-600 dark:border-amber-800 shadow-md text-xs font-medium px-2 py-1 whitespace-nowrap"
              >
                <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Son {item.stock}</span>
              </Badge>
            ) : null}
          </div>

          {/* Discount Badge - Top right */}
          {(showDiscountType && showDiscountAmount > 0) && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-red-500 dark:bg-red-700 text-white text-xs font-medium px-2 py-1 shadow-lg whitespace-nowrap">
                {bulkDiscount && showDiscountType === "bulk"
                  ? (bulkDiscount.type === "percentage"
                      ? `%${bulkDiscount.amount} İndirim`
                      : `${bulkDiscount.amount.toFixed(0)}₺ İndirim`)
                  : (item.discountType === "percentage"
                      ? `%${discountValue}`
                      : `${productDiscountAmount.toFixed(0)}₺`)
                }
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info Section - Fixed layout */}
        <div className="flex flex-col flex-1 p-4 min-h-0">
          {/* Product Name - Fixed height container */}
          <div className="h-16 flex items-center justify-center mb-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 text-center line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {item.name}
            </h3>
          </div>

          {/* Price Section - Consistent spacing */}
          <div className="flex flex-col items-center justify-center mb-4 min-h-[4rem]">
            {(showDiscountType && showDiscountAmount > 0) ? (
              <div className="flex flex-col items-center space-y-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {originalPrice.toFixed(2)} ₺
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {finalPrice <= 0 ? 'Ücretsiz' : `${finalPrice.toFixed(2)} ₺`}
                  </span>
                  <Badge className="bg-red-500 dark:bg-red-700 text-white text-xs font-medium px-2 py-1">
                    {showDiscountType === "bulk" && bulkDiscount
                      ? (bulkDiscount.type === "percentage"
                          ? `%${bulkDiscount.amount} İndirim`
                          : `${bulkDiscount.amount.toFixed(0)}₺ İndirim`)
                      : (item.discountType === "percentage"
                          ? `%${discountValue} İndirim`
                          : `${productDiscountAmount.toFixed(0)}₺ İndirim`)
                    }
                  </Badge>
                </div>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {finalPrice <= 0 ? 'Ücretsiz' : `${originalPrice.toFixed(2)} ₺`}
              </span>
            )}
          </div>

          {/* Action Buttons - Consistent sizing */}
          <div className="flex flex-col gap-2 w-full mt-auto pt-2">
            <Button
              onClick={handleBuyClick}
              disabled={isOutOfStock}
              className={`
                w-full h-10 transition-all duration-200 ease-in-out hover:scale-[1.02]
                ${isOutOfStock
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                  : (hasProductDiscount || hasBulkDiscount)
                  ? "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white"
                  : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }
              `}
            >
              <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{isOutOfStock ? "Stok Tükendi" : "Hemen Al"}</span>
            </Button>
            
            <Button
              onClick={handleAddToCartClick}
              disabled={isOutOfStock || addedToCart}
              className={`
                w-full h-10 transition-all duration-300 ease-in-out hover:scale-[1.02]
                ${isOutOfStock
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed border-gray-300 dark:border-gray-700"
                  : addedToCart
                  ? "bg-emerald-500 dark:bg-emerald-700 text-white cursor-default border-emerald-500 dark:border-emerald-700"
                  : "text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900 hover:text-orange-700 dark:hover:text-orange-300 bg-white dark:bg-gray-900"
                }
              `}
              variant="outline"
            >
              {addedToCart ? (
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <span className="truncate">
                {addedToCart ? "Sepete Eklendi!" : "Sepete Ekle"}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}