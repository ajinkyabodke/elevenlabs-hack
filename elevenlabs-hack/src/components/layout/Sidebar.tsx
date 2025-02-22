"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  BookOpen,
  Brain,
  Clock,
  Heart,
  LineChart,
  Menu,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Journal",
    icon: MessageSquare,
    href: "/",
  },
  {
    title: "Past Entries",
    icon: BookOpen,
    href: "/journals",
  },
  {
    title: "Memory Bank",
    icon: Brain,
    href: "/memory",
  },
  {
    title: "Time Capsule",
    icon: Clock,
    href: "/time-capsule",
  },
  {
    title: "Trends",
    icon: LineChart,
    href: "/trends",
  },
  {
    title: "Calming Exercises",
    icon: Heart,
    href: "/calm",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex-1 py-4">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "w-10 h-10",
                  },
                }}
              />
              Voice Journal
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 border-r md:block">
        <div className="flex h-14 items-center border-b px-4">
          <UserButton
            appearance={{
              elements: {
                rootBox: "w-10 h-10",
              },
            }}
          />
          <h2 className="font-semibold">Voice Journal</h2>
        </div>
        <div className="px-4">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
