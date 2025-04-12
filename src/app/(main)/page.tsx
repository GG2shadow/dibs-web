import CreamContainer from '@/components/layout/cream-container';
import { FAQ } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import { ResourceAllocation } from '@/components/sections/resource-allocation';
import { Testimonials } from '@/components/sections/testimonials';

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
