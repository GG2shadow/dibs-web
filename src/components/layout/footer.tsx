import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Footer() {
  const navigation = [
    { name: 'Product', href: '/#feature-modern-teams' },
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const social = [
    { name: 'Xwitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ];

  const legal = [{ name: '© 2023 - 2025 Dibs Everything Pte Ltd. All rights reserved. | UEN: 202418462H', href: '/privacy' }];

  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32 pb-20">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Book a non-obligatory call today
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug font-medium text-balance">
          <Image
            src="dibs-logo-red.png"
            alt="Dibs Logo"
            width={20}
            height={20}
            className="inline-block mr-2"
          />
          Dibs is your superapp to supercharge your business.
        </p>
        <div>
          <Button size="lg" className="mt-4 bg-dibs-red">
            Get started
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* <Image
        src="/footer.svg"
        alt="Mainline"
        width={1570}
        height={375}
        className="mt-10 md:mt-14 lg:mt-20"
      /> */}
    </footer>
  );
}
