import {
  RiCheckLine,
  RiCodepenLine,
  RiContrast2Line,
  RiFullscreenFill,
  RiNotification2Line,
} from "@remixicon/react";
import { Orbit } from "../Orbit";
import ChipViz from "./ChipViz";

export default function Features() {
  return (
    <section
      aria-label="Voice Journal AI Features"
      id="solutions"
      className="relative mx-auto max-w-6xl scroll-my-24"
    >
      {/* Vertical Lines */}
      <div className="pointer-events-none inset-0 select-none">
        {/* Left */}
        <div
          className="absolute inset-y-0 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        {/* Right */}
        <div
          className="absolute inset-y-0 right-0 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* Middle */}
        <div
          className="absolute inset-y-0 left-1/2 -z-10 my-[-5rem] w-px"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* 25% */}
        <div
          className="absolute inset-y-0 left-1/4 -z-10 my-[-5rem] hidden w-px sm:block"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        {/* 75% */}
        <div
          className="absolute inset-y-0 left-3/4 -z-10 my-[-5rem] hidden w-px sm:block"
          style={{
            maskImage:
              "linear-gradient(transparent, white 5rem, white calc(100% - 5rem), transparent)",
          }}
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="stroke-gray-300"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-0">
        {/* Content */}
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-violet-500">
            AI-Powered Journaling
            <div className="absolute -left-[8px] top-1 h-5 w-[3px] rounded-r-sm bg-violet-500" />
          </h2>
          <p className="mt-2 text-balance text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl">
            Transform your voice into structured reflections
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Simply speak your thoughts and let our AI transform them into
            organized, searchable journal entries. Get personalized insights and
            patterns from your daily reflections.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg
            className="absolute size-full [mask-image:linear-gradient(transparent,white_10rem)]"
            // style={{
            //   maskImage:
            //     "linear-gradient(transparent, white 20rem, white calc(100% - 20rem), transparent)",
            // }}
          >
            <defs>
              <pattern
                id="diagonal-feature-pattern"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8;
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  );
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-feature-pattern)"
            />
          </svg>
          <div className="pointer-events-none h-[26rem] select-none p-10">
            <div className="relative flex flex-col items-center justify-center">
              <Orbit
                durationSeconds={40}
                radiusPx={140}
                keepUpright
                orbitingObjects={[
                  <div
                    key="obj1"
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      🌟
                    </span>
                    <div className="absolute size-10 rounded-full bg-white/10 shadow-lg ring-1 ring-black/5"></div>
                    <div
                      style={{
                        animationDelay: "1s",
                      }}
                      className="absolute size-10 animate-[ping_7s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
                    ></div>
                  </div>,

                  <div
                    key="obj2"
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      😊
                    </span>
                    <div className="absolute size-10 rounded-full bg-white/10 shadow-lg ring-1 ring-black/5"></div>

                    <div
                      style={{
                        animationDelay: "4s",
                      }}
                      className="absolute size-10 animate-[ping_7s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
                    ></div>
                  </div>,

                  <div
                    key="obj3"
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      😐
                    </span>
                    <div className="absolute size-10 rounded-full bg-white/10 shadow-lg ring-1 ring-black/5"></div>
                    <div
                      style={{
                        animationDelay: "2s",
                      }}
                      className="absolute size-10 animate-[ping_7s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
                    ></div>
                  </div>,
                  <div
                    key="obj4"
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      😃
                    </span>
                    <div className="absolute size-10 rounded-full bg-white/10 shadow-lg ring-1 ring-black/5"></div>
                    <div className="absolute -top-5 left-4">
                      <div className="flex gap-1">
                        <div className="flex items-center justify-center rounded-l-full bg-emerald-500 p-1 text-xs ring-1 ring-gray-200">
                          <RiCheckLine className="size-3 shrink-0 text-white" />
                        </div>
                        {/* <div className="rounded-r-full bg-white/50 py-0.5 pl-1 pr-1.5 text-xs ring-1 ring-gray-200">
                          Farming
                        </div> */}
                      </div>
                    </div>

                    <div
                      style={{
                        animationDelay: "6s",
                      }}
                      className="absolute size-10 animate-[ping_7s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
                    ></div>
                  </div>,
                  <div
                    key="obj5"
                    className="relative flex items-center justify-center"
                  >
                    <span className="text-sm font-medium text-gray-500">
                      🌟
                    </span>
                    <div className="absolute size-10 rounded-full bg-white/10 shadow-lg ring-1 ring-black/5"></div>
                    <div
                      style={{
                        animationDelay: "3s",
                      }}
                      className="absolute size-10 animate-[ping_7s_ease_infinite] rounded-full ring-1 ring-orange-500/50"
                    ></div>
                  </div>,
                ]}
              >
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <div className="rounded-full p-1 ring-1 ring-indigo-200">
                    <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-white shadow-[inset_0px_-15px_20px_rgba(0,0,0,0.1),0_7px_10px_0_rgba(0,0,0,0.15)] ring-1 ring-black/20">
                      <img
                        src="/EchoLogo.png"
                        alt="Echo Logo"
                        className="size-16"
                      />
                    </div>
                    <div className="bg-linear-to-t absolute inset-12 animate-[spin_8s_linear_infinite] rounded-full from-transparent via-violet-400 to-transparent blur-lg" />
                  </div>
                </div>
              </Orbit>
            </div>
          </div>
        </div>

        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-violet-500">
            Emotional Intelligence
            <div className="absolute -left-[8px] top-1 h-5 w-[3px] rounded-r-sm bg-violet-500" />
          </h2>
          <p className="mt-2 text-balance text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl">
            Understand your emotional landscape
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Our advanced AI analyzes your voice patterns and content to track
            emotional trends, provide mood insights, and help you develop
            greater self-awareness through data-driven reflection.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg className="absolute size-full">
            <defs>
              <pattern
                id="diagonal-feature-pattern"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8;
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  );
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-feature-pattern)"
            />
          </svg>
          <div className="relative h-[432px] w-[432px]">
            <svg
              id="grid"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="mask absolute size-[432px]"
            >
              <path
                className="stroke-gray-300"
                d="M48 0v432M96 0v432M144 0v432M192 0v432M240 0v432M288 0v432M336 0v432M384 0v432M0 48h432M0 96h432M0 144h432M0 192h432M0 240h432M0 288h432M0 336h432M0 384h432"
              />
            </svg>

            <div className="pointer-events-none relative h-full select-none">
              <div className="absolute left-[191.8px] top-[192px]">
                <div className="flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-indigo-200">
                  <img
                    src="/EchoLogo.png"
                    alt="Echo Logo"
                    className="h-11 w-11"
                  />
                </div>
              </div>
              <div className="absolute left-[48px] top-[144px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      90
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute left-[144px] top-[48px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      80
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute left-[240px] top-[96px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      70
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute left-[385px] top-[240px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      60
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute left-[336px] top-[337px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      50
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute left-[144px] top-[288px]">
                <div className="relative">
                  <div className="absolute inset-0 size-12 animate-pulse bg-orange-200 blur-[3px]"></div>
                  <div className="relative flex h-12 w-12 items-center justify-center bg-white shadow-sm ring-1 ring-black/15">
                    <span className="text-sm font-medium text-gray-500">
                      40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 my-auto px-2">
          <h2 className="relative text-lg font-semibold tracking-tight text-violet-500">
            Personal Growth
            <div className="absolute -left-[7px] top-1 h-5 w-[3px] rounded-r-sm bg-violet-500" />
          </h2>
          <p className="mt-2 text-balance text-3xl font-semibold tracking-tighter text-gray-900 md:text-4xl">
            Track your journey with actionable insights
          </p>
          <p className="mt-4 text-balance text-gray-700">
            Get personalized recommendations, track your progress over time, and
            discover patterns in your thoughts and behaviors. Turn your daily
            reflections into meaningful personal growth.
          </p>
        </div>
        <div className="relative col-span-2 flex items-center justify-center overflow-hidden">
          <svg
            className="absolute size-full [mask-image:linear-gradient(white_10rem,transparent)]"
            // style={{
            //   maskImage:
            //     "linear-gradient(transparent, white 20rem, white calc(100% - 20rem), transparent)",
            // }}
          >
            <defs>
              <pattern
                id="diagonal-feature-pattern"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8;
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      className="stroke-gray-200/70"
                      strokeWidth="1"
                    />
                  );
                })}
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#diagonal-feature-pattern)"
            />
          </svg>
          <div className="pointer-events-none relative flex size-full h-[26rem] select-none items-center justify-center p-10">
            <div className="relative">
              <div className="absolute left-[6rem] top-[6rem] z-20">
                <div className="relative mx-auto w-fit rounded-full bg-gray-50 p-1 shadow-md shadow-black/10 ring-1 ring-black/10">
                  <div className="bg-linear-to-b w-fit rounded-full from-white to-gray-100 p-3 shadow-[inset_0px_-2px_6px_rgba(0,0,0,0.09),0_3px_5px_0_rgba(0,0,0,0.19)] ring-1 ring-inset ring-white/50">
                    <RiNotification2Line
                      className="size-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute right-[6rem] top-[6rem] z-20">
                <div className="relative mx-auto w-fit rounded-full bg-gray-50 p-1 shadow-md shadow-black/10 ring-1 ring-black/10">
                  <div className="bg-linear-to-b w-fit rounded-full from-white to-gray-100 p-3 shadow-[inset_0px_-2px_6px_rgba(0,0,0,0.05),0_7px_10px_0_rgba(0,0,0,0.10)] ring-1 ring-inset ring-white/50">
                    <RiContrast2Line
                      className="size-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[6rem] right-[6rem] z-20">
                <div className="relative mx-auto w-fit rounded-full bg-gray-50 p-1 shadow-md shadow-black/10 ring-1 ring-black/10">
                  <div className="bg-linear-to-b w-fit rounded-full from-white to-gray-100 p-3 shadow-[inset_0px_-2px_6px_rgba(0,0,0,0.05),0_7px_10px_0_rgba(0,0,0,0.10)] ring-1 ring-inset ring-white/50">
                    <RiCodepenLine
                      className="size-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[6rem] left-[6rem] z-20">
                <div className="relative mx-auto w-fit rounded-full bg-gray-50 p-1 shadow-md shadow-black/10 ring-1 ring-black/10">
                  <div className="bg-linear-to-b w-fit rounded-full from-white to-gray-100 p-3 shadow-[inset_0px_-2px_6px_rgba(0,0,0,0.05),0_7px_10px_0_rgba(0,0,0,0.10)] ring-1 ring-inset ring-white/50">
                    <RiFullscreenFill
                      className="size-5 text-gray-900"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {[0, 45, 135, 180, 225, 315, 360].map((rotation, index) => (
                <div
                  key={rotation}
                  className="absolute origin-left overflow-hidden"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="relative">
                    <div className="bg-linear-to-r h-0.5 w-60 from-gray-300 to-transparent" />
                    <div
                      className="bg-linear-to-r absolute left-0 top-0 h-0.5 w-28 from-transparent via-orange-300 to-transparent"
                      style={{
                        animation: `gridMovingLine 5s linear infinite ${index * 1.2}s`,
                        animationFillMode: "backwards",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="absolute -translate-x-1/2 -translate-y-1/2">
                <ChipViz />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
