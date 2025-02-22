import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl">
      <div className="grid items-center gap-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <h2
            id="cta-title"
            className="scroll-my-60 text-balance text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl"
          >
            Start your journey of self-discovery
          </h2>
          <p className="mb-8 mt-3 text-lg text-gray-600">
            Begin your personal growth journey today with AI-powered voice
            journalling, or talk to our experts about how it can help you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="text-md">
              <Link href="#">Start now</Link>
            </Button>
          </div>
        </div>
        <div className="relative isolate rounded-xl sm:col-span-4 sm:h-full">
          <Image
            aria-hidden
            alt="Farm with vehicles"
            src="/images/farm-footer.webp"
            height={1000}
            width={1000}
            className="absolute inset-0 -z-10 rounded-2xl blur-xl"
          />
          <Image
            alt="Farm with vehicles"
            src="/images/farm-footer.webp"
            height={1000}
            width={1000}
            className="relative z-10 rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
