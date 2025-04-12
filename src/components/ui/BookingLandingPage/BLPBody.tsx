import { GoShare } from 'react-icons/go';
import { IoLogoTiktok, IoCall } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { PiInstagramLogoFill } from 'react-icons/pi';

import BLPListings from './BLPListings';

const Timeline3 = () => {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="relative grid gap-16 md:grid-cols-2">
          <div className="top-40 h-fit md:sticky">
            <h2 className="text-dibs-red font-heading mt-4 mb-6 text-xl font-semibold md:text-3xl">
              <img
                src="/dibs-logo-red.png"
                alt="Logo"
                className="mr-2 inline-block h-8"
              />
              Dibs
            </h2>
            <p className="font-medium text-black md:text-xl">
              Literally the fastest way to build your booking portal. Book a
              call with us to get started.
            </p>
            <div className="text-muted-foreground mt-6 flex items-center text-sm">
              <span>Share</span>
              <GoShare className="ml-2 h-4 w-4" />
            </div>

            <div className="mt-6 space-y-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <IoCall className="mr-2 h-4 w-4" />
                <span>+65 1234 5678</span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <MdEmail className="mr-2 h-4 w-4" />
                <span>contact@example.com</span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <PiInstagramLogoFill className="mr-2 h-4 w-4" />
                <span>@example</span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <IoLogoTiktok className="mr-2 h-4 w-4" />
                <span>@example</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 md:gap-20">
            <BLPListings />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline3;
