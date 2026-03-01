import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FellowShift",
  description: "Blind typing language learning with cozy vibes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-hobbit-bg font-serif text-hobbit-ink h-[100dvh] min-h-[100dvh] flex flex-col overflow-hidden bg-parchment-texture selection:bg-hobbit-moss selection:text-white">
        {children}
      </body>
    </html>
  );
}
