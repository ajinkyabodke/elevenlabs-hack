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
import { BookOpen, Brain, LineChart, Menu, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Journal",
    icon: MessageSquare,
    href: "/app",
  },
  {
    title: "History",
    icon: BookOpen,
    href: "/journals",
  },
  // {
  //   title: "Time Capsule",
  //   icon: Clock,
  //   href: "/time-capsule",
  // },

  {
    title: "Mood Analysis",
    icon: LineChart,
    href: "/trends",
  },
  {
    title: "Long Term Memory",
    icon: Brain,
    href: "/memory",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex-1 py-4">
        {sidebarItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 transition-all",
                pathname === item.href
                  ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  : "text-black/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  pathname === item.href ? "text-black" : "text-black/80",
                )}
              />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  if (pathname === "/") return null;

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-violet-400 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 bg-gradient-to-br from-violet-400 to-blue-400 text-black backdrop-blur-sm"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3 text-black">
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "w-10 h-10",
                  },
                }}
              />
              <span>Voice Journal</span>
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 border-r border-white/20 bg-gradient-to-br from-violet-400 to-blue-400 text-black md:block">
        <div className="flex h-14 items-center gap-3 border-b border-white/20 px-4">
          <UserButton
            appearance={{
              elements: {
                rootBox: "w-10 h-10",
              },
            }}
          />
          <h2 className="font-semibold">Echo</h2>
        </div>
        <div className="px-4">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
