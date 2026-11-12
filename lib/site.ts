export const site = {
  name: "Smart Coastal Assets",
  url: "https://smartcoastalassets.com",
  tagline: "Luxury coastal residences in Pinellas County, Florida",
  description:
    "Smart Coastal Assets presents new and move-in-ready luxury coastal residences from Clearwater Beach to St. Pete Beach in Pinellas County, Florida, with short-term-rental flexibility, DSCR financing options and verified project details.",
  region: "Pinellas County, Florida",
  brokerage: "Century 21 Beggins Enterprises",
  agent: {
    name: "Jeff Beggins",
    phone: "813-245-0015",
    phoneE164: "+18132450015",
    email: "JeffBeggins@C21be.com",
  },
  legalFooter:
    "CENTURY 21® and the CENTURY 21 Logo are registered service marks of Century 21 Real Estate LLC. Each franchise is independently owned and operated. Equal Housing Opportunity.",
  generalDisclaimer:
    "Prices, availability, features and terms are subject to change without notice and are subject to the purchase contract and lender approval. Rental income figures are estimates or historical figures from the sources noted and are not guaranteed. Tax benefits depend on your individual circumstances; consult your CPA or tax advisor.",
} as const;

export const nav = [
  { href: "/#map", label: "Map" },
  { href: "/projects", label: "Residences" },
  { href: "/guides", label: "Buyer Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
