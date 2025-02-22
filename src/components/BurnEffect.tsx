"use client";

import { useEffect, useRef } from "react";

interface BurnEffectProps {
  onComplete: () => void;
}

export function BurnEffect({ onComplete }: BurnEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    // Create initial particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 5 - 2,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: `hsl(${Math.random() * 30 + 10}, 100%, 50%)`,
      });
    }

    let frame = 0;
    const maxFrames = 120; // Animation duration in frames

    function animate() {
      if (frame >= maxFrames) {
        onComplete();
        return;
      }

      // Clear canvas with semi-transparent black for trail effect
      ctx!.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Update and draw particles
      for (const p of particles) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Add some randomness to velocity
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2;

        // Fade out
        p.alpha = Math.max(0, p.alpha - 0.01);

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color.replace(")", `, ${p.alpha})`);
        ctx!.fill();

        // Reset particle if it's invisible
        if (p.alpha <= 0) {
          p.y = canvas!.height;
          p.x = Math.random() * canvas!.width;
          p.alpha = 1;
        }
      }

      frame++;
      requestAnimationFrame(animate);
    }

    animate();
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-50 h-full w-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
