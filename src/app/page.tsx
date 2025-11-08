import { Background } from "@/components/background";
import { Features } from "@/components/blocks/features";
import { Hero } from "@/components/blocks/hero";

export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <Features />
        {/* <Logos />
     
        <ResourceAllocation /> */}
      </Background>
      {/* <Testimonials />
      <Background variant="bottom">
        <Pricing />
        <FAQ />
      </Background> */}
    </>
  );
}
