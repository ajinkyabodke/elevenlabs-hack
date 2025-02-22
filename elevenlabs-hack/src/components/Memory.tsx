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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MemoryItem {
  id: string;
  type: "trigger" | "pattern" | "preference";
  title: string;
  description: string;
  importance: number;
  dateAdded: Date;
}

export function Memory() {
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: "1",
      type: "trigger",
      title: "Work Deadlines",
      description: "Feeling overwhelmed when multiple deadlines overlap",
      importance: 8,
      dateAdded: new Date(),
    },
    {
      id: "2",
      type: "pattern",
      title: "Morning Anxiety",
      description:
        "Anxiety peaks in the morning, especially before important meetings",
      importance: 7,
      dateAdded: new Date(),
    },
  ]);

  const [newMemory, setNewMemory] = useState<Partial<MemoryItem>>({
    type: "pattern",
    importance: 5,
  });

  const handleAddMemory = () => {
    if (!newMemory.title || !newMemory.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const memory: MemoryItem = {
      id: Math.random().toString(36).substring(7),
      type: newMemory.type as "trigger" | "pattern" | "preference",
      title: newMemory.title,
      description: newMemory.description,
      importance: newMemory.importance || 5,
      dateAdded: new Date(),
    };

    setMemories((prev) => [...prev, memory]);
    setNewMemory({ type: "pattern", importance: 5 });
    toast.success("Memory added");
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    toast.success("Memory deleted");
  };

  const getTypeIcon = (type: MemoryItem["type"]) => {
    switch (type) {
      case "trigger":
        return "⚡️";
      case "pattern":
        return "🔄";
      case "preference":
        return "⭐️";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sage-800 text-2xl font-bold">Memory Bank</h2>
          <p className="text-sage-600">
            Store important patterns, triggers, and preferences
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sage-500 hover:bg-sage-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent className="from-sage-50 bg-gradient-to-br to-white">
            <DialogHeader>
              <DialogTitle className="text-sage-800">
                Add New Memory
              </DialogTitle>
              <DialogDescription className="text-sage-600">
                Record a new pattern, trigger, or preference to help track your
                journey.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newMemory.type}
                  onValueChange={(value) =>
                    setNewMemory((prev) => ({ ...prev, type: value as any }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trigger">Trigger</SelectItem>
                    <SelectItem value="pattern">Pattern</SelectItem>
                    <SelectItem value="preference">Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newMemory.title || ""}
                  onChange={(e) =>
                    setNewMemory((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Give your memory a title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMemory.description || ""}
                  onChange={(e) =>
                    setNewMemory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the pattern, trigger, or preference"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="importance">Importance (1-10)</Label>
                <Select
                  value={newMemory.importance?.toString()}
                  onValueChange={(value) =>
                    setNewMemory((prev) => ({
                      ...prev,
                      importance: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select importance" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMemory}>Add Memory</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {memories.map((memory, index) => (
          <Card
            key={memory.id}
            className={`card-hover border-sage-200 from-sage-50 bg-gradient-to-br to-white fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sage-800 flex items-center gap-2">
                    <span
                      className="scale-in"
                      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                    >
                      {getTypeIcon(memory.type)}
                    </span>
                    {memory.title}
                  </CardTitle>
                  <CardDescription className="text-sage-600">
                    Added {memory.dateAdded.toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sage-500 hover:bg-sage-100 hover:text-sage-700 rotate-in"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                  onClick={() => handleDeleteMemory(memory.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className="text-sage-700 slide-up"
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                {memory.description}
              </p>
            </CardContent>
            <CardFooter>
              <div
                className="text-sage-600 slide-up flex items-center gap-2"
                style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              >
                <Star className="h-4 w-4" />
                Importance: {memory.importance}/10
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
