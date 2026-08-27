import { SITE_NAME, SITE_URL } from "./site";

const IMAGE = `${SITE_URL}/og-sv.jpg`;
const TERMS = `${SITE_URL}/villkor`;

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
    value: "0",
    currency: "SEK",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "SE",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "HUR",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "HUR",
    },
  },
};

export function productOffer(priceKr: number, url: string) {
  return {
    "@type": "Offer",
    priceCurrency: "SEK",
    price: String(priceKr),
    priceValidUntil: "2027-08-27",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    shippingDetails,
    hasMerchantReturnPolicy: merchantReturnPolicy,
  };
}

export const siteImage = IMAGE;
