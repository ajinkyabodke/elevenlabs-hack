"use client";

import { RecordButton } from "@/components/RecordButton";
import { ToolDialog } from "@/components/ToolDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { activeToolAtom, type ToolType } from "@/lib/atoms";
import { basePrompt } from "@/lib/basePrompt";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { JournalEntry } from "@/types";
import { useConversation } from "@11labs/react";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { BookOpen, LucideX, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Mood = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

const MOODS: Mood[] = [
  {
    id: "vent",
    label: "I need to vent",
    description: "Let it all out",
    prompt: "I am here to listen. Tell me what is bothering you...",
  },
  {
    id: "chat",
    label: "Just chat",
    description: "Have a casual conversation",
    prompt: "How was your day? I would love to hear about it...",
  },
  {
    id: "unwind",
    label: "Help me unwind",
    description: "Relax and reflect",
    prompt: "Let us take a moment to relax. How are you feeling right now?",
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

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>("chat");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef<ConversationTranscript>({
    messages: [],
  });
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });
  const { user } = useUser();
  const { data: promptAttributes, isPending } =
    api.user.getPromptAttributes.useQuery();
  const [activeTool, setActiveTool] = useAtom<ToolType | null>(activeToolAtom);
  const name = user?.firstName;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: (props: unknown) => {
      console.log("Disconnected from ElevenLabs", props);

      void saveJournalEntry();
    },
    onMessage: async (message: Message) => {
      console.log("Received message:", message);
      setTranscript((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));

      transcriptRef.current.messages.push(message);
    },
    onError: (error: Error) => {
      console.error("Error from ElevenLabs:", error);
      toast.error("Something went wrong with the recording");
    },
    clientTools: {
      start_breathing_exercise: () => {
        setActiveTool("breathing");
      },
      start_grounding_exercise: () => {
        setActiveTool("grounding");
      },
      start_behavioral_activation_quest: () => {
        setActiveTool("behavioral");
      },
      start_progressive_muscle_relaxation: () => {
        setActiveTool("pmr");
      },
      end_session: async () => {
        console.log("Stopping recording...");
        setIsRecording(false);
        setIsProcessing(true);
        await conversation.endSession();
        setTranscript({ messages: [] });
        transcriptRef.current.messages = [];
        setIsProcessing(false);
      },
    },
  });

  const selectedMoodData = MOODS.find((mood) => mood.id === selectedMood);

  const getSystemPrompt = (mood: string) => {
    const moodPrompts: Record<string, string> = {
      vent: "The user needs to vent. Create a safe and supportive space for them to express their frustrations openly. Be patient and empathetic, acknowledging their feelings without judgment. Validate their experiences by saying things like, 'It's completely understandable to feel that way.' Avoid rushing to provide solutions unless they specifically ask for advice. Allow them the freedom to share as much or as little as they wish.",

      chat: "Keep the conversation light-hearted and casual while remaining emotionally aware. Engage with the user in a friendly manner, sharing brief, relevant observations that encourage connection. Maintain a natural flow in the conversation without being overly formal or scripted. Ask open-ended questions to guide the dialogue and ensure the user feels heard and valued.",

      unwind:
        "Help the user relax and decompress by using a soothing tone and gentle pacing. Encourage them to let go of stress and tension while guiding them toward positive reflections. If appropriate, incorporate mindfulness techniques such as deep breathing or present-moment awareness. Offer prompts that invite them to focus on calming thoughts or pleasant memories, creating a peaceful atmosphere for relaxation.",
    };

    const moodData = MOODS.find((m) => m.id === mood) ?? MOODS[0];

    const contextPrompt = [
      `- User's chosen mood: ${moodData?.label}`,
      `- Session purpose: ${moodData?.description}`,
      `- Initial approach: ${moodData?.prompt}`,

      `----`,
      promptAttributes?.memory &&
        promptAttributes.memory.length > 0 &&
        `Summary of user's previous journal entries: ${promptAttributes.memory
          .map((m, idx) => `- ${idx + 1}. ${m}`)
          .join("\n")}`,

      `----`,
      promptAttributes?.details &&
        promptAttributes.details.length > 0 &&
        `User's details: ${promptAttributes.details}`,

      `User's mood scores over the last 7 days: ${promptAttributes?.moodScoresWithDays
        .map((m) => `- ${m.day}: ${m.moodScore}`)
        .join("\n")}`,

      `----`,

      `Significant events over the last 7 days in the user's life: ${promptAttributes?.significantEventsWithDays
        .map((e) => `- ${e.day}: ${e.significantEvents.join(", ")}`)
        .join("\n")}`,
    ].join("\n");

    const moodSpecificPrompt = moodPrompts[mood] ?? moodPrompts.unwind;

    return [`${basePrompt}`, `${moodSpecificPrompt}`, `${contextPrompt}`].join(
      "\n",
    );
  };

  const getFirstMessage = () => {
    return `Hi ${name}! How can I help you today?`;
  };

  const saveJournalEntry = async () => {
    try {
      console.log("Saving transcript:", transcriptRef.current);
      const rawEntry = transcriptRef.current.messages
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
      setIsRecording(false);
      setIsProcessing(true);
      await conversation.endSession();
      setTranscript({ messages: [] });
      transcriptRef.current.messages = [];
      setIsProcessing(false);
    } else {
      setIsRecording(true);
      if (!selectedMood) {
        toast.error("Please select how you're feeling first");
        return;
      }
      try {
        console.log("Starting recording with mood:", selectedMood);
        console.log("System prompt:", getSystemPrompt(selectedMood));
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "AupMfEyUGwuMVyOywI6b",
          overrides: {
            agent: {
              firstMessage: getFirstMessage(),
              prompt: {
                prompt: getSystemPrompt(selectedMood),
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast.error("Failed to start recording");
      }
    }
  };

  const handleDeleteTranscript = () => {
    setIsRecording(false);
    setIsProcessing(false);
    if (conversation?.status === "connected") {
      void conversation.endSession();
    }
    setTranscript({ messages: [] });
  };

  // Get the last two messages for the preview
  const lastTwoMessages = transcript.messages.slice(-2);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/ambient-trimmed.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {activeTool && <ToolDialog />}

      <div className="relative min-h-screen space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100/50 p-6">
        <div className="mx-auto mt-10 w-full max-w-lg">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 text-blue-500 hover:text-blue-600"
            onClick={toggleAudio}
          >
            {isPlaying ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-blue-400/70" />
            )}
          </Button>
          <div className="relative flex items-center rounded-xl bg-white/50 p-1 shadow-lg backdrop-blur-sm">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "relative z-10 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all duration-200",
                  "hover:text-blue-600",
                  selectedMood === mood.id
                    ? "text-white"
                    : "text-blue-500/70 hover:text-blue-600",
                )}
              >
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: selectedMood === mood.id ? 1.1 : 0.9,
                    opacity: selectedMood === mood.id ? 1 : 0.8,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-base">
                    {mood.id === "vent" && "😡"}
                    {mood.id === "chat" && "😄"}
                    {mood.id === "unwind" && "😌"}
                  </span>
                  <span>{mood.label}</span>
                </motion.span>
              </button>
            ))}

            <motion.div
              className="absolute inset-0 z-0"
              initial={false}
              animate={{
                x: `${(MOODS.findIndex((m) => m.id === selectedMood) * 100) / MOODS.length}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="h-full w-[calc(100%/3)] rounded-lg bg-gradient-to-r from-blue-500 to-violet-400 shadow-lg" />
            </motion.div>
          </div>
        </div>
        <div className="mt-20 h-20" />
        {selectedMoodData && (
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex w-full justify-center gap-3 text-center font-serif text-6xl text-blue-900"
          >
            <span>{selectedMoodData.description}</span>
          </motion.h4>
        )}
        <div className="-mt-4 flex items-center justify-center gap-3 text-center">
          {selectedMoodData && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 text-center text-2xl tracking-normal text-blue-600/80"
            >
              <span className="text-orange-400">✱</span>
              {selectedMoodData.prompt}
            </motion.h1>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2"
        >
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onMouseDown={toggleRecording}
            disabled={isProcessing || isPending}
          />

          {isRecording && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600"
              onClick={handleDeleteTranscript}
              disabled={isProcessing}
            >
              <LucideX className="h-4 w-4" />
            </Button>
          )}
        </motion.div>

        {lastTwoMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Full Conversation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50">
                  <DialogHeader>
                    <DialogTitle className="text-blue-900">
                      Conversation History
                    </DialogTitle>
                    <DialogDescription className="text-blue-600">
                      Full transcript of your current session
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4 p-4">
                      {transcript.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-lg p-3 shadow-sm backdrop-blur-sm",
                            msg.source === "user"
                              ? "bg-gradient-to-r from-blue-500/10 to-violet-400/5 text-blue-700"
                              : "bg-white/50 text-blue-600",
                          )}
                        >
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2 rounded-lg bg-white/50 p-4 font-serif text-blue-900 shadow-lg backdrop-blur-sm">
              {lastTwoMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-sm",
                    msg.source === "user" ? "text-blue-700" : "text-blue-600",
                  )}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
