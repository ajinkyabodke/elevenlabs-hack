"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { celebrate, cn } from "@/lib/utils";
import { useState } from "react";

const SENSES = [
  {
    name: "See",
    count: 5,
    color: "bg-orange-500",
    instruction: "Look around and name 5 things you can see",
    icon: "👀",
  },
  {
    name: "Touch",
    count: 4,
    color: "bg-yellow-500",
    instruction: "Find 4 things you can touch or feel",
    icon: "✋",
  },
  {
    name: "Hear",
    count: 3,
    color: "bg-green-500",
    instruction: "Listen for 3 sounds you can hear",
    icon: "👂",
  },
  {
    name: "Smell",
    count: 2,
    color: "bg-blue-500",
    instruction: "Notice 2 things you can smell",
    icon: "👃",
  },
  {
    name: "Taste",
    count: 1,
    color: "bg-purple-500",
    instruction: "Notice what you can taste right now",
    icon: "🫐",
  },
] as const;

export function GroundingExplorer() {
  const [stage, setStage] = useState<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const currentSense = SENSES[stage] ?? SENSES[0];

  const addItem = () => {
    if (items.length < currentSense.count) {
      setItems([...items, `Item ${items.length + 1}`]);

      if (items.length + 1 === currentSense.count) {
        if (stage < SENSES.length - 1) {
          setTimeout(() => {
            setStage(stage + 1);
            setItems([]);
          }, 1000);
        } else {
          celebrate();
          setTimeout(() => {
            setStage(0);
            setItems([]);
          }, 2000);
        }
      }
    }
  };

  const reset = () => {
    setStage(0);
    setItems([]);
  };

  const progress =
    (stage * 100 + (items.length / currentSense.count) * 100) / SENSES.length;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-orange-900">
          Grounding Explorer
        </h2>
        <p className="text-orange-600">
          Connect with your senses in the present moment
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentSense.icon}</span>
            <span className="text-lg font-medium text-orange-800">
              {currentSense.name}
            </span>
          </div>
          <div className="text-orange-600">
            {items.length} / {currentSense.count}
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={progress}
            className="h-2 bg-orange-100 [&>div]:bg-orange-500"
          />

          <p className="text-center text-orange-600">
            {currentSense.instruction}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {SENSES.map((sense, index) => (
            <div
              key={sense.name}
              className={cn(
                "h-2 rounded transition-all",
                index === stage ? sense.color : "bg-orange-100",
                index < stage && "bg-orange-300",
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: currentSense.count }).map((_, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={addItem}
              disabled={index < items.length}
              className={cn(
                "h-16 border-2",
                index < items.length
                  ? "border-orange-500 bg-orange-50 text-orange-900"
                  : "border-dashed border-orange-200 text-orange-400 hover:border-orange-500 hover:text-orange-500",
              )}
            >
              {index < items.length
                ? `Item ${index + 1}`
                : "Click to indicate done"}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={reset} className="w-32">
          Start Over
        </Button>
      </div>
    </div>
  );
}
