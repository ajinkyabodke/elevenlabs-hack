"use client";

import { BurnEffect } from "@/components/BurnEffect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types";
import { useConversation } from "@11labs/react";
import {
  Brain,
  Flame,
  Loader2,
  Mic,
  MicOff,
  Timer,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MOOD_ICONS = [Flame, Brain, Timer] as const;
type MoodIcon = (typeof MOOD_ICONS)[number];

type Mood = {
  id: string;
  label: string;
  description: string;
  icon: MoodIcon;
  prompt: string;
};

const MOODS: Mood[] = [
  {
    id: "vent",
    label: "I need to vent",
    description: "Let it all out",
    icon: Flame,
    prompt: "I am here to listen. Tell me what is bothering you...",
  },
  {
    id: "chat",
    label: "Just chat",
    description: "Have a casual conversation",
    icon: Brain,
    prompt: "How was your day? I would love to hear about it...",
  },
  {
    id: "unwind",
    label: "Help me unwind",
    description: "Relax and reflect",
    icon: Timer,
    prompt: "Let us take a moment to relax. How are you feeling right now?",
  },
];

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
];

const GROUNDING_TECHNIQUES = [
  {
    name: "5-4-3-2-1 Technique",
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
    steps: [
      "Name 3 things you can see",
      "Name 3 things you can hear",
      "Name 3 things you can feel",
    ],
  },
];

interface Message {
  source: "user" | "ai";
  message: string;
}

interface ConversationTranscript {
  messages: Message[];
  summary?: string;
}

export function VoiceJournal() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast.success("Ready to record");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      toast.info("Recording stopped");
    },
    onMessage: async (message: Message) => {
      console.log("Received message:", message);
      setTranscript((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    onError: (error: Error) => {
      console.error("Error from ElevenLabs:", error);
      toast.error("Something went wrong with the recording");
    },
  });

  const selectedMoodData = MOODS.find((mood) => mood.id === selectedMood);

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

  const saveJournalEntry = async () => {
    try {
      console.log("Saving transcript:", transcript);
      const rawEntry = transcript.messages
        .map((msg) => `${msg.source}: ${msg.message}`)
        .join("\n");

      console.log("Formatted entry:", rawEntry);

      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawEntry }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const savedEntry = (await response.json()) as JournalEntry;
      console.log("Saved entry:", savedEntry);
      toast.success("Journal entry saved!");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      toast.error("Failed to save journal entry");
    }
  };

  const toggleRecording = async () => {
    if (conversation?.status === "connected") {
      console.log("Stopping recording...");
      await conversation.endSession();
      setIsProcessing(true);
      await saveJournalEntry();
      setTranscript({ messages: [] });
      setIsProcessing(false);
    } else {
      if (!selectedMood) {
        toast.error("Please select how you're feeling first");
        return;
      }
      try {
        console.log("Starting recording with mood:", selectedMood);
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "9O7dItLkE9z4UD6y9kwV",
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast.error("Failed to start recording");
      }
    }
  };

  const handleBurnEntry = () => {
    if (conversation?.status === "connected") {
      setIsBurning(true);
      void conversation.endSession();
    }
  };

  const handleBurnComplete = () => {
    setIsBurning(false);
    toast.success("Entry burned 🔥", {
      description: "Sometimes it helps just to let it out.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-sage-200 from-sage-50 hover:border-sage-300 relative w-full overflow-hidden bg-gradient-to-br to-white shadow-none transition-all hover:shadow-lg">
        {isBurning && <BurnEffect onComplete={handleBurnComplete} />}
        <CardHeader>
          <CardTitle className="text-sage-800 text-center">
            Voice Journal
          </CardTitle>
          <CardDescription className="text-sage-600 text-center">
            Select how you are feeling and start talking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger className="border-sage-200 text-sage-700 bg-white/50 hover:bg-white/80">
              <SelectValue placeholder="How are you feeling today?" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map((mood) => {
                const Icon = mood.icon;
                return (
                  <SelectItem
                    key={mood.id}
                    value={mood.id}
                    className="hover:bg-sage-50 flex flex-col items-start py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-sage-600 h-4 w-4" />
                      <div>
                        <div className="text-sage-800 font-medium">
                          {mood.label}
                        </div>
                        <div className="text-sage-600 text-xs">
                          {mood.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {selectedMoodData && (
            <p className="text-sage-600 text-center">
              {selectedMoodData.prompt}
            </p>
          )}

          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className={cn(
                "bg-sage-100 text-sage-700 hover:bg-sage-200 h-24 w-24 rounded-full transition-all",
                conversation?.status === "connected" &&
                  "bg-red-500 text-white hover:bg-red-600",
              )}
              onClick={toggleRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-12 w-12 animate-spin" />
              ) : conversation?.status === "connected" ? (
                <MicOff className="h-12 w-12" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
            </Button>
            <div className="text-sage-600 text-sm">
              {conversation?.status === "connected" ? (
                <>
                  Recording...{" "}
                  {conversation.isSpeaking ? "(AI speaking)" : "(Listening)"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-red-500 hover:text-red-600"
                    onClick={handleBurnEntry}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : isProcessing ? (
                "Processing..."
              ) : (
                "Click to start recording"
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-ocean-200 from-ocean-50 hover:border-ocean-300 bg-gradient-to-br to-white shadow-none transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-ocean-800">Need to calm down?</CardTitle>
            <CardDescription className="text-ocean-600">
              Try these breathing exercises and grounding techniques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-ocean-700 font-medium">
                Breathing Exercises
              </h3>
              <div className="grid gap-2">
                {BREATHING_EXERCISES.map((exercise, index) => (
                  <Sheet key={exercise.name}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-ocean-200 text-ocean-700 w-full justify-start bg-white/50 hover:bg-white/80"
                        onClick={() => startBreathing(index)}
                      >
                        <Timer className="mr-2 h-4 w-4" />
                        {exercise.name}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="text-ocean-800">
                          {exercise.name}
                        </SheetTitle>
                        <SheetDescription className="text-ocean-600">
                          {exercise.description}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-8 space-y-6">
                        {isBreathing && currentExercise === index ? (
                          <div className="text-center">
                            <div className="text-ocean-700 breathing-animation mb-4 text-4xl font-bold">
                              {exercise.steps[currentStep]}
                            </div>
                            <div className="text-ocean-600 text-2xl font-medium">
                              {timer}s
                            </div>
                          </div>
                        ) : (
                          <Button
                            className="bg-ocean-500 hover:bg-ocean-600 w-full text-white"
                            onClick={() => startBreathing(index)}
                          >
                            Start Exercise
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-ocean-700 font-medium">
                Grounding Techniques
              </h3>
              <div className="grid gap-2">
                {GROUNDING_TECHNIQUES.map((technique) => (
                  <Sheet key={technique.name}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-ocean-200 text-ocean-700 w-full justify-start bg-white/50 hover:bg-white/80"
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        {technique.name}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="text-ocean-800">
                          {technique.name}
                        </SheetTitle>
                        <SheetDescription className="text-ocean-600">
                          Take your time with each step
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-8">
                        <ol className="space-y-4">
                          {technique.steps.map((step, index) => (
                            <li
                              key={index}
                              className="text-ocean-700 flex gap-4"
                            >
                              <span className="text-ocean-800 font-medium">
                                {index + 1}.
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
