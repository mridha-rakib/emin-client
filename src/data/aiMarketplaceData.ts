export interface ChatGptPresetRules {
  lowestAcceptablePrice: number;
  shippingTerms: string;
  returnPolicy: string;
  customFaq: string;
  allowNegotiation: boolean;
}

export interface AiPhotoInspection {
  detectedType: string;
  detectedCategory: string;
  detectedColor: string;
  qualityScore: number;
  angleAdvice: string;
  lightingStatus: "Optimal" | "Suboptimal" | "Too Dim";
  suggestedTags: string[];
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  minNegotiablePrice: number;
  condition: "Brand New" | "Like New" | "Refurbished" | "Good";
  color: string;
  tags: string[];
  image: string;
  galleryImages: string[];
  description: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerType: "Individual" | "Verified Vendor";
  status: "Available" | "Sold" | "UnderReview";
  complianceApproved: boolean;
  createdAt: string;
  chatGptRules: ChatGptPresetRules;
  aiInspection: AiPhotoInspection;
  reviews: ProductReview[];
}

export const INITIAL_AI_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "PROD-101",
    name: "Apple iPhone 15 Pro Max - 256GB Natural Titanium",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 980,
    minNegotiablePrice: 910,
    condition: "Like New",
    color: "Titanium Gray",
    tags: ["Apple", "iPhone", "5G", "Titanium", "Flagship"],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Flawless condition, factory unlocked, battery health at 99%. Comes with original USB-C braided cable and box.",
    sellerId: "SELL-501",
    sellerName: "Daniel Craig",
    sellerRating: 4.9,
    sellerType: "Verified Vendor",
    status: "Available",
    complianceApproved: true,
    createdAt: "2026-05-12",
    chatGptRules: {
      lowestAcceptablePrice: 910,
      shippingTerms: "Free insured express courier within 24 hours.",
      returnPolicy: "7 days inspection window with full refund if item condition differs from description.",
      customFaq: "Battery health is verified at 99%. No cosmetic scratches or dents.",
      allowNegotiation: true
    },
    aiInspection: {
      detectedType: "Smartphone",
      detectedCategory: "Electronics",
      detectedColor: "Titanium Gray",
      qualityScore: 96,
      angleAdvice: "Excellent 45-degree angled perspective showing clean screen and bezel.",
      lightingStatus: "Optimal",
      suggestedTags: ["Apple", "iPhone 15", "OLED", "Titanium"]
    },
    reviews: [
      {
        id: "REV-1",
        userName: "Marcus Vance",
        rating: 5,
        comment: "Item arrived exactly as described, seller was super responsive!",
        date: "2026-05-14"
      }
    ]
  },
  {
    id: "PROD-102",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Audio",
    subcategory: "Headphones",
    price: 299,
    minNegotiablePrice: 260,
    condition: "Brand New",
    color: "Midnight Black",
    tags: ["Sony", "ANC", "Wireless", "Hi-Res Audio", "Bluetooth"],
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Brand new sealed in box. Industry leading noise cancellation with two processors and 8 microphones.",
    sellerId: "SELL-502",
    sellerName: "Sophia Schmidt",
    sellerRating: 4.8,
    sellerType: "Individual",
    status: "Available",
    complianceApproved: true,
    createdAt: "2026-05-14",
    chatGptRules: {
      lowestAcceptablePrice: 260,
      shippingTerms: "Standard tracked shipping (CHF 10) or free local pick up in Zurich / Basel.",
      returnPolicy: "Returns accepted within 14 days if unopened.",
      customFaq: "Comes with manufacturer international warranty until May 2027.",
      allowNegotiation: true
    },
    aiInspection: {
      detectedType: "Over-Ear Headphones",
      detectedCategory: "Audio",
      detectedColor: "Midnight Black",
      qualityScore: 92,
      angleAdvice: "Good studio lighting. Suggested adding a shot of the retail box seals.",
      lightingStatus: "Optimal",
      suggestedTags: ["Sony", "WH1000XM5", "Noise Cancelling", "Hi-Res"]
    },
    reviews: [
      {
        id: "REV-2",
        userName: "Laura Weber",
        rating: 5,
        comment: "Awesome sound quality and fast delivery!",
        date: "2026-05-15"
      }
    ]
  },
  {
    id: "PROD-103",
    name: "Herman Miller Aeron Ergonomic Chair - Size B",
    category: "Furniture",
    subcategory: "Office Chairs",
    price: 850,
    minNegotiablePrice: 780,
    condition: "Like New",
    color: "Mineral Silver",
    tags: ["Ergonomic", "Herman Miller", "Aeron", "Office", "Comfort"],
    image: "https://images.unsplash.com/photo-1580481077195-c328ad4f0605?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1580481077195-c328ad4f0605?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Full posture fit SL lumbar support, fully adjustable arms with forward tilt limiter. Mineral satin finish.",
    sellerId: "SELL-503",
    sellerName: "Alexander Klein",
    sellerRating: 5.0,
    sellerType: "Verified Vendor",
    status: "Available",
    complianceApproved: true,
    createdAt: "2026-05-10",
    chatGptRules: {
      lowestAcceptablePrice: 780,
      shippingTerms: "Heavy freight delivery or local pickup. Freight cost split 50/50.",
      returnPolicy: "All sales final after on-site inspection.",
      customFaq: "Includes 12-year manufacturer warranty transfer paperwork.",
      allowNegotiation: true
    },
    aiInspection: {
      detectedType: "Office Ergonomic Chair",
      detectedCategory: "Furniture",
      detectedColor: "Mineral Silver",
      qualityScore: 94,
      angleAdvice: "Clear full-height view. Recommend showing mesh seat closeup.",
      lightingStatus: "Optimal",
      suggestedTags: ["Herman Miller", "Aeron", "PostureFit", "Ergonomics"]
    },
    reviews: []
  },
  {
    id: "PROD-104",
    name: "DJI Mini 4 Pro Drone Fly More Combo Plus",
    category: "Electronics",
    subcategory: "Drones & Cameras",
    price: 790,
    minNegotiablePrice: 720,
    condition: "Refurbished",
    color: "Arctic White",
    tags: ["DJI", "Drone", "4K HDR", "Omnidirectional", "Gimbal"],
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Includes DJI RC 2 controller with bright screen, 3 intelligent flight batteries Plus, two-way charging hub, and shoulder bag.",
    sellerId: "SELL-501",
    sellerName: "Daniel Craig",
    sellerRating: 4.9,
    sellerType: "Verified Vendor",
    status: "Available",
    complianceApproved: true,
    createdAt: "2026-05-11",
    chatGptRules: {
      lowestAcceptablePrice: 720,
      shippingTerms: "Express air shipping with tracking provided within 2 hours.",
      returnPolicy: "30-day warranty directly with our certified technician store.",
      customFaq: "Drone has been calibrated and tested. Less than 4 total flight hours.",
      allowNegotiation: true
    },
    aiInspection: {
      detectedType: "Quadcopter Drone",
      detectedCategory: "Electronics",
      detectedColor: "Arctic White",
      qualityScore: 90,
      angleAdvice: "Good flatlay showing all accessories and batteries.",
      lightingStatus: "Optimal",
      suggestedTags: ["DJI", "Mini 4 Pro", "4K Video", "Ultralight"]
    },
    reviews: []
  },
  {
    id: "PROD-105",
    name: "MacBook Pro 16-inch M3 Max - 36GB RAM, 1TB SSD",
    category: "Electronics",
    subcategory: "Laptops",
    price: 2850,
    minNegotiablePrice: 2650,
    condition: "Brand New",
    color: "Space Black",
    tags: ["Apple", "MacBook Pro", "M3 Max", "Space Black", "Laptop"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Ultimate powerhouse for 3D renderers and developers. 16-core CPU, 40-core GPU, Liquid Retina XDR display.",
    sellerId: "SELL-504",
    sellerName: "TechHub Global Direct",
    sellerRating: 4.95,
    sellerType: "Verified Vendor",
    status: "Available",
    complianceApproved: true,
    createdAt: "2026-05-15",
    chatGptRules: {
      lowestAcceptablePrice: 2650,
      shippingTerms: "Fully insured signature-required priority DHL delivery.",
      returnPolicy: "14-day hassle-free return window.",
      customFaq: "Eligible for AppleCare+ addition within 60 days.",
      allowNegotiation: true
    },
    aiInspection: {
      detectedType: "Laptop Computer",
      detectedCategory: "Electronics",
      detectedColor: "Space Black",
      qualityScore: 98,
      angleAdvice: "Crisp studio shot with vibrant display contrast.",
      lightingStatus: "Optimal",
      suggestedTags: ["Apple", "MacBook Pro", "M3 Max", "Retina Display"]
    },
    reviews: []
  }
];

export const MARKETPLACE_CATEGORIES = [
  "All",
  "Electronics",
  "Audio",
  "Furniture",
  "Drones & Cameras",
  "Home & Kitchen",
  "Fashion & Apparel"
];

export const PRODUCT_COLORS = [
  "All Colors",
  "Titanium Gray",
  "Midnight Black",
  "Mineral Silver",
  "Arctic White",
  "Space Black",
  "Navy Blue",
  "Gold"
];
