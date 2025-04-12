import type { Metadata } from 'next';

import '../../globals.css';
import { Footer } from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Booking Dashboard',
  description: 'Booking dashboard for managing bookings',
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </>
  );
}
