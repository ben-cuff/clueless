import { ClientProviders } from "@/components/providers/client-providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clueless",
  description: "A mock interview platform with integrated AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
