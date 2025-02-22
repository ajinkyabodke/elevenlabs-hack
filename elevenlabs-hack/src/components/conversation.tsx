"use client";

import { Button } from "@/components/ui/button";
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react";
import { useCallback } from "react";
import { cn } from "tailwind-variants";
interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: Message) => console.log("Message:", message),
    onError: (error: Error) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "9O7dItLkE9z4UD6y9kwV", // Replace with your agent ID
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          variant="default"
          size="lg"
          className={cn(
            "transition-all duration-200",
            conversation.status === "connected" && "opacity-50",
          )}
        >
          <Mic className="mr-2 h-5 w-5" />
          Start Recording
        </Button>
        <Button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          variant="destructive"
          size="lg"
          className={cn(
            "transition-all duration-200",
            conversation.status !== "connected" && "opacity-50",
          )}
        >
          <MicOff className="mr-2 h-5 w-5" />
          Stop Recording
        </Button>
      </div>

      <div className="flex flex-col items-center text-sm text-muted-foreground">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
    </div>
  );
}
