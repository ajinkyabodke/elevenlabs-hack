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
import { sidebarCollapsedAtom } from "@/store/sidebar";
import { UserButton } from "@clerk/nextjs";
import { useAtom } from "jotai";
import {
  BookOpen,
  Brain,
  LineChart,
  LucideSidebar,
  Menu,
  MessageSquare,
} from "lucide-react";
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useAtom(sidebarCollapsedAtom);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="space-3 flex flex-1 flex-col gap-3 py-4">
        {sidebarItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 transition-all",
                pathname === item.href
                  ? "bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  : "text-white hover:bg-white/10 hover:text-white",
                isSidebarCollapsed && "px-3",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  pathname === item.href ? "text-white" : "text-white/80",
                )}
              />
              {!isSidebarCollapsed && item.title}
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
      <div
        className={cn(
          "hidden h-screen border-r border-white/20 bg-gradient-to-br from-violet-400/80 to-blue-400/80 text-black transition-all duration-300 md:block",
          isSidebarCollapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div className="flex h-14 items-center gap-3 border-b border-white/20 px-4">
          {!isSidebarCollapsed && (
            <UserButton
              appearance={{
                elements: {
                  rootBox: "w-8 h-8",
                },
              }}
            />
          )}

          {!isSidebarCollapsed && <h2 className="font-semibold">Echo</h2>}

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <LucideSidebar
              className={cn(
                "h-4 w-4 text-white transition-transform",
                isSidebarCollapsed && "rotate-180",
              )}
            />
          </Button>
        </div>
        <div className="px-4">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
