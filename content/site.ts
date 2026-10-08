// Edit your content here. Everything on the page and in the terminal reads from this file.

export type Project = {
  name: string;
  state: string;
  kind: string;
  blurb: string;
  tags: string[];
};

export const site = {
  user: "fiza",
  host: "fn",
  name: "Fiza Noor",
  role: "Software engineering student · Backend & AI/ML · Karachi, Pakistan",
  lede: "I build backends, AI-powered features and the products around them. Third-year SE student at MAJU, working toward applied AI/ML engineering.",
  projects: [
    {
      name: "MystryFeedback",
      state: "Live",
      kind: "Full-stack web app",
      blurb: "Anonymous messaging platform with a complete auth flow: sign-up, email verification, sessions and protected routes. AI-suggested messages stream in through the Vercel AI SDK.",
      tags: ["Next.js", "TypeScript", "NextAuth", "Zod", "Resend", "OpenAI"],
    },
    {
      name: "Restaurant Review Platform",
      state: "In build",
      kind: "Backend + NLP",
      blurb: "Review platform with a FastAPI and PostgreSQL backend, Redis sorted sets for rankings, and NLP sentiment analysis on incoming reviews.",
      tags: ["FastAPI", "PostgreSQL", "Redis", "Sentiment analysis"],
    },
    {
      name: "ShipSprint",
      state: "Building",
      kind: "Developer tool · with Zain Zahid",
      blurb: "CLI that scaffolds production-ready MERN projects (folder structure, Express, MongoDB, JWT auth, React frontend). Co-built with Zain Zahid under Bytes Limited; I built the React frontend scaffold.",
      tags: ["Node.js", "CLI", "MERN", "npm"],
    },
    {
      name: "URL Shortener",
      state: "Shipped",
      kind: "Backend project",
      blurb: "URL shortener upgraded with a Redis cache-aside layer for fast redirects and a BullMQ background queue for async work.",
      tags: ["Node.js", "Redis", "BullMQ", "Caching"],
    },
  ] satisfies Project[],
  specs: [
    ["Backend", "Python · FastAPI · Node.js · PostgreSQL · Redis · BullMQ"],
    ["AI / ML", "LLM integration (OpenAI, Gemini) · Whisper · NLP sentiment analysis"],
    ["Frontend", "React · Next.js · TypeScript · Tailwind · Three.js"],
    ["Research", "Linux syscall tracer built on ptrace, paper in progress with faculty supervisor"],
    ["Studies", "BS Software Engineering, MAJU · CGPA 3.78 · graduating 2028"],
    ["Shares", "Learning notes and content for CS students"],
  ] as const,
  links: {
    github: "https://github.com/fiza-n",
  },
};

export type Site = typeof site;
