import Image from 'next/image';
import Link from 'next/link';

import Marquee from 'react-fast-marquee';

import { cn } from '@/lib/utils';

const Logos = () => {
  const topRowCompanies = [
    {
      name: 'BMT Gym',
      logo: '/logos/bmtgym-logo.png',
      width: 60,
      height: 26,
      href: 'https://nagafitness.com/',
    },
    {
      name: 'Frites',
      logo: '/logos/frites-logo.png',
      width: 116,
      height: 31,
      href: 'https://www.instagram.com/frites.sg/',
    },
    {
      name: 'Kitalulus',
      logo: '/logos/kitalulus-logo.png',
      width: 100,
      height: 22,
      href: 'https://www.kitalulus.com/',
    },
    // {
    //   name: 'Perplexity',
    //   logo: '/logos/talentport-logo.png',
    //   width: 130,
    //   height: 32,
    //   href: 'https://perplexity.com',
    // },
  ];

  const bottomRowCompanies = [
    {
      name: 'Talentport',
      logo: '/logos/talentport-logo.png',
      width: 130,
      height: 32,
      href: 'https://www.talentport.com/',
    },
    {
      name: 'aquaDucks',
      logo: '/logos/aquaducks-logo.png',
      width: 112,
      height: 27,
      href: 'https://www.aquaducks.com.sg/',
    },
  ];

  return (
    <section className="pb-28 lg:pb-32">
      <div className="container space-y-10 lg:space-y-16">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-balance md:text-2xl lg:text-3xl">
            Powering Singapore's fastest-growing teams.
            <br className="max-md:hidden" />
            <span className="text-muted-foreground">
              From next-gen startups to established enterprises.
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-8">
          {/* Top row - 3 logos */}
          <LogoRow companies={topRowCompanies} gridClassName="grid-cols-3" />

          {/* Bottom row - 2 logos */}
          <LogoRow
            companies={bottomRowCompanies}
            gridClassName="grid-cols-2"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
};

export default Logos;

type Company = {
  name: string;
  logo: string;
  width: number;
  height: number;
  href: string;
};

type LogoRowProps = {
  companies: Company[];
  gridClassName: string;
  direction?: 'left' | 'right';
};
const LogoRow = ({ companies, gridClassName, direction }: LogoRowProps) => {
  return (
    <>
      {/* Desktop static version */}
      <div className="hidden md:block">
        <div
          className={cn(
            'grid items-center justify-items-center gap-x-20 lg:gap-x-28',
            gridClassName,
          )}
        >
          {companies.map((company, index) => (
            <Link href={company.href} target="_blank" key={index}>
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.width}
                height={company.height}
                className="object-contain grayscale transition-opacity hover:opacity-70"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile marquee version */}
      <div className="md:hidden">
        <Marquee direction={direction} pauseOnHover>
          {companies.map((company, index) => (
            <Link
              href={company.href}
              target="_blank"
              key={index}
              className="mx-8 inline-block transition-opacity hover:opacity-70"
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.width}
                height={company.height}
                className="object-contain grayscale"
              />
            </Link>
          ))}
        </Marquee>
      </div>
    </>
  );
};
