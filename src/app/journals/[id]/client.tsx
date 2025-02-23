"use client";

import { Button } from "@/components/ui/button";
import { type JournalEntry } from "@/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Quote, Sparkles } from "lucide-react";
import Link from "next/link";

interface JournalEntryClientProps {
  entry: JournalEntry;
}

function getMoodEmoji(score: number) {
  if (score >= 75) return "🌟";
  if (score >= 50) return "😊";
  if (score >= 25) return "😐";
  return "😔";
}

function getMoodColor(score: number) {
  if (score >= 75) return "text-emerald-500 dark:text-emerald-400";
  if (score >= 50) return "text-blue-500 dark:text-blue-400";
  if (score >= 25) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

function getMoodDescription(score: number) {
  if (score >= 75) return "Excellent mood";
  if (score >= 50) return "Good mood";
  if (score >= 25) return "Fair mood";
  return "Poor mood";
}

export default function JournalEntryClient({ entry }: JournalEntryClientProps) {
  const moodScore = parseFloat(entry.moodScore);
  const moodEmoji = getMoodEmoji(moodScore);
  const moodColor = getMoodColor(moodScore);
  const moodDescription = getMoodDescription(moodScore);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5 shadow-lg backdrop-blur-sm dark:from-violet-500/10 dark:to-blue-500/10"
      >
        <div className="flex flex-col space-y-4 p-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="transition-transform hover:scale-105"
            >
              <Link href="/journals">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-3xl font-bold text-transparent dark:from-violet-400 dark:to-blue-400"
              >
                Journal Entry
              </motion.h2>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <BookOpen className="h-4 w-4" />
                  {format(
                    new Date(entry.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 rounded-full border bg-gradient-to-r from-violet-500/20 to-blue-500/20 px-4 py-2 shadow-sm transition-colors hover:from-violet-500/30 hover:to-blue-500/30"
                >
                  <span className="animate-pulse text-xl">{moodEmoji}</span>
                  <span className={`font-medium ${moodColor}`}>
                    {moodScore.toFixed(1)}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground"
                >
                  {moodDescription}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group rounded-xl border bg-gradient-to-br from-violet-500/10 via-card to-blue-500/10 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:from-violet-500/5 hover:to-blue-500/5 hover:shadow-xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-blue-500 transition-colors group-hover:text-violet-500 dark:text-blue-400 dark:group-hover:text-violet-400" />
            <h2 className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-2xl font-semibold text-transparent dark:from-violet-400 dark:to-blue-400">
              Your Reflections
            </h2>
          </div>
          <div className="relative">
            <Quote className="absolute -left-4 -top-4 h-8 w-8 text-violet-500/20" />
            <Quote className="absolute -bottom-4 -right-4 h-8 w-8 rotate-180 text-blue-500/20" />
            <div className="prose prose-zinc dark:prose-invert max-w-none px-6">
              <p className="text-lg leading-relaxed">{entry.summarizedEntry}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
