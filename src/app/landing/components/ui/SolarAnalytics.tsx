import {
  RiBarChartFill,
  RiEmotionHappyFill,
  RiMicFill,
  RiPsychotherapyFill,
} from "@remixicon/react";
import { Divider } from "../Divider";
import AnalyticsIllustration from "./AnalyticsIllustration";
import { StickerCard } from "./StickerCard";

export function JournalAnalytics() {
  return (
    <section
      aria-labelledby="journal-analytics"
      className="relative mx-auto w-full max-w-6xl overflow-hidden"
    >
      <div>
        <h2
          id="journal-analytics"
          className="relative scroll-my-24 text-lg font-semibold tracking-tight text-orange-500"
        >
          Journal Analytics
          <div className="absolute -left-[8px] top-1 h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 max-w-lg text-balance text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl">
          Transform your voice journals into meaningful insights
        </p>
      </div>
      <div className="*:pointer-events-none">
        <AnalyticsIllustration />
      </div>
      <Divider className="mt-0"></Divider>
      <div className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-4 md:grid-rows-1">
        <StickerCard
          Icon={RiMicFill}
          title="Voice Recognition"
          description="Advanced AI that accurately transcribes and understands your spoken thoughts."
        />
        <StickerCard
          Icon={RiEmotionHappyFill}
          title="Emotion Analysis"
          description="Real-time analysis of emotional patterns in your voice and content."
        />
        <StickerCard
          Icon={RiPsychotherapyFill}
          title="Personal Insights"
          description="AI-powered insights that help you understand your thought patterns."
        />
        <StickerCard
          Icon={RiBarChartFill}
          title="Progress Tracking"
          description="Detailed analytics showing your personal growth journey over time."
        />
      </div>
    </section>
  );
}
