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
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
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
      <SignedIn>
        <Card className="border-sage-200 from-sage-50 hover:border-sage-300 relative w-full overflow-hidden bg-gradient-to-br to-white shadow-none transition-all hover:shadow-lg">
          {isBurning && <BurnEffect onComplete={handleBurnComplete} />}
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>
              Select your mood and start recording your thoughts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((mood) => (
                  <SelectItem key={mood.id} value={mood.id}>
                    <div className="flex items-center gap-2">
                      {mood.icon && (
                        <mood.icon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{mood.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={
                  conversation?.status === "connected"
                    ? "destructive"
                    : "default"
                }
                onClick={toggleRecording}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : conversation?.status === "connected" ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>

              {conversation?.status === "connected" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBurnEntry}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {transcript.messages.length > 0 && (
              <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                {transcript.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "text-sm",
                      msg.source === "user"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-sage-200 from-sage-50 hover:border-sage-300 relative w-full overflow-hidden bg-gradient-to-br to-white shadow-none transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Need to calm down?</CardTitle>
            <CardDescription>Try these exercises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Breathing Exercises
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Breathing Exercises</SheetTitle>
                  <SheetDescription>
                    Choose an exercise to help you relax
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {BREATHING_EXERCISES.map((exercise, idx) => (
                    <Card key={exercise.name}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {exercise.name}
                        </CardTitle>
                        <CardDescription>
                          {exercise.description}
                        </CardDescription>
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
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Grounding Techniques
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Grounding Techniques</SheetTitle>
                  <SheetDescription>
                    Use these techniques to stay present
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {GROUNDING_TECHNIQUES.map((technique) => (
                    <Card key={technique.name}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {technique.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal space-y-2 pl-4">
                          {technique.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </SignedIn>
      <SignedOut>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Welcome to Voice Journal</CardTitle>
            <CardDescription>
              Please sign in to start journaling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </SignedOut>
    </div>
  );
}
