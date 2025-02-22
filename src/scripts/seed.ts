import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { subDays, subHours } from "date-fns";

const sampleEntries = [
  {
    rawEntry:
      "Today was absolutely incredible! I landed the project I've been working towards for months. The team's reaction was priceless, and I can't stop smiling. Even the small hiccups along the way seem insignificant now. I feel like I can conquer anything!",
    summarizedEntry:
      "Landed a major project, feeling ecstatic and accomplished",
    moodScore: "95",
    createdAt: subDays(new Date(), 1),
  },
  {
    rawEntry:
      "Feeling a bit overwhelmed with all the deadlines coming up. The pressure is mounting, but I'm trying to stay focused and take it one task at a time. Had a good chat with Sarah over coffee which helped put things in perspective.",
    summarizedEntry:
      "Managing multiple deadlines, staying positive despite pressure",
    moodScore: "65",
    createdAt: subDays(new Date(), 2),
  },
  {
    rawEntry:
      "Rough day. Nothing seemed to go right from the moment I woke up. Missed my train, spilled coffee on my new shirt, and the client meeting didn't go as planned. Just want to curl up and start over tomorrow.",
    summarizedEntry:
      "Multiple setbacks throughout the day, feeling discouraged",
    moodScore: "25",
    createdAt: subDays(new Date(), 3),
  },
  {
    rawEntry:
      "Had a really productive morning workout session. The endorphins are flowing! Made healthy choices for meals and got through my entire to-do list. Small wins add up!",
    summarizedEntry: "Great workout and productive day, feeling energized",
    moodScore: "85",
    createdAt: subDays(new Date(), 4),
  },
  {
    rawEntry:
      "Mixed feelings today. Started great with a team success, but then got some challenging feedback in the afternoon review. Working on staying balanced and using the feedback constructively.",
    summarizedEntry: "Balancing success and constructive criticism",
    moodScore: "60",
    createdAt: subDays(new Date(), 5),
  },
  {
    rawEntry:
      "Spent the evening learning a new programming language. It's challenging but exciting to push my boundaries. The small victories when solving problems are so satisfying!",
    summarizedEntry: "Learning new skills, embracing the challenge",
    moodScore: "80",
    createdAt: subDays(new Date(), 6),
  },
  {
    rawEntry:
      "Feeling stuck in a rut. Same routine, same challenges, same everything. Need to find ways to shake things up and reignite my motivation. Maybe it's time for a change.",
    summarizedEntry: "Feeling stagnant, seeking motivation",
    moodScore: "45",
    createdAt: subDays(new Date(), 7),
  },
  {
    rawEntry:
      "Amazing weekend! Went hiking with friends, tried a new restaurant, and had deep conversations under the stars. These are the moments that make life beautiful.",
    summarizedEntry: "Perfect weekend with friends and adventures",
    moodScore: "90",
    createdAt: subDays(new Date(), 8),
  },
  {
    rawEntry:
      "Anxiety is high today. Can't pinpoint exactly why, but everything feels more challenging than usual. Trying to practice mindfulness and take deep breaths.",
    summarizedEntry: "Managing anxiety, focusing on self-care",
    moodScore: "30",
    createdAt: subDays(new Date(), 9),
  },
  {
    rawEntry:
      "Found out my project is being showcased at the company all-hands! All those late nights and extra effort are finally paying off. Feeling proud and validated.",
    summarizedEntry: "Project recognition, feeling accomplished",
    moodScore: "88",
    createdAt: subDays(new Date(), 10),
  },
  {
    rawEntry:
      "Just a steady, normal day. Got through my tasks, had lunch with colleagues, and made plans for the weekend. Sometimes ordinary days are just what we need.",
    summarizedEntry: "Comfortable routine, content with simplicity",
    moodScore: "70",
    createdAt: subDays(new Date(), 11),
  },
  {
    rawEntry:
      "Feeling frustrated with my progress on the new feature. Spent hours debugging only to find a simple typo. Tech can be humbling sometimes.",
    summarizedEntry: "Technical challenges testing patience",
    moodScore: "40",
    createdAt: subDays(new Date(), 12),
  },
  {
    rawEntry:
      "Had a breakthrough moment with the architecture design! Sometimes stepping away and coming back with fresh eyes makes all the difference.",
    summarizedEntry: "Technical breakthrough after persistence",
    moodScore: "85",
    createdAt: subDays(new Date(), 13),
  },
  {
    rawEntry:
      "Missing home today. Video called family but it's not the same. The distance feels especially hard during special occasions.",
    summarizedEntry: "Dealing with homesickness and nostalgia",
    moodScore: "35",
    createdAt: subDays(new Date(), 14),
  },
  {
    rawEntry:
      "Completed my first week at the new gym routine! Body is sore but mind is strong. Small steps toward bigger goals.",
    summarizedEntry: "Committed to fitness goals, seeing progress",
    moodScore: "75",
    createdAt: subDays(new Date(), 15),
  },
  // Today's entries
  {
    rawEntry:
      "Morning reflection: Feeling optimistic about the day ahead. The sunrise was beautiful, and I'm ready to tackle my goals.",
    summarizedEntry: "Starting the day with optimism and energy",
    moodScore: "82",
    createdAt: subHours(new Date(), 8),
  },
  {
    rawEntry:
      "Afternoon check-in: Made significant progress on the project, but feeling a bit tired. Going to take a short break to recharge.",
    summarizedEntry: "Productive but needing rest",
    moodScore: "68",
    createdAt: subHours(new Date(), 4),
  },
  {
    rawEntry:
      "Evening reflection: Today had its ups and downs, but overall, I'm grateful for the progress made and lessons learned.",
    summarizedEntry: "Balanced day with gratitude",
    moodScore: "75",
    createdAt: new Date(),
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing entries - intentionally deleting all rows
    await db.delete(journalEntries).execute();
    console.log("Cleared existing entries");

    // Insert new entries
    for (const entry of sampleEntries) {
      await db.insert(journalEntries).values(entry);
    }

    console.log(`✅ Seeded ${sampleEntries.length} journal entries`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

void seed();
