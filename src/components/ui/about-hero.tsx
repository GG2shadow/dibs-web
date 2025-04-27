import { DashedLine } from '@/components/dashed-line';

const stats = [
  {
    value: '10+',
    label: 'Partners',
  },
  {
    value: '20K',
    label: 'Companies',
  },
  {
    value: '1.3B',
    label: 'Monthly transactions',
  },
  {
    value: '1.5K',
    label: 'Connections per minute',
  },
];

export function AboutHero() {
  return (
    <section className="">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Democratising quality software
          </h1>

          <p className="text-muted-foreground mt-5 font-sans text-2xl font-medium md:text-3xl lg:text-4xl">
            Dibs is bringing tools critical to business growth to businesses of all sizes.
          </p>

          <p className="text-muted-foreground mt-8 hidden max-w-lg space-y-6 text-lg font-medium text-balance md:block lg:mt-12">
            At Dibs, we're on a mission to make the best software available to
            businesses of all sizes. We're building a platform that connects
            businesses with the best software, so that you can focus on what
            matters most: growing your business.
            <br />
            <br />
            We're customer-obsessed — investing the time to understand every
            aspect of your workflow so that we can help you operate better than
            ever before. We're all in this together because your success is our
            success. In our history as a company, we've never lost a customer,
            because when your projects succeed, so do we.
          </p>
        </div>

        <div
          className={`relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:ps-10 lg:pt-0`}
        >
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-sans text-4xl font-medium tracking-wide md:text-5xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
