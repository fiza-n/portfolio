import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Specs } from "@/components/Specs";
import { KeyboardDeck } from "@/components/KeyboardDeck";

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="top">
        <Hero />
        <Projects />
        <Specs />
      </main>
      <KeyboardDeck />
    </>
  );
}
