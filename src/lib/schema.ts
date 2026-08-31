import { SITE_NAME, SITE_URL } from "./site";

const IMAGE = `${SITE_URL}/og.png`;
const IMAGE_SQUARE = `${SITE_URL}/profil.jpg`;
const TERMS = `${SITE_URL}/villkor`;

const sameDay = {
  "@type": "QuantitativeValue",
  minValue: 0,
  maxValue: 1,
  unitCode: "DAY",
};

/** Digital text levereras direkt. Ingen retur — utkastet är gratis att prova. */
export const merchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "SE",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  merchantReturnLink: TERMS,
};

export const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "SEK",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "SE",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: sameDay,
    transitTime: sameDay,
  },
};

export const productImages = [
  IMAGE,
  IMAGE_SQUARE,
  {
    "@type": "ImageObject",
    url: IMAGE,
    width: 1200,
    height: 630,
  },
];

export function productOffer(priceKr: number, url: string) {
  return {
    "@type": "Offer",
    priceCurrency: "SEK",
    price: String(priceKr),
    priceValidUntil: "2027-08-27",
    validFrom: "2026-08-26T00:00:00+02:00",
    validThrough: "2027-08-27T23:59:59+02:00",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    shippingDetails,
    hasMerchantReturnPolicy: merchantReturnPolicy,
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  slug: string;
  priceKr: number;
  url?: string;
}) {
  const url = input.url ?? `${SITE_URL}/dokument/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: productImages,
    sku: input.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    category: "Digital document",
    hasMerchantReturnPolicy: merchantReturnPolicy,
    offers: productOffer(input.priceKr, url),
  };
}

export const siteImage = IMAGE;
