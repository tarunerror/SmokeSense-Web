import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import BottomNav from '@/components/ui/BottomNav';

const inter = Inter({ subsets: ['latin'] });



export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export const metadata: Metadata = {
  title: 'SmokeSense - Your Journey, Your Pace',
  description: 'A supportive companion for understanding and managing your smoking habits. No judgment, no pressure.',
  keywords: ['smoking', 'awareness', 'tracking', 'health', 'wellness', 'habits'],
  authors: [{ name: 'SmokeSense' }],
  openGraph: {
    title: 'SmokeSense',
    description: 'Understand and control your smoking habits at your own pace',
    type: 'website',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

import ThemeProvider from '@/components/providers/ThemeProvider';
import { DisguiseProvider } from '@/components/providers/DisguiseProvider';

// ... imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalWebPage',
              name: 'SmokeSense',
              description: 'A dedicated tool to help you track smoking habits, understand triggers, and reduce consumption at your own pace.',
              medicalAudience: 'Smokers looking to quit or reduce',
              aspect: 'Health monitoring and behavior change',
              hostInstitution: {
                '@type': 'Organization',
                name: 'SmokeSense',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <DisguiseProvider>
            {children}
            <BottomNav />
          </DisguiseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
