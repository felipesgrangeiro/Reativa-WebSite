import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reativa+ | Ainda dá tempo",
  description: "Um diagnóstico para identificar onde ainda existe oportunidade de agir.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
