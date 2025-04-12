import { Button } from '../button';

const BLPWatermarkBanner = () => {
  return (
    <div className="bg-primary fixed top-0 left-0 z-50 flex w-full items-center justify-center py-3 text-center text-white">
      <img src="/dibs-logo-white.png" alt="Logo" className="mr-2 h-6 w-6" />
      <p className="ml-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        <a href="https://usedibs.com" className="text-white">
          <strong>Powered by Dibs</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline size-1 fill-current"
            aria-hidden="true"
          >
            <circle cx="1" cy="1" r="1" />
          </svg>
          Build your own booking page.{' '}
          <strong className="font-semibold">&#8594;</strong>
        </a>
      </p>
    </div>
  );
};

export default BLPWatermarkBanner;
