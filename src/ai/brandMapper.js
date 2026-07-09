/**
 * Brand Mapper - Tự động nhận biết thương hiệu từ từ khóa
 */

const BRAND_MAPPINGS = {
  // Apple
  iphone: "Apple",
  iphon: "Apple",
  ipone: "Apple",
  apple: "Apple",
  ipad: "Apple",
  macbook: "Apple",
  mac: "Apple",
  imac: "Apple",
  airpods: "Apple",
  airpod: "Apple",
  watch: "Apple",
  iwatch: "Apple",

  // Samsung
  samsung: "Samsung",
  "sam sung": "Samsung",
  sams: "Samsung",
  galaxy: "Samsung",
  note: "Samsung",
  "s-series": "Samsung",
  "a-series": "Samsung",
  "z-series": "Samsung",
  fold: "Samsung",
  flip: "Samsung",

  // Xiaomi
  xiaomi: "Xiaomi",
  redmi: "Xiaomi",
  poco: "Xiaomi",
  mi: "Xiaomi",
  "black shark": "Xiaomi",

  // Oppo
  oppo: "Oppo",
  oppoo: "Oppo",
  opp: "Oppo",
  reno: "Oppo",
  find: "Oppo",
  "a-series-oppo": "Oppo",

  // Vivo
  vivo: "Vivo",
  "v-series": "Vivo",
  "y-series": "Vivo",
  "x-series": "Vivo",
  "v-series-vivo": "Vivo",

  // Realme
  realme: "Realme",
  "real me": "Realme",
  "c-series": "Realme",
  gt: "Realme",
  narzo: "Realme",
  "number-series": "Realme",

  // OnePlus
  oneplus: "OnePlus",
  "one plus": "OnePlus",
  op: "OnePlus",
  nord: "OnePlus",

  // Huawei
  huawei: "Huawei",
  honor: "Huawei",
  p: "Huawei",
  mate: "Huawei",
  nova: "Huawei",

  // Nokia
  nokia: "Nokia",
  lumia: "Nokia",

  // Sony
  sony: "Sony",
  xperia: "Sony",
  ericsson: "Sony",

  // HTC
  htc: "HTC",

  // LG
  lg: "LG",
  v: "LG",

  // Motorola
  motorola: "Motorola",
  moto: "Motorola",
  razr: "Motorola",

  // Google
  google: "Google",
  pixel: "Google",

  // Asus
  asus: "Asus",
  zenfone: "Asus",
  rog: "Asus",

  // Lenovo
  lenovo: "Lenovo",
  motorola: "Lenovo",

  // Microsoft
  microsoft: "Microsoft",
  nokia: "Microsoft",
};

exports.detectBrand = (keyword) => {
  if (!keyword) return null;

  const lowerKeyword = keyword.toLowerCase().trim();

  if (BRAND_MAPPINGS[lowerKeyword]) {
    return BRAND_MAPPINGS[lowerKeyword];
  }

  for (const [key, brand] of Object.entries(BRAND_MAPPINGS)) {
    if (lowerKeyword.includes(key)) {
      return brand;
    }
  }

  return null;
};

exports.normalizeBrand = (brandName) => {
  if (!brandName) return null;

  const lowerBrand = brandName.toLowerCase().trim();

  for (const [key, brand] of Object.entries(BRAND_MAPPINGS)) {
    if (lowerBrand === key || lowerBrand.includes(key)) {
      return brand;
    }
  }

  return brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
};

exports.getBrandKeywords = (brand) => {
  if (!brand) return [];

  const keywords = [];
  const normalizedBrand = brand.toLowerCase();

  for (const [key, mappedBrand] of Object.entries(BRAND_MAPPINGS)) {
    if (mappedBrand.toLowerCase() === normalizedBrand) {
      keywords.push(key);
    }
  }

  return keywords;
};

exports.suggestBrand = (keyword) => {
  if (!keyword) return [];

  const lowerKeyword = keyword.toLowerCase().trim();
  const suggestions = [];

  for (const [key, brand] of Object.entries(BRAND_MAPPINGS)) {
    if (key.includes(lowerKeyword) || lowerKeyword.includes(key)) {
      if (!suggestions.includes(brand)) {
        suggestions.push(brand);
      }
    }
  }

  return suggestions;
};
