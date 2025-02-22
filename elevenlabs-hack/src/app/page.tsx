import CallToAction from "./landing/components/ui/CallToAction";
import FeatureDivider from "./landing/components/ui/FeatureDivider";
import Features from "./landing/components/ui/Features";

import { Hero } from "./landing/components/ui/Hero";
import { Map } from "./landing/components/ui/Map/Map";
import { SolarAnalytics } from "./landing/components/ui/SolarAnalytics";
import Testimonial from "./landing/components/ui/Testimonial";

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col">
      <div className="pt-56">
        <Hero />
      </div>
      <div className="mt-52 px-4 xl:px-0">
        <Features />
      </div>
      <div className="mt-32 px-4 xl:px-0">
        <Testimonial />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="px-4 xl:px-0">
        <Map />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="mb-40 mt-12 px-4 xl:px-0">
        <SolarAnalytics />
      </div>
      <div className="mb-40 mt-10 px-4 xl:px-0">
        <CallToAction />
      </div>
    </main>
  );
}
