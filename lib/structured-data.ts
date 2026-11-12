import type { Project } from "./project-schema";
import { cardImageOf, fullAddress, heroImageOf } from "./projects";
import { site } from "./site";

const ORG_ID = `${site.url}/#organization`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.agent.phoneE164,
    email: site.agent.email,
    areaServed: [
      "Clearwater Beach, FL",
      "Indian Rocks Beach, FL",
      "Indian Shores, FL",
      "Madeira Beach, FL",
      "Treasure Island, FL",
      "St. Pete Beach, FL",
      "Pinellas County, FL",
    ],
    parentOrganization: { "@type": "RealEstateAgent", name: site.brokerage },
    employee: { "@type": "Person", name: site.agent.name, telephone: site.agent.phoneE164, email: site.agent.email },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function numberOrUndefined(value?: string) {
  if (!value) return undefined;
  const n = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export function projectLd(p: Project) {
  const url = `${site.url}/projects/${p.slug}`;
  const images = [heroImageOf(p), cardImageOf(p), ...p.gallery]
    .filter((img): img is NonNullable<typeof img> => Boolean(img))
    .map((img) => `${site.url}${img.src}`);

  const place = {
    "@type": "ApartmentComplex",
    "@id": `${url}#place`,
    name: p.name,
    description: p.summary,
    url,
    image: [...new Set(images)],
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address.street,
      addressLocality: p.address.city,
      addressRegion: p.address.state,
      postalCode: p.address.zip,
      addressCountry: "US",
    },
    geo: p.geo ? { "@type": "GeoCoordinates", latitude: p.geo.lat, longitude: p.geo.lng } : undefined,
    numberOfAccommodationUnits: numberOrUndefined(p.stats.residences),
    numberOfBedrooms: numberOrUndefined(p.stats.bedrooms),
    numberOfBathroomsTotal: numberOrUndefined(p.stats.bathrooms),
    floorSize: numberOrUndefined(p.stats.sqft)
      ? { "@type": "QuantitativeValue", value: numberOrUndefined(p.stats.sqft), unitCode: "FTK" }
      : undefined,
    amenityFeature: p.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.label, value: true })),
    petsAllowed: p.amenities.some((a) => a.icon === "paw") || undefined,
  };

  const offers =
    p.price?.from !== undefined
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: p.price.from,
          highPrice: p.price.to ?? p.price.from,
          availability: p.status === "soldout" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          offeredBy: { "@id": ORG_ID },
          url,
        }
      : undefined;

  const listing = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: `${p.name}, ${fullAddress(p)}`,
    description: p.summary,
    url,
    image: [...new Set(images)],
    datePosted: p.lastVerified,
    dateModified: p.lastVerified,
    about: place,
    mainEntity: place,
    offers,
    provider: { "@id": ORG_ID },
  };

  return listing;
}
