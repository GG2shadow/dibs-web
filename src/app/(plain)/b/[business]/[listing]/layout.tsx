import type { Metadata } from 'next';

import '../../../../globals.css';

export const metadata: Metadata = {
  title: 'Listing',
  description: 'The listing detail page',
};

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="mt-16">{children}</main>
    </>
  );
}
