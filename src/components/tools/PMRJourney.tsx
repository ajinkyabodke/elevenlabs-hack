"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { celebrate, cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "hands",
    name: "Hands & Arms",
    duration: 5 * 60,
    color: "bg-emerald-500",
    instruction:
      "Tighten your fists and flex your arms for 5 seconds, then release and feel the tension flow away",
  },
  {
    id: "shoulders",
    name: "Shoulders & Neck",
    duration: 4 * 60,
    color: "bg-emerald-500",
    instruction:
      "Raise your shoulders to your ears, hold for 5 seconds, then let them drop and relax",
  },
  {
    id: "face",
    name: "Face & Head",
    duration: 4 * 60,
    color: "bg-emerald-500",
    instruction:
      "Scrunch your face tight, hold for 5 seconds, then let your face become soft and relaxed",
  },
  {
    id: "chest",
    name: "Chest & Back",
    duration: 5 * 60,
    color: "bg-emerald-500",
    instruction:
      "Take a deep breath, arch your back slightly, hold for 5 seconds, then exhale and relax",
  },
  {
    id: "abdomen",
    name: "Abdomen",
    duration: 4 * 60,
    color: "bg-emerald-500",
    instruction:
      "Tighten your stomach muscles, hold for 5 seconds, then release and feel the relaxation",
  },
  {
    id: "legs",
    name: "Legs",
    duration: 5 * 60,
    color: "bg-emerald-500",
    instruction:
      "Point your toes up, tighten your legs, hold for 5 seconds, then let them relax completely",
  },
  {
    id: "full",
    name: "Full Body Integration",
    duration: 3 * 60,
    color: "bg-emerald-500",
    instruction:
      "Tighten your entire body, hold for 5 seconds, then let everything relax at once",
  },
] as const;

export function PMRJourney() {
  const [stage, setStage] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(STAGES[0].duration);

  // Ensure stage is within bounds
  const safeStage = Math.min(Math.max(stage, 0), STAGES.length - 1);
  const currentStage = STAGES[safeStage]!;

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(currentStage.duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 0) {
          if (safeStage < STAGES.length - 1) {
            setStage(safeStage + 1);
            return STAGES[safeStage + 1]!.duration;
          } else {
            setIsActive(false);
            celebrate();
            setTimeout(() => setStage(0), 2000);
            return 0;
          }
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, safeStage, currentStage.duration, setStage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    ((currentStage.duration - timeLeft) / currentStage.duration) * 100;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-emerald-900">
          Progressive Muscle Relaxation
        </h2>
        <p className="text-emerald-600">
          Systematically relax your body by tensing and releasing each muscle
          group
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-emerald-800">
            {currentStage.name}
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="rounded-lg border-2 border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
          {currentStage.instruction}
        </div>

        <Progress
          value={progress}
          className="h-2 bg-emerald-100 [&>div]:bg-emerald-500"
        />

        <div className="grid grid-cols-7 gap-2">
          {STAGES.map((s, index) => (
            <div
              key={s.id}
              className={cn(
                "h-2 rounded transition-all",
                index === safeStage ? "bg-emerald-500" : "bg-emerald-100",
                index < safeStage && "bg-emerald-300",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "destructive" : "default"}
          className="w-32"
        >
          {isActive ? "Pause" : "Start"}
        </Button>
      </div>
    </div>
  );
}
