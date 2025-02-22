"use client";

import { cn } from "@/lib/utils";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { PulsatingButton } from "./ui/button";

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({
  isRecording,
  isProcessing,
  onClick,
  disabled,
}: RecordButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRecording) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationFrameId: number;
    // Create more bars for a denser look
    const numBars = 32;
    const barValues: number[] = Array.from(
      { length: numBars },
      () => Math.random() * 0.5 + 0.25,
    );
    let phase = 0;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update phase
      phase += 0.1;

      // Calculate bar width and spacing
      const totalWidth = canvas.width;
      const barWidth = Math.max(2, totalWidth / (numBars * 2)); // Ensure minimum width of 2px
      const spacing = (totalWidth - numBars * barWidth) / (numBars + 1);

      // Draw bars
      ctx.fillStyle = "rgb(147 197 253 / 0.5)"; // blue-300 with 50% opacity

      for (let i = 0; i < numBars; i++) {
        // Calculate height using sine wave and current value
        const baseHeight = 20; // Base height of bars
        const value = barValues[i] ?? 0.5; // Provide a fallback value
        const heightMultiplier = Math.sin(phase + i * 0.2) * 0.5 + 1;
        const height = baseHeight * value * heightMultiplier;

        // Calculate x position with spacing
        const x = spacing + i * (barWidth + spacing);
        const y = (canvas.height - height) / 2;

        // Draw rounded rectangle
        ctx.beginPath();
        const radius = Math.min(barWidth / 2, height / 2, 2); // Limit radius to 2px
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + height - radius);
        ctx.quadraticCurveTo(
          x + barWidth,
          y + height,
          x + barWidth - radius,
          y + height,
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Update bar values with smooth transitions
        const currentValue = barValues[i] ?? 0.5;
        barValues[i] = Math.max(
          0.25,
          Math.min(1, currentValue + (Math.random() - 0.5) * 0.1),
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording]);

  return (
    <div className="relative flex h-16 items-center justify-center py-20">
      <div
        className={cn(
          "flex items-center justify-center transition-transform duration-300 ease-in-out",
          isRecording ? "-translate-x-8" : "",
        )}
      >
        <PulsatingButton
          pulseEnabled={!isRecording}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "group relative flex size-16 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
            isRecording
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-gradient-to-r from-cyan-900 to-sky-900 text-primary-foreground hover:bg-primary/90",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          {/* Outer ring animation */}
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              isRecording && "animate-ping bg-destructive/75",
            )}
          />

          {/* Icon */}
          <div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="size-6 animate-spin" />
            ) : isRecording ? (
              <MicOff className="size-6" />
            ) : (
              <Mic className="size-6" />
            )}
          </div>
        </PulsatingButton>

        <div className={cn("relative ml-4", isRecording ? "flex" : "hidden")}>
          {/* Waveform canvas */}
          <canvas
            ref={canvasRef}
            className={cn(
              "opacity-0 transition-opacity duration-300",
              isRecording && "opacity-100",
            )}
          />
        </div>
      </div>
    </div>
  );
}
