import { ReactNode } from "react";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
// @ts-ignore: Next.js processes this global stylesheet at build time.
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-dm-sans",
  weight: ["400", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-dm-mono",
  weight: ["400"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-fraunces",
  weight: ["500"],
});

export const metadata = {
  title: "VibeSkill | AI Career Practice",
  description: "A private, voice-led practice room for your next interview.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} ${fraunces.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <main className="mx-auto min-h-screen w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          {children}
        </main>
      </body>
    </html>
  );
}
