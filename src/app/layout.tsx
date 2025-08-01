import Navbar from '@/components/navigation/navbar';
import { ClientProviders } from '@/components/providers/client-providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clueless',
  description: 'A mock interview platform with integrated AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Analytics />
        <SpeedInsights />
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
