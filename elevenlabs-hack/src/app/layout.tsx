import "@/styles/globals.css";

import { Sidebar } from "@/components/layout/Sidebar";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";

export const metadata = {
  title: "Voice Journal",
  description:
    "A voice-first journaling app that helps you track your mood and thoughts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <TRPCReactProvider>
          <body className={GeistSans.className}>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                <main className="container mx-auto p-4">{children}</main>
              </div>
            </div>
            <Toaster />
          </body>
        </TRPCReactProvider>
      </html>
    </ClerkProvider>
  );
}
