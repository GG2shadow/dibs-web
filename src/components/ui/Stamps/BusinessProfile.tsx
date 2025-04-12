interface BusinessProfileProps {
  heading?: string;
  subheading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
  };
}

const BusinessProfile = ({
  heading = 'Frites',
  subheading = 'Beefy goodness & crispy potato perfection.',
  logo = {
    url: 'https://www.shadcnblocks.com',
    src: 'https://shadcnblocks.com/images/block/block-1.svg',
    alt: 'logo',
  },
}: BusinessProfileProps) => {
  return (
    <section className="pt-16">
      <div className="flex flex-col gap-4">
        <div className="mb-6 flex flex-col items-center">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="mb-7 h-10 w-auto" />
          </a>
          <p className="mb-2 text-2xl font-bold">{heading}</p>
          <p className="text-muted-foreground">{subheading}</p>
        </div>
      </div>
    </section>
  );
};

export { BusinessProfile };
