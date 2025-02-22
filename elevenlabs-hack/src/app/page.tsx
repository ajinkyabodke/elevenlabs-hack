import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Brain, Mic, Timer } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Voice Journal
        </h1>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          Your AI-powered voice journaling companion. Speak your thoughts, get
          insights, and track your emotional well-being.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <Mic className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-center">Voice First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Just speak naturally. Our AI assistant will listen and respond.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-center">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get insights into your emotional state and patterns over time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Timer className="mx-auto h-8 w-8 text-primary" />
              <CardTitle className="text-center">Mindfulness</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access breathing exercises and grounding techniques when needed.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <SignedIn>
          <Button asChild size="lg">
            <Link href="/app">Go to Journal</Link>
          </Button>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </main>
  );
}
