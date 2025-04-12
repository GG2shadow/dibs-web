import BLPBody from '@/components/ui/BookingLandingPage/BLPBody';
import BLPWatermarkBanner from '@/components/ui/BookingLandingPage/BLPWatermarkBanner';
export default function BookingLandingPage() {
  return (
    <div className="min-h-screen w-screen pt-16">
      <BLPWatermarkBanner />
      <BLPBody />
    </div>
  );
}
