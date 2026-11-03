import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const title = 'Radovan Ivanović - Full-Stack Developer';
const description =
  'Full-stack JavaScript developer. A portfolio you play like a game of chess - make your move.';

// Absolute base for og:image etc. — link previews need full URLs.
// Override with SITE_URL (e.g. for staging) at build time.
const siteUrl = process.env.SITE_URL || 'https://radovanrasha.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Radovan Ivanović',
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
