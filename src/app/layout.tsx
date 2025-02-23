import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/siteConfig";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://elevenlabs-hack.vercel.app"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Voice Journal", "Mood Tracking", "Thoughts"],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <ClerkProvider>
      <html lang="en">
        <TRPCReactProvider>
          <body className={GeistSans.className}>
            <div className="flex h-screen">
              {isAuthenticated && <Sidebar />}
              <div className="w-full overflow-auto bg-gradient-to-br from-zinc-50 via-white to-zinc-100/50">
                <main className="container mx-auto px-6 py-6">{children}</main>
              </div>
              <Toaster />
            </div>
          </body>
        </TRPCReactProvider>
      </html>
    </ClerkProvider>
  );
}
