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
      name: "Green-Cart",
      state: "Built",
      kind: "MERN e-commerce",
      blurb: "Full-stack e-commerce app built with the MERN stack.",
      tags: ["MongoDB", "Express", "React", "Node.js"],
    },
    {
      name: "Voice-to-Note",
      state: "Built",
      kind: "AI app",
      blurb: "Speak and get notes: Whisper transcribes, GPT cleans it up.",
      tags: ["OpenAI Whisper", "GPT", "React"],
    },
    {
      name: "Restaurant Review Platform",
      state: "In build",
      kind: "Backend + NLP",
      blurb: "FastAPI and PostgreSQL backend with Redis rankings and sentiment analysis.",
      tags: ["FastAPI", "PostgreSQL", "Redis", "NLP"],
    },
    {
      name: "ShipSprint",
      state: "Building",
      kind: "CLI tool · with Zain Zahid",
      blurb: "CLI that scaffolds MERN projects. I built the React frontend scaffold.",
      tags: ["Node.js", "CLI", "MERN"],
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
    linkedin: "https://www.linkedin.com/in/fizanoor11",
    instagram: "https://www.instagram.com/thestacklog",
  },
};

export type Site = typeof site;
