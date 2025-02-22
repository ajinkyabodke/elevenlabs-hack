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
import { Lock, PenLine, Tag, Trash2, Unlock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const letterSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  content: z.string().min(10, "Letter must be at least 10 characters"),
  openDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Open date must be in the future",
  }),
});

type Letter = {
  id: number;
  topic: string;
  content: string;
  writtenDate: Date;
  openDate: Date;
  isOpen: boolean;
};

export function TimeCapsule() {
  const form = useForm<z.infer<typeof letterSchema>>({
    resolver: zodResolver(letterSchema),
    defaultValues: {
      topic: "",
      content: "",
      openDate: "",
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

  const handleSubmit = (values: z.infer<typeof letterSchema>) => {
    const newLetter: Letter = {
      id: letters.length + 1,
      topic: values.topic,
      content: values.content,
      writtenDate: new Date(),
      openDate: new Date(values.openDate),
      isOpen: false,
    };
    setLetters([...letters, newLetter]);
    toast.success("Letter sealed successfully");
  };

  const handleOpenLetter = (id: number) => {
    setLetters(
      letters.map((letter) =>
        letter.id === id ? { ...letter, isOpen: true } : letter,
      ),
    );
  };

  const handleDeleteLetter = (id: number) => {
    setLetters(letters.filter((letter) => letter.id !== id));
    toast.success("Letter deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sand-800 text-2xl font-bold">Time Capsule</h2>
          <p className="text-sand-600">Write letters to your future self</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sand-500 hover:bg-sand-600 text-white">
              <PenLine className="mr-2 h-4 w-4" />
              Write Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="from-sand-50 bg-gradient-to-br to-white">
            <DialogHeader>
              <DialogTitle className="text-sand-800">
                Write to Future You
              </DialogTitle>
              <DialogDescription className="text-sand-600">
                Leave a message for yourself to read in the future.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
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
                      <FormLabel className="text-sand-700">
                        Your Letter
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dear future me..."
                          className="border-sand-200 min-h-[200px] bg-white/50"
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
                          className="border-sand-200 bg-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sand-600">
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {letters.map((letter, index) => (
          <Card
            key={letter.id}
            className={`card-hover border-sand-200 from-sand-50 bg-gradient-to-br to-white fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle
                    className="text-sand-800 slide-up"
                    style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                  >
                    To be opened on {letter.openDate.toLocaleDateString()}
                  </CardTitle>
                  <CardDescription className="text-sand-600">
                    Written {letter.writtenDate.toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sand-500 hover:bg-sand-100 hover:text-sand-700 rotate-in"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                  onClick={() => handleDeleteLetter(letter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div
                  className="text-sand-700 slide-up flex items-center gap-2"
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <Tag className="h-4 w-4" />
                  {letter.topic}
                </div>
                {letter.isOpen ? (
                  <p
                    className="text-sand-700 scale-in"
                    style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                  >
                    {letter.content}
                  </p>
                ) : (
                  <div className="bg-sand-100 breathing-animation flex items-center justify-center rounded-lg p-8">
                    <Lock className="text-sand-500 h-8 w-8" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {!letter.isOpen && new Date() >= letter.openDate && (
                <Button
                  className="bg-ocean-500 hover:bg-ocean-600 scale-in text-white"
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
