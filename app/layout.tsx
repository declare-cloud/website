import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Tailwind + Bun + Next.js App',
  description: 'Using App Router and Tailwind with Bun.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">{children}</body>
    </html>
  );
}
