"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { celebrate, cn } from "@/lib/utils";
import { useState } from "react";

const QUESTS = {
  micro: [
    { id: "window", name: "Look out a window", xp: 5, energy: 2 },
    { id: "water", name: "Drink water", xp: 5, energy: 1 },
    { id: "breathing", name: "Deep breathing", xp: 5, energy: 2 },
    { id: "stretch", name: "Quick stretch", xp: 5, energy: 3 },
  ],
  short: [
    { id: "walk", name: "Take a short walk", xp: 15, energy: 5 },
    { id: "music", name: "Listen to music", xp: 10, energy: 3 },
    { id: "hygiene", name: "Basic hygiene", xp: 10, energy: 4 },
    { id: "clean", name: "Quick cleaning", xp: 15, energy: 6 },
  ],
  main: [
    { id: "exercise", name: "Exercise session", xp: 30, energy: 10 },
    { id: "social", name: "Social interaction", xp: 25, energy: 8 },
    { id: "creative", name: "Creative project", xp: 25, energy: 7 },
    { id: "learning", name: "Learning activity", xp: 30, energy: 9 },
  ],
} as const;

type QuestCategory = keyof typeof QUESTS;
type Quest = (typeof QUESTS)[QuestCategory][number];

const LEVEL_THRESHOLD = 100;

export function BehavioralQuest() {
  const [progress, setProgress] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);

  const level = Math.floor(progress / LEVEL_THRESHOLD) + 1;
  const currentLevelProgress = progress % LEVEL_THRESHOLD;

  const completeQuest = (quest: Quest) => {
    if (energy >= quest.energy) {
      const newProgress = progress + quest.xp;
      const newLevel = Math.floor(newProgress / LEVEL_THRESHOLD) + 1;
      const currentLevel = Math.floor(progress / LEVEL_THRESHOLD) + 1;

      if (newLevel > currentLevel) {
        celebrate();
      }

      setProgress(newProgress);
      setEnergy(Math.max(0, energy - quest.energy));
    }
  };

  const QuestList = ({
    category,
    title,
  }: {
    category: QuestCategory;
    title: string;
  }) => (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-purple-800">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {QUESTS[category].map((quest) => (
          <Button
            key={quest.id}
            variant="outline"
            className={cn(
              "flex h-auto flex-col items-center justify-center py-4",
              energy < quest.energy && "opacity-50",
            )}
            disabled={energy < quest.energy}
            onClick={() => completeQuest(quest)}
          >
            <span className="text-sm font-medium">{quest.name}</span>
            <div className="mt-1 flex gap-2 text-xs text-purple-600">
              <span>XP: {quest.xp}</span>
              <span>Energy: {quest.energy}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-purple-900">
          Behavioral Activation
        </h2>
        <p className="text-purple-600">
          Complete quests to gain XP and level up
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium text-purple-800">
            Level {level}
          </div>
          <div className="text-purple-600">Energy: {energy}</div>
        </div>

        <div className="space-y-1">
          <Progress
            value={(currentLevelProgress / LEVEL_THRESHOLD) * 100}
            className="h-2 bg-purple-100 [&>div]:bg-purple-500"
          />
          <div className="text-right text-sm text-purple-600">
            {currentLevelProgress} / {LEVEL_THRESHOLD} XP
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <QuestList category="micro" title="Micro Quests (5 mins)" />
        <QuestList category="short" title="Short Quests (15-30 mins)" />
        <QuestList category="main" title="Main Quests (30+ mins)" />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setEnergy(Math.min(100, energy + 10))}
          className="w-48"
          variant="outline"
        >
          Rest (+10 Energy)
        </Button>
      </div>
    </div>
  );
}
