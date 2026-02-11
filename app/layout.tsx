import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abricot",
  description: "SaaS gestion de projet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
