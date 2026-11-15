import { MarketplaceProduct } from "@/data/aiMarketplaceData";

export interface ProductApiItem {
  _id?: string;
  title?: string;
  name?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  price?: unknown;
  buyNowPrice?: unknown;
  minNegotiablePrice?: unknown;
  color?: string;
  tags?: string[];
  images?: Array<string | { url?: string }>;
  image?: string;
  description?: string;
  sellerId?: string;
  sellerName?: string;
  sellerRating?: unknown;
  status?: string;
  approvalStatus?: string;
  createdAt?: string;
  shippingTerms?: string;
  returnPolicy?: string;
  customFaq?: string;
  allowNegotiation?: boolean;
  qualityScore?: unknown;
  angleAdvice?: string;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    const parsed = Number((value as { $numberDecimal: string }).$numberDecimal);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function mapProduct(item: ProductApiItem): MarketplaceProduct {
  const status = item.status === "SOLD" ? "Sold" : item.approvalStatus === "PENDING" ? "UnderReview" : "Available";
  const primaryImage = item.images?.[0];
  const condition =
    item.condition === "NEW"
      ? "Brand New"
      : item.condition === "REFURBISHED"
        ? "Refurbished"
        : item.condition === "USED"
          ? "Good"
          : "Like New";

  return {
    id: item._id || "",
    name: item.title || item.name || "Untitled listing",
    category: item.category || "General",
    subcategory: item.subcategory || item.category || "General",
    price: toNumber(item.price ?? item.buyNowPrice),
    minNegotiablePrice: toNumber(item.minNegotiablePrice ?? item.price ?? item.buyNowPrice),
    condition,
    color: item.color || "N/A",
    tags: item.tags || [],
    image: (typeof primaryImage === "string" ? primaryImage : primaryImage?.url) || item.image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    galleryImages: item.images?.map((image) => typeof image === "string" ? image : image.url || "").filter(Boolean) || [],
    description: item.description || "",
    sellerId: item.sellerId || "",
    sellerName: item.sellerName || "Seller",
    sellerRating: toNumber(item.sellerRating),
    sellerType: "Verified Vendor",
    status,
    complianceApproved: item.approvalStatus === "APPROVED",
    createdAt: item.createdAt || "",
    chatGptRules: {
      lowestAcceptablePrice: toNumber(item.minNegotiablePrice ?? item.price ?? item.buyNowPrice),
      shippingTerms: item.shippingTerms || "Standard shipping",
      returnPolicy: item.returnPolicy || "Platform policy",
      customFaq: item.customFaq || "",
      allowNegotiation: item.allowNegotiation ?? true,
    },
    aiInspection: {
      detectedType: item.category || "Listing",
      detectedCategory: item.category || "General",
      detectedColor: item.color || "N/A",
      qualityScore: toNumber(item.qualityScore),
      angleAdvice: item.angleAdvice || "",
      lightingStatus: "Optimal",
      suggestedTags: item.tags || [],
    },
    reviews: [],
  };
}

export function conditionToApi(condition: MarketplaceProduct["condition"]) {
  if (condition === "Brand New") return "NEW";
  if (condition === "Refurbished") return "REFURBISHED";
  if (condition === "Good") return "USED";
  return "LIKE_NEW";
}

export function statusToApi(status: MarketplaceProduct["status"]) {
  if (status === "Sold") return "SOLD";
  if (status === "UnderReview") return "DRAFT";
  return "ACTIVE";
}
