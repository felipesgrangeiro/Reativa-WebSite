import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://lp.reativamais.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reativa+ | Ainda dá tempo",
    template: "%s · Reativa+",
  },
  description:
    "O Reativa+ identifica quem ainda está na janela de recuperação, quanto isso vale e por quem começar. Inteligência de receita para clínicas.",
  applicationName: "Reativa+",
  authors: [{ name: "Reativa+" }],
  creator: "Reativa+",
  publisher: "Reativa+",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
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
