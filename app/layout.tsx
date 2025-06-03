// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'declare-cloud/website',
  description: 'A Next.js app running on Bun!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  );
}
