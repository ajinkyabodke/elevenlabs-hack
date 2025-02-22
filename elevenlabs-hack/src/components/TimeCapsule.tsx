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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { addDays, format } from "date-fns";
import { Clock, Mail, Plus, TimerReset } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TimeCapsuleEntry {
  id: string;
  type: "future" | "past";
  title: string;
  content: string;
  createdAt: Date;
  deliveryDate?: Date;
}

export function TimeCapsule() {
  const [entries, setEntries] = useState<TimeCapsuleEntry[]>([
    {
      id: "1",
      type: "future",
      title: "Goals for Next Year",
      content: "Dear Future Self, I hope by now you've...",
      createdAt: new Date(),
      deliveryDate: addDays(new Date(), 365),
    },
    {
      id: "2",
      type: "past",
      title: "Reflection on Growth",
      content: "Looking back, I can see how much I've grown...",
      createdAt: new Date(),
    },
  ]);

  const [newEntry, setNewEntry] = useState<Partial<TimeCapsuleEntry>>({
    type: "future",
  });

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error("Please fill in all fields");
      return;
    }

    const entry: TimeCapsuleEntry = {
      id: Math.random().toString(36).substring(7),
      type: newEntry.type ?? "future",
      title: newEntry.title,
      content: newEntry.content,
      createdAt: new Date(),
      deliveryDate:
        newEntry.type === "future"
          ? (newEntry.deliveryDate ?? addDays(new Date(), 30))
          : undefined,
    };

    setEntries((prev) => [...prev, entry]);
    setNewEntry({ type: "future" });
    toast.success(
      entry.type === "future"
        ? "Letter to future self scheduled"
        : "Reflection on past self saved",
    );
  };

  const futureEntries = entries.filter((entry) => entry.type === "future");
  const pastEntries = entries.filter((entry) => entry.type === "past");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Capsule</h2>
          <p className="text-muted-foreground">
            Write to your future self or reflect on your past
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Time Capsule Entry</DialogTitle>
              <DialogDescription>
                Write a letter to your future self or reflect on your past.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select
                  value={newEntry.type}
                  onValueChange={(value: "future" | "past") =>
                    setNewEntry((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="future">
                      Letter to Future Self
                    </SelectItem>
                    <SelectItem value="past">
                      Reflection on Past Self
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="Title"
                  value={newEntry.title ?? ""}
                  onChange={(e) =>
                    setNewEntry((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  placeholder={
                    newEntry.type === "future"
                      ? "Dear Future Self..."
                      : "Looking back..."
                  }
                  value={newEntry.content ?? ""}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="min-h-[200px]"
                />
              </div>
              {newEntry.type === "future" && (
                <div className="grid gap-2">
                  <Select
                    value={
                      newEntry.deliveryDate
                        ? format(newEntry.deliveryDate, "yyyy-MM-dd")
                        : undefined
                    }
                    onValueChange={(value) =>
                      setNewEntry((prev) => ({
                        ...prev,
                        deliveryDate: new Date(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="When to deliver?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={format(addDays(new Date(), 30), "yyyy-MM-dd")}
                      >
                        In 1 month
                      </SelectItem>
                      <SelectItem
                        value={format(addDays(new Date(), 90), "yyyy-MM-dd")}
                      >
                        In 3 months
                      </SelectItem>
                      <SelectItem
                        value={format(addDays(new Date(), 180), "yyyy-MM-dd")}
                      >
                        In 6 months
                      </SelectItem>
                      <SelectItem
                        value={format(addDays(new Date(), 365), "yyyy-MM-dd")}
                      >
                        In 1 year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddEntry}>
                {newEntry.type === "future"
                  ? "Schedule Letter"
                  : "Save Reflection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="future" className="space-y-4">
        <TabsList>
          <TabsTrigger value="future" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Letters to Future Self
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <TimerReset className="h-4 w-4" />
            Past Reflections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="future" className="space-y-4">
          {futureEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Delivery date:{" "}
                  {entry.deliveryDate?.toLocaleDateString() ?? "Not set"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Written on {entry.createdAt.toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription>
                  Reflection from {entry.createdAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
