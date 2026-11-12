import "server-only";
import type { Project } from "./project-schema";
import { getActiveProjects } from "./projects";

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Direct, quotable answer shown first on the page. */
  answer: string;
  updated: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  disclaimer?: string;
};

const REVIEWED = "2026-11-12";

const TAX_DISCLAIMER =
  "This guide is general educational information, not tax, legal or financial advice. Tax outcomes depend on your specific facts. Consult a qualified CPA or tax attorney before making decisions.";

function rentalRow(p: Project) {
  return [
    p.name,
    `${p.address.city}`,
    p.details.rentalMinimum ?? "Ask",
    p.details.management ?? "Ask",
    p.details.personalUse ?? "Ask",
  ];
}

export function getGuides(): Guide[] {
  const projects = getActiveProjects();
  const str = projects.filter((p) => /1–7|nightly/i.test(p.details.rentalMinimum ?? ""));
  const dscr = projects.filter((p) => p.details.dscr);
  const ready = projects.filter((p) => /move-in ready|completed/i.test(p.stats.completion ?? ""));

  return [
    {
      slug: "compare-pinellas-coastal-residences",
      title: "Compare Pinellas County Coastal Residences: Price, Rentals, Financing",
      description:
        "Side-by-side comparison of current Smart Coastal Assets residences in Pinellas County, Florida: pricing, rental minimums, management rules, financing and completion.",
      answer: `Smart Coastal Assets currently offers ${projects.length} coastal residences in Pinellas County, Florida: ${projects
        .map((p) => `${p.name} in ${p.address.city} (${p.price?.display ?? "pricing on request"})`)
        .join("; ")}. ${str.length} allow nightly or 1–7 day rentals, ${dscr.length} offer DSCR financing, and ${ready.length} ${ready.length === 1 ? "is" : "are"} move-in ready.`,
      updated: REVIEWED,
      sections: [
        {
          heading: "Price, size and completion",
          table: {
            head: ["Residence", "Location", "Price", "Beds / Baths", "Sq. Ft.", "Residences", "Completion"],
            rows: projects.map((p) => [
              p.name,
              `${p.address.street}, ${p.address.city}`,
              p.price?.display ?? "On request",
              [p.stats.bedrooms, p.stats.bathrooms].filter(Boolean).join(" / ") || "Varies",
              p.stats.sqft ?? "Varies",
              p.stats.residences ?? "—",
              p.stats.completion ?? "—",
            ]),
          },
        },
        {
          heading: "Rental rules and management",
          table: { head: ["Residence", "Town", "Minimum stay", "Management", "Personal use"], rows: projects.map(rentalRow) },
        },
        {
          heading: "Deposits and financing",
          table: {
            head: ["Residence", "Initial deposit", "Total down", "Financing"],
            rows: projects.map((p) => [p.name, p.details.deposit ?? "Ask", p.details.downPayment ?? "Ask", p.details.financing ?? "Ask"]),
          },
        },
        {
          heading: "Published rental income figures",
          paragraphs: [
            "Income figures below are exactly as provided by the sources named. They are estimates or current rates, not guarantees.",
          ],
          table: {
            head: ["Residence", "Figure", "Basis", "Source"],
            rows: projects
              .filter((p) => p.income)
              .map((p) => [p.name, p.income?.figure ?? "On request", p.income?.label ?? "", p.income?.source ?? p.income?.note ?? ""]),
          },
        },
      ],
      faqs: [
        {
          q: "Which Pinellas County residences allow short-term rentals?",
          a: str.length
            ? `${str.map((p) => `${p.name} (${p.address.city}): ${p.details.rentalMinimum}`).join("; ")}.`
            : "Contact us for current short-term-rental options.",
        },
        {
          q: "Which residences allow owners to self-manage rentals?",
          a: [
            projects
              .filter((p) => /self-manag/i.test(p.details.management ?? "") && !/not self-managed/i.test(p.details.management ?? ""))
              .map((p) => p.name)
              .join(", ") + " allow self-management.",
            ...projects
              .filter((p) => /not self-managed|mandatory/i.test(p.details.management ?? ""))
              .map((p) => `${p.name}: ${p.details.management}`),
          ].join(" "),
        },
        {
          q: "Which residences are move-in ready?",
          a: ready.length ? `${ready.map((p) => `${p.name} (${p.address.city})`).join(", ")}.` : "None at this time.",
        },
      ],
      sources: [{ label: "Smart Coastal Assets project intake data (verified dates shown on each project page)", url: "https://smartcoastalassets.com/projects" }],
    },
    {
      slug: "short-term-rental-rules-pinellas-county",
      title: "Short-Term Rental Rules for Pinellas County Beach Properties",
      description:
        "How short-term (vacation) rentals work at Pinellas County beach properties: Florida's vacation rental law, licensing, tourist taxes and the rental rules at each Smart Coastal Assets residence.",
      answer:
        "Whether you can rent a Pinellas County beach property short term depends on three layers: Florida law, the city's local ordinances, and the building's condominium or HOA documents. Florida generally prevents cities from banning vacation rentals or limiting rental duration under ordinances adopted after June 1, 2011, but older local rules and association documents can still restrict stays. Owners also need a Florida vacation rental license and must collect state and county transient rental taxes.",
      updated: REVIEWED,
      sections: [
        {
          heading: "1. Florida state law",
          paragraphs: [
            "Section 509.032(7), Florida Statutes, provides that a local law, ordinance or regulation may not prohibit vacation rentals or regulate the duration or frequency of vacation rentals. This limit does not apply to local rules adopted on or before June 1, 2011, so some cities still enforce older minimum-stay rules.",
            "Vacation rentals are licensed by the Florida Department of Business and Professional Regulation (DBPR), Division of Hotels and Restaurants.",
          ],
        },
        {
          heading: "2. City rules",
          paragraphs: [
            "Each beach town (Clearwater Beach, Indian Rocks Beach, Indian Shores, Madeira Beach, Treasure Island and St. Pete Beach) sets its own zoning, registration and safety requirements. Zoning matters: in some areas nightly rentals are allowed only in certain districts. Always confirm the current rules with the city before buying.",
          ],
        },
        {
          heading: "3. Association documents",
          paragraphs: [
            "Condominium declarations and HOA rules can impose their own minimum stays, rental caps and management requirements. In a new development, the developer sets these rules in the offering documents, which is why each Smart Coastal Assets project lists its rental minimum and management terms.",
          ],
        },
        {
          heading: "Rental rules at current Smart Coastal Assets residences",
          table: { head: ["Residence", "Town", "Minimum stay", "Management", "Personal use"], rows: projects.map(rentalRow) },
        },
        {
          heading: "Taxes on short-term rental income",
          paragraphs: [
            "Rentals of six months or less are generally subject to Florida's 6% state sales tax on transient rentals, Pinellas County's discretionary sales surtax and the Pinellas County tourist development tax. Verify current rates with the Florida Department of Revenue and the Pinellas County Tax Collector. Platforms and management companies may collect some of these taxes for you.",
          ],
        },
      ],
      faqs: [
        {
          q: "Can a Florida city ban short-term rentals?",
          a: "Under section 509.032(7), Florida Statutes, local governments may not prohibit vacation rentals or regulate their duration or frequency, except under local rules adopted on or before June 1, 2011. Condominium and HOA documents can still restrict rentals.",
        },
        {
          q: "Do I need a license to rent my Florida condo short term?",
          a: "Yes. Vacation rentals in Florida must be licensed by the Department of Business and Professional Regulation, Division of Hotels and Restaurants. Cities may also require local registration.",
        },
        {
          q: "Which Smart Coastal Assets properties allow 1–7 day rentals?",
          a: str.length ? `${str.map((p) => `${p.name} in ${p.address.city} (${p.details.rentalMinimum})`).join("; ")}.` : "Contact us for current options.",
        },
      ],
      sources: [
        { label: "Florida Statutes §509.032 (Florida Legislature)", url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0509/Sections/0509.032.html" },
        { label: "Florida DBPR: Vacation Rentals", url: "https://www2.myfloridalicense.com/hotels-restaurants/lodging/vacation-rentals/" },
        { label: "Florida Department of Revenue: Sales and Use Tax", url: "https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx" },
        { label: "Florida Department of Revenue: Local Option Taxes", url: "https://floridarevenue.com/taxes/taxesfees/Pages/local_option.aspx" },
        { label: "Pinellas County Tax Collector: Tourist Development Tax", url: "https://pinellastaxcollector.gov/property-tax/tourist-development-taxes/" },
      ],
      disclaimer: "Rules change. Verify current requirements with the city, the State of Florida and the association before purchasing.",
    },
    {
      slug: "dscr-loans-for-vacation-rentals",
      title: "DSCR Loans for Florida Vacation Rentals: How They Work",
      description:
        "What a DSCR (debt service coverage ratio) loan is, how lenders calculate it for vacation rentals, and which Smart Coastal Assets residences offer DSCR financing.",
      answer:
        "A DSCR loan is an investment-property mortgage that qualifies you mainly on the property's rental income instead of your personal income. The lender divides the property's expected rental income by its monthly debt payment (principal, interest, taxes, insurance and association dues). A ratio of 1.0 means the rent exactly covers the payment; many lenders look for 1.0 to 1.25 or higher.",
      updated: REVIEWED,
      sections: [
        {
          heading: "How DSCR is calculated",
          paragraphs: [
            "DSCR = rental income ÷ PITIA (principal, interest, taxes, insurance and association dues). For example, if a residence is expected to rent for $12,000 per month and the full monthly payment is $10,000, the DSCR is 1.2.",
            "For vacation rentals, lenders may use short-term-rental market data or an appraiser's rent estimate rather than a long-term lease.",
          ],
        },
        {
          heading: "Typical features",
          bullets: [
            "No personal income verification (tax returns, W-2s) in most programs; credit and reserves still matter.",
            "Larger down payments than owner-occupied loans are common; many programs start around 20–25%.",
            "Rates are usually higher than conventional mortgages.",
            "Loans are typically made to individuals or LLCs for investment use.",
          ],
        },
        {
          heading: "Smart Coastal Assets residences with DSCR financing",
          table: {
            head: ["Residence", "Financing options", "Total down payment"],
            rows: dscr.map((p) => [p.name, p.details.financing ?? "", p.details.downPayment ?? "Ask"]),
          },
        },
      ],
      faqs: [
        {
          q: "What does DSCR stand for?",
          a: "Debt service coverage ratio: the property's rental income divided by its total monthly debt payment (principal, interest, taxes, insurance and association dues).",
        },
        {
          q: "Can I use a DSCR loan for a short-term rental?",
          a: "Many DSCR lenders accept short-term rentals and use market data for nightly rental income. Property rules matter: the residence must permit the rental use the lender is underwriting.",
        },
      ],
      sources: [{ label: "Consumer Financial Protection Bureau: Mortgage key terms", url: "https://www.consumerfinance.gov/owning-a-home/" }],
      disclaimer: "Loan terms vary by lender and borrower. All financing is subject to lender approval.",
    },
    {
      slug: "short-term-rental-tax-strategy",
      title: "Short-Term Rental Tax Strategy: Cost Segregation and Bonus Depreciation",
      description:
        "How the 7-day short-term rental rule, material participation, cost segregation and 100% bonus depreciation can work together for coastal vacation rental owners. Educational, not tax advice.",
      answer:
        "Under IRS passive-activity rules, a rental with an average guest stay of seven days or less is generally not treated as a 'rental activity.' If the owner also materially participates, losses from the property, including accelerated depreciation from a cost segregation study, may be able to offset non-passive income. Federal law restored 100% bonus depreciation for qualified property acquired after January 19, 2025. Eligibility depends on your facts; a CPA must determine it.",
      updated: REVIEWED,
      sections: [
        {
          heading: "The 7-day average stay rule",
          paragraphs: [
            "Treasury Regulation §1.469-1T(e)(3)(ii)(A) excludes from the definition of 'rental activity' any activity where the average period of customer use is seven days or less. That is why residences permitting 1–7 day rentals are of interest to tax-focused buyers.",
          ],
        },
        {
          heading: "Material participation",
          paragraphs: [
            "To treat losses as non-passive, the owner generally must materially participate under one of the tests in Treasury Regulation §1.469-5T(a). Examples include participating more than 500 hours in the year, or more than 100 hours and not less than any other individual (including a property manager). Using a full-service manager can make these tests harder to meet.",
          ],
        },
        {
          heading: "Cost segregation and bonus depreciation",
          paragraphs: [
            "A cost segregation study identifies parts of a property, such as furnishings, certain fixtures and site improvements, that can be depreciated over 5, 7 or 15 years instead of the building's 27.5- or 39-year life. Shorter-life property may qualify for bonus depreciation, which allows an immediate first-year deduction.",
            "The 2025 federal tax law (Public Law 119-21) permanently restored 100% bonus depreciation for qualified property acquired after January 19, 2025. Land is never depreciable.",
          ],
        },
        {
          heading: "Current residences permitting 1–7 day or nightly rentals",
          table: {
            head: ["Residence", "Minimum stay", "Management", "Tax note provided"],
            rows: str.map((p) => [p.name, p.details.rentalMinimum ?? "", p.details.management ?? "", p.tax?.note ?? "Ask your CPA"]),
          },
        },
      ],
      faqs: [
        {
          q: "What is the short-term rental tax loophole?",
          a: "It refers to Treasury Regulation §1.469-1T(e)(3)(ii)(A): when the average guest stay is seven days or less, the property is generally not a 'rental activity' for passive-loss purposes. With material participation, losses may offset other income. Consult a CPA.",
        },
        {
          q: "Is 100% bonus depreciation available in 2026?",
          a: "Public Law 119-21 (enacted July 4, 2025) permanently restored 100% bonus depreciation for qualified property acquired after January 19, 2025. Whether your purchase qualifies depends on your facts; consult a CPA.",
        },
        {
          q: "Does a resort-managed condo qualify for the short-term rental strategy?",
          a: "It may be harder. Material participation tests count your hours relative to others, and mandatory resort management typically performs most of the work. A CPA should evaluate your situation.",
        },
      ],
      sources: [
        { label: "26 CFR §1.469-1T (eCFR)", url: "https://www.ecfr.gov/current/title-26/section-1.469-1T" },
        { label: "26 CFR §1.469-5T: Material participation (eCFR)", url: "https://www.ecfr.gov/current/title-26/section-1.469-5T" },
        { label: "IRS Publication 946: How to Depreciate Property", url: "https://www.irs.gov/publications/p946" },
        { label: "IRS Publication 925: Passive Activity and At-Risk Rules", url: "https://www.irs.gov/publications/p925" },
      ],
      disclaimer: TAX_DISCLAIMER,
    },
    {
      slug: "buying-pre-construction-condo-florida",
      title: "Buying a Pre-Construction Condo in Florida: Deposits, Rights and Timeline",
      description:
        "What to expect when buying new-construction coastal condominiums in Florida: the 15-day cancellation right, escrow of deposits, timelines and documents.",
      answer:
        "When you buy a new condominium directly from a Florida developer, section 718.503 of the Florida Statutes gives you 15 days after signing the contract and receiving the required documents to cancel. Deposits must be held in escrow under section 718.202. Review the prospectus, declaration, budget and plans before the 15 days end.",
      updated: REVIEWED,
      sections: [
        {
          heading: "Your 15-day right to cancel",
          paragraphs: [
            "Section 718.503(1)(a) lets a buyer cancel a developer contract within 15 days after signing it and receiving all items the developer must deliver. Use this window to read the documents and ask questions.",
          ],
        },
        {
          heading: "Deposits and escrow",
          paragraphs: [
            "Section 718.202 requires developers to hold buyer deposits in escrow. If the contract allows it, deposits above 10% of the purchase price may be used for construction, subject to statutory conditions. Ask how and where your deposit will be held.",
          ],
        },
        {
          heading: "Documents to review",
          bullets: [
            "Prospectus or offering circular",
            "Declaration of condominium, bylaws and rules (including rental rules)",
            "Estimated operating budget and reserve schedule",
            "Floor plans, site plan and specifications",
            "Management or rental program agreements, if any",
          ],
        },
        {
          heading: "Current deposit terms",
          table: {
            head: ["Residence", "Initial deposit", "Total down", "Completion"],
            rows: projects.map((p) => [p.name, p.details.deposit ?? "Ask", p.details.downPayment ?? "Ask", p.stats.completion ?? "—"]),
          },
        },
      ],
      faqs: [
        {
          q: "Can I cancel a pre-construction condo contract in Florida?",
          a: "Yes. Under section 718.503, Florida Statutes, buyers from a developer may cancel within 15 days after signing the contract and receiving the required documents.",
        },
        {
          q: "Is my condo deposit protected in Florida?",
          a: "Section 718.202 requires developer deposits to be held in escrow. Deposits over 10% of the price may be used for construction only if the contract permits it and statutory conditions are met.",
        },
      ],
      sources: [
        { label: "Florida Statutes §718.503", url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0718/Sections/0718.503.html" },
        { label: "Florida Statutes §718.202", url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0718/Sections/0718.202.html" },
      ],
      disclaimer: "This is general information, not legal advice. Have a Florida real estate attorney review your contract.",
    },
    {
      slug: "cost-of-owning-coastal-property-pinellas",
      title: "The Cost of Owning Coastal Property in Pinellas County",
      description:
        "The recurring costs of owning a beach condo or townhome in Pinellas County, Florida: property tax, homestead benefits, insurance, association dues and rental taxes.",
      answer:
        "Beyond the mortgage, Pinellas County coastal owners typically pay property taxes, homeowners or condo insurance (often including windstorm and flood coverage), association dues, utilities and, for rentals, management fees and transient rental taxes. A primary residence that qualifies for Florida's homestead exemption gets a lower taxable value and a 3% annual cap on assessment increases; non-homestead property is capped at 10% for non-school taxes.",
      updated: REVIEWED,
      sections: [
        {
          heading: "Property taxes",
          bullets: [
            "Homestead (primary residence): Florida's homestead exemption reduces taxable value, and the Save Our Homes cap limits annual assessed-value increases to 3% or the change in CPI, whichever is lower.",
            "Non-homestead (second home or rental): annual assessment increases for non-school taxes are capped at 10%.",
            "New construction is assessed once complete; budget based on the full purchase price.",
          ],
        },
        {
          heading: "Insurance",
          bullets: [
            "Condominium owners generally insure their unit interior (HO-6), while the association insures the building.",
            "Townhome owners may insure the full structure depending on the association documents.",
            "Flood insurance is required by federally backed lenders in FEMA Special Flood Hazard Areas, and is recommended on the coast either way.",
          ],
        },
        {
          heading: "Other recurring costs",
          bullets: [
            "Association dues (amenities, building insurance, reserves)",
            "Utilities, internet and furnishing replacement for rentals",
            "Management fees, if you use a manager",
            "State and county transient rental taxes on short-term stays",
          ],
        },
      ],
      faqs: [
        {
          q: "What is the Save Our Homes cap?",
          a: "For Florida homestead property, annual increases in assessed value are limited to 3% or the change in the Consumer Price Index, whichever is lower.",
        },
        {
          q: "Do I need flood insurance for a Pinellas beach condo?",
          a: "If the property is in a FEMA Special Flood Hazard Area and you have a federally backed mortgage, flood insurance is required. On the coast it is strongly recommended either way.",
        },
      ],
      sources: [
        { label: "Pinellas County Property Appraiser", url: "https://www.pcpao.gov/" },
        { label: "Florida Department of Revenue: Property Tax Exemptions", url: "https://floridarevenue.com/property/Pages/Taxpayers_Exemptions.aspx" },
        { label: "FEMA Flood Map Service Center", url: "https://msc.fema.gov/portal/home" },
      ],
      disclaimer: "Costs vary by property and use. Request quotes and consult your insurance agent and CPA.",
    },
  ];
}

export function getGuide(slug: string) {
  return getGuides().find((g) => g.slug === slug);
}
