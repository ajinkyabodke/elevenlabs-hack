"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { celebrate, cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const INHALE_TIME = 4000;
const HOLD_TIME = 7000;
const EXHALE_TIME = 8000;
const TOTAL_CYCLE = INHALE_TIME + HOLD_TIME + EXHALE_TIME;
const TARGET_CYCLES = 3;

type BreathPhase = "inhale" | "hold" | "exhale" | "idle";

export function BreathingExercise() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cycles, setCycles] = useState<number>(0);
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setProgress(0);
      return;
    }

    let startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycleTime = elapsed % TOTAL_CYCLE;

      // Calculate continuous progress for the entire cycle
      setProgress((cycleTime / TOTAL_CYCLE) * 100);

      // Set phase based on cycle time
      if (cycleTime < INHALE_TIME) {
        setPhase("inhale");
      } else if (cycleTime < INHALE_TIME + HOLD_TIME) {
        setPhase("hold");
      } else {
        setPhase("exhale");
      }

      if (elapsed >= TOTAL_CYCLE) {
        startTime = Date.now();
        const newCycles = cycles + 1;
        setCycles(newCycles);

        if (newCycles >= TARGET_CYCLES) {
          setIsActive(false);
          celebrate();
          setTimeout(() => setCycles(0), 2000);
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, cycles, setCycles, setIsActive]);

  return (
    <div className="space-y-16">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-blue-900">
          4-7-8 Breathing
        </h2>
        <p className="text-blue-600">
          A natural tranquilizer for the nervous system
        </p>
      </div>

      <div className="relative flex h-64 items-center justify-center">
        <div
          className={cn(
            "absolute h-64 w-64 rounded-full border-4 transition-all duration-1000",
            phase === "idle" && "scale-100 border-gray-200",
            phase === "inhale" && "scale-125 border-blue-500",
            phase === "hold" && "scale-125 border-green-500",
            phase === "exhale" && "scale-100 border-blue-500",
          )}
        />

        <div className="relative z-10 space-y-2 text-center">
          <div className="text-3xl font-bold text-blue-900">
            {phase === "idle" && "Ready"}
            {phase === "inhale" && "Inhale"}
            {phase === "hold" && "Hold"}
            {phase === "exhale" && "Exhale"}
          </div>
          <div className="text-blue-600">
            {phase === "inhale" && "4 seconds"}
            {phase === "hold" && "7 seconds"}
            {phase === "exhale" && "8 seconds"}
          </div>
        </div>

        <div className="absolute -bottom-12 w-full">
          <Progress
            value={progress}
            className={cn(
              "h-2",
              phase === "inhale" && "bg-blue-100 [&>div]:bg-blue-500",
              phase === "hold" && "bg-green-100 [&>div]:bg-green-500",
              phase === "exhale" && "bg-blue-100 [&>div]:bg-blue-500",
              phase === "idle" && "bg-gray-100 [&>div]:bg-gray-300",
            )}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        <div className="text-blue-900">
          Cycles: <span className="font-bold">{cycles}</span> / {TARGET_CYCLES}
        </div>
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "destructive" : "default"}
          className="w-32"
        >
          {isActive ? "Stop" : "Start"}
        </Button>
      </div>
    </div>
  );
}
