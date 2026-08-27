/** Live Stripe price IDs on AI Commerce OS. */
export const STRIPE_PRICES: Record<string, string> = {
  "personligt-brev": "price_1U8hkpBEo0YzuylwtnjkWFjU",
  overklagande: "price_1U8hkrBEo0YzuylwcdCw6WhA",
  samboavtal: "price_1U8hktBEo0YzuylwVh66GIVU",
  pro: "price_1U8hkvBEo0YzuylwTIrbQLGy",
  reklamation: "price_1U8hnKBEo0Yzuylw4f1exBSu",
  skuldebrev: "price_1U8hnLBEo0YzuylwtL8E98ox",
  konsultavtal: "price_1U8hnNBEo0YzuylwGJrdqRQY",
  hyresansokan: "price_1U8hnPBEo0Yzuylw0X4iFjLD",
  andrahandskontrakt: "price_1U8hnRBEo0YzuylwntbaMQO7",
  "cv-text": "price_1U8hoCBEo0Yzuylwn0yYCmWr",
  "linkedin-profil": "price_1U8hoDBEo0YzuylwldoWdg1M",
  klagomal: "price_1U8hoFBEo0YzuylwIxt6Iyof",
  sekretessavtal: "price_1U8hoHBEo0Yzuylwh9C0EgbU",
  uppsagning: "price_1U8iOkBEo0YzuylwJTgSIvBB",
  "arn-anmalan": "price_1U8iOwBEo0YzuylwoNFSHCU7",
  anstallningsavtal: "price_1U8iOxBEo0YzuylwAiBYGe7A",
  fullmakt: "price_1U8iOzBEo0Yzuylw8WjmFBBb",
  jobbpaket: "price_1U8iP1BEo0YzuylwnzGvRI7M",
  myndighetsbrev: "price_1U8wLPBEo0YzuylwFP8EsYnj",
};

/** Live Payment Links. */
export const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  "personligt-brev": "https://buy.stripe.com/fZu00i2TL0cu5ioeDr8og02",
  overklagande: "https://buy.stripe.com/9B6dR82TL9N4dOU0MB8og03",
  samboavtal: "https://buy.stripe.com/aFa7sK51T8J026cgLz8og04",
  pro: "https://buy.stripe.com/aFaaEW7a11gyh16fHv8og05",
  reklamation: "https://buy.stripe.com/3cIdR865X5wOcKQ52R8og06",
  skuldebrev: "https://buy.stripe.com/cNicN4eCt3oG9yEdzn8og07",
  hyresansokan: "https://buy.stripe.com/4gM28qbqhbVcdOUcvj8og08",
  konsultavtal: "https://buy.stripe.com/3cIfZggKBaR89yE66V8og09",
  andrahandskontrakt: "https://buy.stripe.com/fZu28q2TLe3k3ag2UJ8og0a",
  "cv-text": "https://buy.stripe.com/fZucN4eCt8J0eSYgLz8og0b",
  "linkedin-profil": "https://buy.stripe.com/5kQdR8eCte3kbGMgLz8og0c",
  klagomal: "https://buy.stripe.com/bJedR8bqh7EW7qw52R8og0d",
  sekretessavtal: "https://buy.stripe.com/00waEW51T3oG128brf8og0e",
  uppsagning: "https://buy.stripe.com/fZu28qdyp6ASeSY8f38og0f",
  "arn-anmalan": "https://buy.stripe.com/bJe4gyeCtaR88uA3YN8og0g",
  anstallningsavtal: "https://buy.stripe.com/5kQeVc3XP0cu9yE66V8og0h",
  fullmakt: "https://buy.stripe.com/28E6oG3XPcZg8uA3YN8og0i",
  jobbpaket: "https://buy.stripe.com/7sY6oGamd8J0dOU8f38og0j",
  myndighetsbrev: "https://buy.stripe.com/6oU4gyfGx9N41289j78og0k",
};

export const PRO_SLUG = "pro";
export const JOB_PACK_SLUG = "jobbpaket";
export const JOB_PACK_UNLOCKS = ["personligt-brev", "cv-text", "linkedin-profil"] as const;
export const JOB_PACK_PRICE_KR = 199;
