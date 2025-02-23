import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl">
      <div className="relative grid items-center gap-8 rounded-2xl bg-gradient-to-br from-violet-400/10 to-blue-400/10 p-8 shadow-lg ring-1 ring-violet-400/20 sm:grid-cols-6">
        <div className="relative sm:col-span-2">
          <div className="absolute -left-[8px] top-1 h-5 w-[3px] rounded-r-sm bg-violet-500" />
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
            <Button
              asChild
              className="text-md bg-gradient-to-br from-violet-400 to-blue-400 hover:shadow-lg hover:shadow-violet-500/20"
            >
              <Link href="/app">Start now</Link>
            </Button>
          </div>
        </div>
        <div className="relative isolate rounded-xl sm:col-span-4 sm:h-full">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-400/20 to-blue-400/20 blur-2xl" />
          <Image
            alt="Voice Journaling"
            src="/images/farm-footer.webp"
            height={1000}
            width={1000}
            className="relative z-10 rounded-2xl shadow-xl ring-1 ring-violet-400/20"
          />
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
