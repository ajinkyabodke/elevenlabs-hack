import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Daily Journal",
  description:
    "A simple journaling app that helps you track your daily mood and thoughts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
