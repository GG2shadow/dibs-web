import type { Metadata } from 'next';

import '../../globals.css';
import { Footer } from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Stamp Dashboard',
  description: 'Stamp dashboard for managing stamps',
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="mt-24">{children}</main>
      <Footer />
    </>
  );
}
