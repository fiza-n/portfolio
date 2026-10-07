import type { Metadata } from "next";
import { Unbounded, Instrument_Sans, IBM_Plex_Mono, VT323 } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-unbounded" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex" });
const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt323" });

export const metadata: Metadata = {
  title: "Zain Zahid · Engineering Workstation",
  description: "Full-stack engineer focused on backend systems and AI. Founder of Bytes Limited.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${instrument.variable} ${plex.variable} ${vt323.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
