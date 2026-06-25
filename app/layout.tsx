import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoQuest SG - Carbon-Aware Commute Planner for Singapore",
  description:
    "Plan your commute by carbon emissions. Compare MRT, Bus, Walk, and Car routes with real-time data from LTA and OneMap.",
  keywords: [
    "carbon",
    "emissions",
    "commute",
    "singapore",
    "eco-friendly",
    "MRT",
    "bus",
    "green route",
    "sustainability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Courier+Prime&display=swap"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
