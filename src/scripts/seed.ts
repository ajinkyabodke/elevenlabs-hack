import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { subDays } from "date-fns";
import { eq } from "drizzle-orm";

const sampleEntries = [
  {
    title: "Major Career Milestone: Leading the AI Initiative",
    rawEntry: "Excited about new role leading AI team...",
    summarizedEntry:
      "Today marked a transformative moment in my career as I officially took the helm of our company's new AI initiative. The responsibility is immense, but the team's enthusiasm is contagious. We've already mapped out an ambitious roadmap for the next quarter, and the executive team's trust in my leadership feels both humbling and energizing. This role represents everything I've worked towards in my career.",
    moodScore: "95",
    significantEvents: ["Promoted to AI Team Lead"],
    createdAt: subDays(new Date(), 352), // About a year ago
  },
  {
    title: "Wedding Day Reflections",
    rawEntry: "Best day of my life...",
    summarizedEntry:
      "Still floating on cloud nine after yesterday's wedding. Everything came together perfectly - from the intimate ceremony in the garden to the heartfelt speeches at the reception. Sarah looked absolutely radiant, and seeing both our families come together filled my heart with joy. The moment we exchanged vows under the setting sun felt like time stood still. Beginning this new chapter of our lives together feels surreal and wonderful.",
    moodScore: "98",
    significantEvents: ["Got married to Sarah"],
    createdAt: subDays(new Date(), 280), // About 9 months ago
  },
  {
    title: "First Home Purchase!",
    rawEntry: "Keys in hand, dreams coming true...",
    summarizedEntry:
      "Finally closed on our first house today! After months of searching, countless viewings, and a roller coaster of emotions, we found the perfect place to call home. It's a charming three-bedroom in the neighborhood we've always dreamed of, complete with a small garden for our future plans. The moment we got the keys felt surreal. Already planning renovation projects and imagining all the memories we'll create here.",
    moodScore: "92",
    significantEvents: ["Bought first house"],
    createdAt: subDays(new Date(), 185), // About 6 months ago
  },
  {
    title: "Completing the Marathon",
    rawEntry: "26.2 miles of pure determination...",
    summarizedEntry:
      "Six months of training culminated in today's marathon finish. The last few miles were grueling, but crossing that finish line at 3:45:22 made every early morning run and every moment of doubt worth it. The crowd's energy carried me through the tough patches, and seeing Sarah and my parents cheering at various points along the course gave me the extra push I needed. This wasn't just about running - it was about proving to myself that with dedication and perseverance, I can achieve anything I set my mind to.",
    moodScore: "90",
    significantEvents: ["Completed first marathon"],
    createdAt: subDays(new Date(), 92), // About 3 months ago
  },
  {
    title: "Launching the AI Platform",
    rawEntry: "Months of work finally live...",
    summarizedEntry:
      "Today our team successfully launched the AI platform we've been developing for the past six months. The rollout went smoother than expected, with positive feedback already coming in from early users. This project pushed our technical boundaries and proved that our team can deliver world-class solutions. Watching the analytics dashboard light up with the first wave of user interactions was incredibly satisfying. This could be a game-changer for the company.",
    moodScore: "88",
    significantEvents: ["Launched major AI platform"],
    createdAt: subDays(new Date(), 45), // About 1.5 months ago
  },
  {
    title: "Pregnancy News!",
    rawEntry: "Life-changing moment...",
    summarizedEntry:
      "Still processing the amazing news we received this morning at the doctor's office - we're going to be parents! Seeing that first ultrasound was an indescribable feeling. Sarah and I couldn't hold back tears of joy. We've already started discussing names and dreaming about the nursery design. Can't believe we have to keep this secret for a few more weeks, but for now, it's our beautiful little miracle to cherish.",
    moodScore: "99",
    significantEvents: ["Found out we're expecting"],
    createdAt: subDays(new Date(), 15), // Recent
  },
  {
    title: "Evening Reflections",
    rawEntry: "Grateful for life's journey...",
    summarizedEntry:
      "Taking a moment to reflect on how much life has changed in the past year - from career growth to marriage, our new home, and now a baby on the way. Each step has brought its challenges, but they've all led to this incredibly fulfilling point. The journey hasn't always been easy, but it's been more beautiful than I could have imagined. Feeling immensely grateful and excited for what the future holds.",
    moodScore: "85",
    createdAt: new Date(),
  },
];

const newSampleEntries = [
  {
    title: "Struggling with Work-Life Balance",
    rawEntry: "Feeling overwhelmed...",
    summarizedEntry:
      "Today was particularly challenging as I attempted to juggle multiple project deadlines while maintaining some semblance of personal life. The AI platform's success has led to increased responsibilities, and while I'm grateful for the opportunity, I'm finding it increasingly difficult to disconnect from work. Spent three hours in back-to-back meetings discussing implementation strategies with various stakeholders, followed by a lengthy debug session that stretched well into the evening. Sarah's been incredibly understanding, but I can't help feeling guilty about missing our evening walk routine. The pregnancy books are piling up unread on my nightstand, and I'm worried about finding the right balance before the baby arrives. Need to seriously reconsider my time management strategies and perhaps delegate more effectively.",
    moodScore: "45",
    createdAt: new Date(2025, 1, 1),
  },
  {
    title: "Breakthrough in Team Dynamics",
    rawEntry: "Finally seeing progress...",
    summarizedEntry:
      "What started as a potentially contentious day turned into one of our most productive team sessions yet. The morning began with addressing some ongoing tensions regarding project ownership and technical decisions, but through open dialogue and collaborative problem-solving, we emerged stronger than ever. The team's willingness to embrace vulnerability and share their concerns created an atmosphere of trust that led to innovative solutions for our current challenges. We established new communication protocols and agreed on a more transparent decision-making framework. The energy in the room was palpable as we mapped out our next sprint, with everyone contributing meaningful insights. This kind of breakthrough reminds me why I love leading teams - watching individuals come together and create something greater than the sum of their parts is truly remarkable.",
    moodScore: "88",
    createdAt: new Date(2025, 1, 3),
  },
  {
    title: "Health Concerns and Anxiety",
    rawEntry: "Worried about stress levels...",
    summarizedEntry:
      "The persistent headaches returned today, likely a manifestation of mounting stress. My doctor's warning about maintaining lower blood pressure keeps echoing in my mind, especially given the recent project pressures. Attempted to meditate during lunch break but couldn't quiet my racing thoughts about upcoming deliverables and family responsibilities. The irony of developing AI solutions for wellness while struggling with my own well-being isn't lost on me. Sarah noticed my distraction during dinner and suggested we might need to seriously reevaluate our commitments. The pregnancy has made us both more conscious of creating a healthy environment, not just physically but emotionally. Perhaps it's time to have that difficult conversation with leadership about workload distribution and realistic expectations.",
    moodScore: "35",
    createdAt: new Date(2025, 1, 6),
  },
  {
    title: "Unexpected Recognition",
    rawEntry: "A boost when needed most...",
    summarizedEntry:
      "Today brought an unexpected turn of events when our AI platform was featured in a major tech publication. The article highlighted our innovative approach to user experience and data privacy, specifically mentioning several features I had personally championed despite initial skepticism. The team's excitement was contagious, and seeing their pride in our collective achievement momentarily lifted the weight of recent stress. Received congratulatory messages from industry peers and a particularly touching email from our CEO acknowledging the late nights and dedication that went into this project. This recognition couldn't have come at a better time, reminding me why we push through the challenging periods. Sarah surprised me with a small celebration dinner, and for the first time in weeks, I felt truly present and grateful.",
    moodScore: "92",
    createdAt: new Date(2025, 1, 9),
  },
  {
    title: "Missing Important Moments",
    rawEntry: "Guilt and regret...",
    summarizedEntry:
      "Had to miss Sarah's prenatal appointment today due to an urgent system issue that required immediate attention. The disappointment in her voice when I called to cancel was heartbreaking, even though she tried to hide it. Spent the entire day firefighting technical problems while my mind wandered to the ultrasound images I should have been seeing in person. The team eventually resolved the issue, but the victory feels hollow knowing what I sacrificed. Later discovered it was the appointment where they might have revealed the baby's gender, though Sarah sweetly suggested waiting so we could find out together. This pattern of missing personal milestones for work emergencies is becoming increasingly difficult to justify, especially with such a significant life change approaching. The guilt is overwhelming, and I'm struggling to reconcile my professional dedication with my personal priorities.",
    moodScore: "30",
    createdAt: new Date(2025, 1, 12),
  },
  {
    title: "Team Success and Personal Victory",
    rawEntry: "Finding balance...",
    summarizedEntry:
      "Today marked a significant milestone as we successfully implemented the new AI model optimization protocol, resulting in a 40% improvement in processing efficiency. The team's collaborative effort was remarkable, with everyone contributing crucial insights that led to this breakthrough. What made today especially meaningful was managing to achieve this while maintaining reasonable hours - we wrapped up by 5 PM, allowing me to attend the rescheduled prenatal appointment with Sarah. Watching our baby on the ultrasound screen while holding her hand was an indescribable feeling that put everything into perspective. The doctor's positive report about both Sarah and the baby's health filled me with profound relief and joy. Perhaps this is a sign that finding the right balance between professional achievement and personal life isn't impossible after all.",
    moodScore: "95",
    createdAt: new Date(2025, 1, 15),
  },
  {
    title: "Technical Setback",
    rawEntry: "Questioning everything...",
    summarizedEntry:
      "A major bug discovered in our latest deployment has thrown our entire release schedule into chaos. The issue affects core functionality, potentially impacting thousands of users, and the pressure to find a solution is intense. Spent countless hours diving deep into the codebase, reviewing recent changes, and coordinating with the infrastructure team to identify the root cause. The frustration within the team is palpable, with some questioning our recent architectural decisions. As the lead, I feel personally responsible for not catching this during our review process. The weight of leadership feels particularly heavy today, especially when I had to announce that weekend work might be necessary to resolve this. The stress manifested in a tension headache that's made it difficult to focus, and the thought of disappointing both my team and our users is overwhelming.",
    moodScore: "25",
    createdAt: new Date(2025, 1, 18),
  },
  {
    title: "Unexpected Support",
    rawEntry: "Finding strength in community...",
    summarizedEntry:
      "What started as another challenging day took an unexpected turn when the team rallied together to address our ongoing technical issues. Junior developers stepped up with innovative solutions, while senior members provided crucial guidance and support. The collaborative spirit was infectious, leading to several breakthrough moments in debugging our system. A particularly touching moment came when the team surprised me with lunch delivery and insisted I take a proper break. Their gesture of support, combined with their proactive problem-solving, reminded me why I love this team. Later, during our evening standup, we not only identified the root cause of our recent deployment issues but also developed a comprehensive strategy to prevent similar problems in the future. The sense of accomplishment and unity was profound, making the previous days' struggles feel worthwhile.",
    moodScore: "85",
    createdAt: new Date(2025, 1, 21),
  },
  {
    title: "Physical and Mental Exhaustion",
    rawEntry: "Running on empty...",
    summarizedEntry:
      "The cumulative effect of recent weeks has finally caught up with me. Woke up feeling completely drained, both physically and mentally, barely able to focus during morning meetings. The constant context-switching between critical issues, team management, and preparation for parenthood has left me feeling scattered and ineffective. Attempted to work on strategic planning but found myself staring blankly at the screen, unable to form coherent thoughts. Sarah's concerned about my recent sleep patterns and stress levels, noting that I've been talking in my sleep about work problems. The pregnancy books continue to pile up unread, and the nursery remains just an idea rather than a work in progress. The guilt of not being more present and prepared for our growing family weighs heavily, creating a cycle of anxiety that's becoming increasingly difficult to break.",
    moodScore: "28",
    createdAt: new Date(2025, 1, 1),
  },
  {
    title: "Unexpected Mentorship Moment",
    rawEntry: "Finding purpose in guidance...",
    summarizedEntry:
      "Today brought an unexpected shift in perspective when a junior team member sought my advice, not about technical challenges, but about managing work-life balance. The irony wasn't lost on me, given my own recent struggles, but our conversation proved surprisingly therapeutic for both of us. Sharing my experiences, including my failures and lessons learned, helped me articulate and confront my own challenges more clearly. We discussed the importance of setting boundaries, the reality of imperfect solutions, and the continuous journey of professional growth. The genuine appreciation in their eyes when sharing insights from my career journey reminded me of my own early days and the mentors who shaped my path. This interaction sparked a team-wide discussion about sustainable work practices and mental health, leading to several practical suggestions for improving our collective well-being.",
    moodScore: "82",
    createdAt: new Date(2025, 1, 7),
  },
  {
    title: "Project Deadline Pressure",
    rawEntry: "Everything piling up...",
    summarizedEntry:
      "The looming end-of-month deadlines are creating an almost unbearable pressure cooker environment. Multiple critical features need to be completed simultaneously, and the complexity of coordinating different team members' efforts while maintaining code quality is pushing me to my limits. Spent most of the day in crisis mode, jumping between emergency meetings and hands-on debugging sessions. The stress manifested physically with a return of my tension headaches and difficulty concentrating. The pressure is amplified by the knowledge that these features are crucial for our next funding round. Despite the team's best efforts, we're falling behind schedule, and the possibility of missing our targets is becoming a real concern. The weight of responsibility feels particularly heavy today, knowing how many people are depending on our success.",
    moodScore: "32",
    createdAt: new Date(2025, 1, 8),
  },
  {
    title: "Month-End Reflection",
    rawEntry: "Finding perspective...",
    summarizedEntry:
      "As this challenging month draws to a close, took some time to reflect on both the struggles and achievements. Despite the roller coaster of emotions and obstacles, we've made significant progress on multiple fronts. The team has grown stronger through adversity, developing new problem-solving approaches and supporting each other in unprecedented ways. The AI platform's recent recognition has opened doors for exciting future possibilities, and our technical setbacks have ultimately led to more robust solutions. On a personal level, while the balance between work and family life remains a work in progress, the moments of joy with Sarah and our upcoming addition provide a powerful reminder of what truly matters. The journey hasn't been smooth, but perhaps that's what makes the victories, both personal and professional, more meaningful. Looking forward to applying these lessons as we move forward.",
    moodScore: "75",
    createdAt: new Date(2025, 1, 11),
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing entries - intentionally deleting all rows
    await db
      .delete(journalEntries)
      .where(eq(journalEntries.userId, "user_2tOcPIdUQgEKYG0keCLknNv6QSc"));
    console.log("Cleared existing entries");

    // Insert new entries
    for (const entry of sampleEntries) {
      await db.insert(journalEntries).values({
        ...entry,
        userId: "user_2tOcPIdUQgEKYG0keCLknNv6QSc",
      });
    }
    for (const entry of newSampleEntries) {
      await db.insert(journalEntries).values({
        ...entry,
        userId: "user_2tOcPIdUQgEKYG0keCLknNv6QSc",
      });
    }

    console.log(
      `✅ Seeded ${sampleEntries.length + newSampleEntries.length} journal entries`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

void seed();
