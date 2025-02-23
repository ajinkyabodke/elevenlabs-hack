import { RiArrowRightUpLine } from "@remixicon/react";
import { FadeContainer, FadeDiv, FadeSpan } from "../Fade";
import GameOfLife from "./HeroBackground";

export function Hero() {
  return (
    <section aria-label="hero">
      <FadeContainer className="relative flex flex-col items-center justify-center">
        <FadeDiv className="mx-auto">
          <a
            aria-label="View latest update the changelog page"
            href="/app"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto w-full"
          >
            <div className="focus:outline-hidden inline-flex max-w-full items-center gap-3 rounded-full bg-white/5 px-2.5 py-0.5 pl-0.5 pr-3 font-medium text-gray-900 shadow-lg shadow-violet-400/20 ring-1 ring-black/10 filter backdrop-blur-[1px] transition-colors hover:bg-violet-500/[2.5%] sm:text-sm">
              <span className="shrink-0 truncate rounded-full border bg-gray-50 px-2.5 py-1 text-sm text-gray-600 sm:text-xs">
                News
              </span>
              <span className="flex items-center gap-1 truncate">
                <span className="w-full truncate">
                  Voice Journal Beta Launch
                </span>

                <RiArrowRightUpLine className="size-4 shrink-0 text-gray-700" />
              </span>
            </div>
          </a>
        </FadeDiv>
        <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-gray-900 sm:text-8xl sm:leading-[5.5rem]">
          <FadeSpan>Transform</FadeSpan> <FadeSpan>your</FadeSpan>
          <br />
          <FadeSpan>thoughts</FadeSpan> <FadeSpan>to</FadeSpan>{" "}
          <FadeSpan>wisdom</FadeSpan>
        </h1>
        <p className="mt-5 max-w-xl text-balance text-center text-base text-gray-700 sm:mt-8 sm:text-xl">
          <FadeSpan>Your AI-powered voice journal that turns</FadeSpan>{" "}
          <FadeSpan>daily reflections into meaningful insights</FadeSpan>{" "}
          <FadeSpan>and personal growth.</FadeSpan>
        </p>
        <FadeDiv>
          <a
            className="mt-6 inline-flex cursor-pointer flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md border-b-[1.5px] border-violet-700 bg-gradient-to-br from-violet-400 to-blue-400 px-5 py-3 font-medium leading-4 tracking-wide text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(255,255,255,0.19)] transition-all duration-200 ease-in-out hover:shadow-violet-500"
            href="/app"
          >
            Start Journaling
          </a>
        </FadeDiv>
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <GameOfLife />
        </div>
      </FadeContainer>
    </section>
  );
}
