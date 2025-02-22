"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Lock, PenLine, Tag, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

const letterSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  content: z.string().min(10, "Letter must be at least 10 characters"),
  openDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Open date must be in the future",
  }),
}) as const;

type LetterSchema = z.infer<typeof letterSchema>;

type Letter = {
  id: number;
  topic: string;
  content: string;
  writtenDate: Date;
  openDate: Date;
  isOpen: boolean;
};

interface TimeCapsuleFormProps {
  form: UseFormReturn<LetterSchema>;
  onSubmit: (values: LetterSchema) => void;
}

function TimeCapsuleForm({ form, onSubmit }: TimeCapsuleFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sand-700">Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Career Goals, Personal Growth"
                  className="border-sand-200 bg-white/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sand-700">Your Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dear future me..."
                  className="border-sand-200 min-h-[120px] bg-white/50 sm:min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sand-700">Open Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="border-sand-200 bg-white/50"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sand-600 text-sm">
                Choose when you want to read this letter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-sand-500 hover:bg-sand-600 w-full text-white"
        >
          Seal Letter
        </Button>
      </form>
    </Form>
  );
}

export function TimeCapsule() {
  const form = useForm<LetterSchema>({
    resolver: zodResolver(letterSchema),
    defaultValues: {
      topic: "",
      content: "",
      openDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const [letters, setLetters] = useState<Letter[]>([
    {
      id: 1,
      topic: "Career Goals",
      content: "Dear future me, I hope you've achieved...",
      writtenDate: new Date("2024-01-01"),
      openDate: new Date("2024-12-31"),
      isOpen: false,
    },
    {
      id: 2,
      topic: "Personal Growth",
      content: "Remember to always stay true to...",
      writtenDate: new Date("2024-02-15"),
      openDate: new Date("2024-06-15"),
      isOpen: true,
    },
  ]);

  const handleSubmit = (values: LetterSchema) => {
    const newLetter: Letter = {
      id: letters.length + 1,
      topic: values.topic,
      content: values.content,
      writtenDate: new Date(),
      openDate: new Date(values.openDate),
      isOpen: false,
    };
    setLetters([...letters, newLetter]);
    form.reset();
    toast.success("Letter sealed successfully", {
      description: "Your message has been saved for your future self.",
    });
  };

  const handleOpenLetter = (id: number) => {
    setLetters(
      letters.map((letter) =>
        letter.id === id ? { ...letter, isOpen: true } : letter,
      ),
    );
    toast.success("Letter opened!", {
      description: "A message from your past self has been revealed.",
    });
  };

  const handleDeleteLetter = (id: number) => {
    setLetters(letters.filter((letter) => letter.id !== id));
    toast.success("Letter deleted", {
      description: "The letter has been permanently removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sand-800 text-xl font-bold sm:text-2xl">
            Time Capsule
          </h2>
          <p className="text-sand-600 text-sm sm:text-base">
            Write letters to your future self
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sand-500 hover:bg-sand-600 w-full text-white sm:w-auto">
              <PenLine className="mr-2 h-4 w-4" />
              Write Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="from-sand-50 mx-auto w-[calc(100%-2rem)] max-w-lg bg-gradient-to-br to-white sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-sand-800">
                Write to Future You
              </DialogTitle>
              <DialogDescription className="text-sand-600">
                Leave a message for yourself to read in the future.
              </DialogDescription>
            </DialogHeader>
            <TimeCapsuleForm form={form} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {letters.map((letter, index) => (
          <Card
            key={letter.id}
            className={`card-hover border-sand-200 from-sand-50 bg-gradient-to-br to-white fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="space-y-3 sm:space-y-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
                <div className="space-y-1.5">
                  <CardTitle
                    className="text-sand-800 slide-up text-lg sm:text-xl"
                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                  >
                    To be opened on {format(letter.openDate, "MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription className="text-sand-600 text-sm">
                    Written on {format(letter.writtenDate, "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sand-500 hover:bg-sand-100 hover:text-sand-700 rotate-in self-end sm:self-start"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                  onClick={() => handleDeleteLetter(letter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div
                  className="text-sand-700 slide-up flex items-center gap-2 text-sm sm:text-base"
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <Tag className="h-4 w-4" />
                  {letter.topic}
                </div>
                {letter.isOpen ? (
                  <p
                    className="text-sand-700 scale-in text-sm sm:text-base"
                    style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                  >
                    {letter.content}
                  </p>
                ) : (
                  <div className="bg-sand-100 breathing-animation flex items-center justify-center rounded-lg p-6 sm:p-8">
                    <Lock className="text-sand-500 h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {!letter.isOpen && new Date() >= letter.openDate && (
                <Button
                  className="bg-ocean-500 hover:bg-ocean-600 scale-in w-full text-white sm:w-auto"
                  style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                  onClick={() => handleOpenLetter(letter.id)}
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Open Letter
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
