import fetch from "node-fetch";

const MOODS = {
  VERY_POSITIVE: {
    events: [
      "Got promoted at work",
      "Celebrated anniversary",
      "Ran personal best 5K",
      "Started new hobby painting",
      "Met old friends reunion",
      "Completed major project",
      "Booked dream vacation",
    ],
    templates: [
      "Today was incredible! {event}. I'm feeling on top of the world. The energy and positivity are just flowing through me. Everything seems to be falling into place, and I'm so grateful for these moments.",
      "What an amazing day! {event}. I can't stop smiling. These are the kind of days that remind me why all the hard work is worth it. Feeling blessed and motivated.",
    ],
  },
  POSITIVE: {
    events: [
      "Productive workday",
      "Good gym session",
      "Cooked healthy meal",
      "Quality family time",
      "Finished good book",
      "Pleasant walk outside",
      "Cleaned apartment thoroughly",
    ],
    templates: [
      "Had a good day today. {event}. Things are going smoothly, and I'm feeling pretty content. Taking it one day at a time, but definitely in a good headspace.",
      "Today was nice and balanced. {event}. Feeling positive about the direction things are going. Small wins add up, and I'm appreciating these moments.",
    ],
  },
  NEUTRAL: {
    events: [
      "Regular workday",
      "Grocery shopping done",
      "Watched some TV",
      "Quick lunch break",
      "Regular commute",
      "Basic house chores",
      "Normal routine day",
    ],
    templates: [
      "Just another day. {event}. Nothing particularly special happened, but that's okay. Keeping up with the routine and taking things as they come.",
      "Average kind of day today. {event}. Not much to report, really. Just going through the motions and maintaining the status quo.",
    ],
  },
  NEGATIVE: {
    events: [
      "Missed deadline stress",
      "Minor argument friend",
      "Sleep problems night",
      "Skipped gym again",
      "Budget concerns growing",
      "Weather affecting mood",
      "Technology issues work",
    ],
    templates: [
      "Feeling a bit down today. {event}. Not in the best headspace, but trying to push through. Hoping tomorrow will be better.",
      "Today was rough. {event}. Having trouble staying motivated and positive. Need to find a way to turn things around.",
    ],
  },
  VERY_NEGATIVE: {
    events: [
      "Major project failed",
      "Health concerns emerging",
      "Relationship difficulties serious",
      "Family conflict escalated",
      "Financial setback significant",
      "Lost important opportunity",
      "Depression symptoms returning",
    ],
    templates: [
      "Everything feels overwhelming today. {event}. Can't seem to shake off this heavy feeling. Really struggling to see the light at the end of the tunnel.",
      "Today hit hard. {event}. Feeling completely drained and defeated. These are the kinds of days that test your resilience, but right now it's just too much.",
    ],
  },
};

type MoodKey = keyof typeof MOODS;

const getMoodScore = (mood: MoodKey): number => {
  const scores = {
    VERY_POSITIVE: 90,
    POSITIVE: 70,
    NEUTRAL: 50,
    NEGATIVE: 30,
    VERY_NEGATIVE: 10,
  };
  return scores[mood] + Math.floor(Math.random() * 20 - 10); // Add some randomness
};

const generateEntry = (date: Date, mood: MoodKey) => {
  const moodData = MOODS[mood];
  const event =
    moodData.events[Math.floor(Math.random() * moodData.events.length)];
  const template =
    moodData.templates[Math.floor(Math.random() * moodData.templates.length)];

  return {
    date,
    entry: template.replace("{event}", event),
    mood,
    event,
  };
};

// Create a realistic pattern of mood changes
const generateMoodPattern = (days: number): MoodKey[] => {
  const pattern: MoodKey[] = [];
  let currentMoodIndex = 2; // Start with NEUTRAL (index 2)
  const moodLevels: MoodKey[] = [
    "VERY_NEGATIVE",
    "NEGATIVE",
    "NEUTRAL",
    "POSITIVE",
    "VERY_POSITIVE",
  ];

  for (let i = 0; i < days; i++) {
    pattern.push(moodLevels[currentMoodIndex]);

    // Simulate mood changes with some randomness
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    currentMoodIndex = Math.max(0, Math.min(4, currentMoodIndex + change));

    // Add some sudden mood swings occasionally
    if (Math.random() < 0.1) {
      // 10% chance
      currentMoodIndex = Math.floor(Math.random() * 5);
    }
  }

  return pattern;
};

async function seedJournals() {
  const days = 30;
  const endDate = new Date();
  const moodPattern = generateMoodPattern(days);

  for (let i = 0; i < days; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);

    const mood = moodPattern[i];
    const { entry } = generateEntry(date, mood);

    try {
      const response = await fetch("http://localhost:3000/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawEntry: `user: ${entry}\nai: Thank you for sharing. I'm here to listen.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create entry: ${response.statusText}`);
      }

      console.log(`Created entry for ${date.toISOString().split("T")[0]}`);

      // Add a small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to create entry for ${date}:`, error);
    }
  }
}

// Run the seed script
void seedJournals();

// update route.ts to use this seed script

// import { db } from "@/server/db";
// import { journalEntries, users, type UserSelect } from "@/server/db/schema";
// import { openai } from "@ai-sdk/openai";
// import { currentUser } from "@clerk/nextjs/server";

// import { generateObject } from "ai";
// import { eq } from "drizzle-orm";
// import { z } from "zod";

// const journalEntrySchema = z.object({
//   rawEntry: z.string().min(1),
// });

// type JournalEntryInput = z.infer<typeof journalEntrySchema>;

// export async function POST(req: Request) {
//   try {
//     // const { userId } = await auth();
//     const userId = "user_2n74T8HfwTkQNtGB9dmc7YAnwuv";
//     if (!userId) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     const [_user] = await Promise.all([currentUser(), ,]);

//     // if (!_user) {
//     //   return Response.json({ error: "Unauthorized" }, { status: 401 });
//     // }
//     // const primaryEmail = _user?.emailAddresses[0]?.emailAddress ?? "";
//     const primaryEmail = "ajinkyabodke678@gmail.com";
//     // const userName = _user?.fullName ?? "User";
//     const userName = "Ajinkya Bodke";

//     let existingUser = await db.query.users.findFirst({
//       where: (u, { eq }) => eq(u.id, userId),
//       columns: {
//         id: true,
//         memory: true,
//         memoryEnabledAt: true,
//       },
//     });

//     if (!existingUser) {
//       [existingUser] = await db
//         .insert(users)
//         .values({
//           id: userId,
//           email: primaryEmail,
//           memory: [`User's name is ${userName}.`],
//         })
//         .returning();
//     }

//     if (!existingUser) throw new Error("User not found");

//     const body = (await req.json()) as JournalEntryInput;
//     const { rawEntry } = journalEntrySchema.parse(body);

//     if (!rawEntry.trim()) {
//       return Response.json(
//         { error: "Journal entry is required" },
//         { status: 400 },
//       );
//     }

//     const [analysis, memories] = await Promise.all([
//       summariseJournalEntry(rawEntry),
//       addMemories({
//         conversation: rawEntry,
//         user: existingUser,
//       }),
//     ]);

//     // Save to database with the analysis and user ID
//     const entries = await db
//       .insert(journalEntries)
//       .values({
//         userId,
//         rawEntry,
//         summarizedEntry: analysis.summary,
//         title: analysis.title,
//         moodScore: analysis.moodScore.toFixed(2),
//         significantEvents: analysis.significantEvents,
//       })
//       .returning();

//     const entry = entries[0];
//     if (!entry) {
//       throw new Error("Failed to create journal entry");
//     }

//     return Response.json(entry);
//   } catch (error) {
//     console.error("Failed to create journal entry:", error);
//     return Response.json(
//       { error: "Failed to create journal entry" },
//       { status: 500 },
//     );
//   }
// }

// // job phone car marriage laptop

// const summariseJournalEntry = async (entry: string) => {
//   // Analyze the entry using Vercel AI SDK
//   const { object: analysis } = await generateObject({
//     model: openai("gpt-4o-mini"),
//     schema: z.object({
//       moodScore: z
//         .number()
//         .min(0)
//         .max(100)
//         .describe(
//           "A number between 0-100 representing the emotional state: 0-20 (very negative), 21-40 (negative), 41-60 (neutral), 61-80 (positive), 81-100 (very positive)",
//         ),
//       summary: z
//         .string()
//         .describe(
//           "A simple, natural journal entry written in first person, as if written by the user themselves",
//         ),
//       title: z
//         .string()
//         .describe("A short title for the journal entry. Max 15-20 words."),
//       significantEvents: z
//         .array(z.string())
//         .describe(
//           "A list of significant events that happened in the conversation. Max 4-5 words for each event. Don't include conjunctions like 'and', 'a' or 'but'.",
//         )
//         .max(4),
//     }),
//     prompt: `Transform this conversation into a simple, natural journal entry. Write it exactly how someone would write in their personal diary - casual, honest, and straightforward.

// Conversation transcript:
// ${entry}

// Guidelines:
// 1. Use simple, everyday language
// 2. Write in first person, present tense
// 3. Focus on feelings and thoughts
// 4. Keep it brief and natural
// 5. Remove all AI interactions
// 6. Write as if you're writing in a personal diary

// Example style:
// "I'm feeling down today. Work was really stressful and I couldn't focus. My mind kept wandering to the argument I had with Sarah. I just need some time to process everything."`,
//     system: `You are helping someone write in their personal diary. Write exactly how they would write - simple, honest, and natural. No fancy words, no complex analysis. Just their thoughts and feelings in their own voice.

// Remember:
// - Write like you're writing in a diary
// - Use everyday language
// - Keep it short and simple
// - Focus on their feelings
// - Remove any trace of AI conversation`,
//     temperature: 0.7,
//     maxTokens: 500,
//   });
//   return analysis;
// };

// const addMemories = async (props: {
//   conversation: string;
//   user: Pick<UserSelect, "id" | "memory">;
// }) => {
//   const { object } = await generateObject({
//     model: openai("gpt-4o-mini"),
//     prompt: [
//       `Today is ${new Date().toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })}.`,

//       props.user.memory.length > 0 &&
//         `Existing memories in user's journal: ${props.user.memory
//           .map((m, idx) => `- ${idx + 1}. ${m}`)
//           .join("\n")}`,

//       `Extract new memories from the following conversation that are not already in the user's journal.

// Include only the most significant events in the user's life like the user saying getting a new job, getting married, or having a child.

// Conversation:
// ${props.conversation}

// Don't include any memories that are already in the user's journal.
// Always include absolute dates, and not "last week" or "last month" etc.`,
//     ].join("\n"),
//     schema: z.object({
//       memories: z.array(z.string()).describe("A list of memories"),
//     }),
//   });

//   const memories = object.memories;

//   await db
//     .update(users)
//     .set({
//       memory: [...props.user.memory, ...memories],
//     })
//     .where(eq(users.id, props.user.id));

//   return memories;
// };
