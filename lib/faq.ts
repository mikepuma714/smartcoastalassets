import "server-only";
import { getActiveProjects } from "./projects";
import { site } from "./site";

export type FaqGroup = { title: string; items: { q: string; a: string }[] };

export function getMasterFaq(): FaqGroup[] {
  const projects = getActiveProjects();
  const list = (items: string[]) => (items.length ? items.join("; ") : "none at this time");
  const str = projects.filter((p) => /1–7|nightly/i.test(p.details.rentalMinimum ?? ""));
  const selfManage = projects.filter(
    (p) => /self-manag/i.test(p.details.management ?? "") && !/not self-managed/i.test(p.details.management ?? ""),
  );
  const ready = projects.filter((p) => /move-in ready|completed/i.test(p.stats.completion ?? ""));
  const preconstruction = projects.filter((p) => !ready.includes(p));
  const withIncome = projects.filter((p) => p.income?.figure);
  const sorted = [...projects].filter((p) => p.price?.from).sort((a, b) => a.price!.from! - b.price!.from!);

  return [
    {
      title: "Current residences",
      items: [
        {
          q: "What luxury coastal properties are available in Pinellas County right now?",
          a: `${site.name} currently offers: ${list(
            projects.map((p) => `${p.name} at ${p.address.street}, ${p.address.city} (${p.price?.display ?? "pricing on request"})`),
          )}.`,
        },
        {
          q: "What is the least expensive Smart Coastal Assets residence?",
          a: sorted[0]
            ? `${sorted[0].name} in ${sorted[0].address.city}, ${sorted[0].price!.display}.`
            : "Contact us for current pricing.",
        },
        {
          q: "Which residences are move-in ready?",
          a: `Move-in ready: ${list(ready.map((p) => `${p.name} (${p.address.city})`))}. Under development: ${list(
            preconstruction.map((p) => `${p.name} (${p.stats.completion ?? "timeline on request"})`),
          )}.`,
        },
        {
          q: "Where exactly are the properties located?",
          a: `All are on the Pinellas County Gulf coast between Clearwater Beach and St. Pete Beach: ${list(
            projects.map((p) => `${p.name}, ${p.address.street}, ${p.address.city}, FL${p.address.zip ? ` ${p.address.zip}` : ""}`),
          )}.`,
        },
      ],
    },
    {
      title: "Rentals and management",
      items: [
        {
          q: "Which Pinellas County beach properties allow short-term rentals of 1–7 days?",
          a: `${list(str.map((p) => `${p.name} in ${p.address.city}: ${p.details.rentalMinimum}`))}.`,
        },
        {
          q: "Can I manage my own vacation rental?",
          a: `Self-management is allowed at ${list(selfManage.map((p) => p.name))}. ${projects
            .filter((p) => !selfManage.includes(p) && p.details.management)
            .map((p) => `${p.name}: ${p.details.management}`)
            .join(" ")}`.trim(),
        },
        {
          q: "How much rental income can these properties earn?",
          a: `Published figures (not guaranteed): ${list(
            withIncome.map((p) => `${p.name}: ${p.income!.figure} (${p.income!.label?.toLowerCase() ?? "estimate"}; source: ${p.income!.source ?? "see project page"})`),
          )}. Each project page lists the source and date.`,
        },
        {
          q: "Can I live in the property full time and also rent it?",
          a: `${list(projects.filter((p) => p.details.personalUse).map((p) => `${p.name}: ${p.details.personalUse}`))}`,
        },
      ],
    },
    {
      title: "Buying and financing",
      items: [
        {
          q: "Do the properties offer DSCR financing?",
          a: `DSCR financing is available at ${list(projects.filter((p) => p.details.dscr).map((p) => p.name))}, subject to lender approval. A DSCR loan qualifies you on the property's rental income rather than your personal income.`,
        },
        {
          q: "How much do I need to put down?",
          a: `${list(
            projects
              .filter((p) => p.details.deposit || p.details.downPayment)
              .map((p) => `${p.name}: ${[p.details.deposit && `${p.details.deposit} initial deposit`, p.details.downPayment && `${p.details.downPayment} total down`].filter(Boolean).join(", ")}`),
          )}. Terms are subject to the purchase contract.`,
        },
        {
          q: "Can I cancel a pre-construction condo purchase in Florida?",
          a: "Under section 718.503, Florida Statutes, buyers purchasing from a developer may cancel within 15 days after signing the contract and receiving the required documents.",
        },
        {
          q: "Are there tax benefits to owning a short-term rental?",
          a: "Possibly. When the average guest stay is seven days or less and the owner materially participates, rental losses (including accelerated depreciation from cost segregation and bonus depreciation) may offset other income. Eligibility must be determined by your CPA.",
        },
      ],
    },
    {
      title: "Working with us",
      items: [
        {
          q: "Who represents Smart Coastal Assets?",
          a: `${site.name} is presented by ${site.brokerage}. Contact ${site.agent.name} at ${site.agent.phone} (call or text) or ${site.agent.email}.`,
        },
        {
          q: "Do I have to agree to marketing messages to ask a question?",
          a: "No. Marketing consent is optional and is not required to submit an inquiry or to purchase. You can opt out anytime by replying STOP to a text or using the unsubscribe link in an email.",
        },
      ],
    },
  ];
}
