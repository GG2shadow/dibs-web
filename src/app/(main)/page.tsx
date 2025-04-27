import CreamContainer from '@/components/layout/cream-container';
import { FAQ } from '@/components/ui/faq';
import { Features } from '@/components/ui/features';
import Hero from '@/components/ui/hero';
import Logos from '@/components/ui/logos';
import { ResourceAllocation } from '@/components/ui/resource-allocation';
import { Testimonials } from '@/components/ui/testimonials';

export default function Home() {
  return (
    <>
      <CreamContainer className="via-muted to-muted/80">
        <Hero />
        <Logos />
        <Features />
        {/* <ResourceAllocation /> */}
      </CreamContainer>
      <Testimonials />
      <CreamContainer variant="bottom">
        {/* <Pricing /> */}
        <FAQ />
      </CreamContainer>
    </>
  );
}
