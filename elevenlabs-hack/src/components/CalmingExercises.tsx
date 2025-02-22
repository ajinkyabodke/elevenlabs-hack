"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brain, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const BREATHING_EXERCISES = [
  {
    name: "4-7-8 Breathing",
    description:
      "Inhale for 4, hold for 7, exhale for 8. Calms the nervous system.",
    steps: ["Inhale: 4s", "Hold: 7s", "Exhale: 8s"],
    totalTime: 19,
  },
  {
    name: "Box Breathing",
    description:
      "Equal duration for inhale, hold, exhale, and hold. Great for focus.",
    steps: ["Inhale: 4s", "Hold: 4s", "Exhale: 4s", "Hold: 4s"],
    totalTime: 16,
  },
  {
    name: "3-4-5 Breathing",
    description: "Progressive breathing for beginners. Easy to remember.",
    steps: ["Inhale: 3s", "Hold: 4s", "Exhale: 5s"],
    totalTime: 12,
  },
] as const;

const GROUNDING_TECHNIQUES = [
  {
    name: "5-4-3-2-1 Technique",
    icon: Brain,
    description: "Use your senses to ground yourself in the present moment.",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
  },
  {
    name: "3-3-3 Technique",
    icon: Timer,
    description: "A simpler grounding exercise for quick relief.",
    steps: [
      "Name 3 things you can see",
      "Name 3 things you can hear",
      "Name 3 things you can feel",
    ],
  },
] as const;

export function CalmingExercises() {
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Move to next step or finish exercise
            const nextStep = currentStep + 1;
            const currentExerciseData = BREATHING_EXERCISES[currentExercise];
            if (!currentExerciseData) return 0;

            if (nextStep < currentExerciseData.steps.length) {
              setCurrentStep(nextStep);
              return currentExerciseData.totalTime;
            } else {
              setIsBreathing(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, timer, currentStep, currentExercise]);

  const startBreathing = (exerciseIndex: number) => {
    const exercise = BREATHING_EXERCISES[exerciseIndex];
    if (!exercise) return;

    setCurrentExercise(exerciseIndex);
    setCurrentStep(0);
    setTimer(exercise.totalTime);
    setIsBreathing(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Breathing Exercises</CardTitle>
            <CardDescription>
              Take a moment to breathe and find your center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {BREATHING_EXERCISES.map((exercise, idx) => (
              <Card key={exercise.name} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">{exercise.name}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isBreathing && currentExercise === idx ? (
                    <div className="space-y-2 text-center">
                      <div className="text-2xl font-bold">
                        {exercise.steps[currentStep]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {timer}s
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => startBreathing(idx)}
                    >
                      Start Exercise
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grounding Techniques</CardTitle>
            <CardDescription>
              Use these techniques to stay present and mindful
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {GROUNDING_TECHNIQUES.map((technique) => (
              <Sheet key={technique.name}>
                <SheetTrigger asChild>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <technique.icon className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-base">
                            {technique.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {technique.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{technique.name}</SheetTitle>
                    <SheetDescription>{technique.description}</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <ol className="space-y-4">
                      {technique.steps.map((step, idx) => (
                        <li
                          key={step}
                          className="flex items-center gap-3 rounded-lg border bg-card p-4"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
