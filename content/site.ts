// Edit your content here. Everything on the page and in the terminal reads from this file.

export type Project = {
  name: string;
  state: string;
  kind: string;
  blurb: string;
  tags: string[];
};

export const site = {
  user: "zain",
  host: "bytes",
  name: "Zain Zahid",
  role: "Full-stack engineer · Backend & AI · Pakistan",
  lede: "I build backends, AI workflows and the products on top of them. At Bytes Limited we make our own software for businesses across Pakistan.",
  projects: [
    {
      name: "Parcelo",
      state: "In build",
      kind: "Standalone product",
      blurb: "Order management for online sellers who ship cash on delivery: track every parcel from booking to cash collected.",
      tags: ["Supabase", "Postgres", "Order pipeline", "COD reconciliation"],
    },
    {
      name: "Distributor Suite",
      state: "Shipped",
      kind: "Bytes Limited product",
      blurb: "Management software built for Pakistani distributors: orders, stock and payments in one system instead of registers and spreadsheets.",
      tags: ["Backend", "Inventory", "Multi-user", "Supabase"],
    },
    {
      name: "Pakistani Apps, Explained",
      state: "Airing",
      kind: "System design series",
      blurb: "Video breakdowns of how local apps work under the hood. Episode one: how Foodpanda estimates delivery time.",
      tags: ["System design", "YouTube", "LinkedIn", "Instagram"],
    },
    {
      name: "Preloved Marketplace",
      state: "Planning",
      kind: "Next product",
      blurb: "A marketplace only for thrift and preloved sellers, with search, listings and payouts built for second-hand stock.",
      tags: ["Marketplace", "Search", "Payments"],
    },
  ] satisfies Project[],
  specs: [
    ["Backend", "Node.js · PostgreSQL · Supabase · REST APIs · background jobs"],
    ["AI / ML", "LLM integration · retrieval & embeddings · Claude Code workflows"],
    ["Frontend", "React · Next.js · Three.js · Tailwind"],
    ["Infra", "Supabase · Vercel · Docker"],
    ["Ships", "Own products under Bytes Limited"],
    ["Teaches", "System-design breakdowns as Code With Zain"],
  ] as const,
  links: {
    linkedin: "https://www.linkedin.com/in/zain-zahid-638349291",
    instagram: "https://www.instagram.com/zainzahid.dev",
  },
};

export type Site = typeof site;
