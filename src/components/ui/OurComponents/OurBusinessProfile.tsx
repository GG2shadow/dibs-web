import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

interface OurBusinessProfileProps {
  brand?: string;
  bio?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
  };
  socials?: {
    platform: string;
    url: string;
    handle: string;
    icon: React.ReactNode;
  }[];
  phone?: string;
  email?: string;
}

const OurBusinessProfile = ({
  brand = 'Frites',
  bio = 'Beefy goodness & crispy potato perfection.',
  logo = {
    url: 'https://www.shadcnblocks.com',
    src: 'https://shadcnblocks.com/images/block/block-1.svg',
    alt: 'logo',
  },
  socials = [],
  phone = '+65 8716 9250',
  email = 'contact@kaydens-escape.com',
}: OurBusinessProfileProps) => {
  return (
    <section className="pt-16">
      <div className="flex flex-col gap-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <a href={logo.url}>
              <img src={logo.src} alt={logo.alt} className="h-10 w-auto" />
            </a>
            <p className="text-2xl font-bold">{brand}</p>
          </div>
          <p className="text-muted-foreground mt-2">{bio}</p>
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {social.icon}
                  <span className="text-sm">{social.handle}</span>
                </a>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-6">
            <a
              href={`tel:${phone}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <FaPhoneAlt className="h-4 w-4" />
              <span className="text-sm">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <IoMdMail className="h-4 w-4" />
              <span className="text-sm">{email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { OurBusinessProfile };
