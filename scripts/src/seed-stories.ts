import { db, successStoriesTable } from "@workspace/db";

const stories = [
  {
    name: "Marcus T.",
    role: "Program Graduate, Workforce Development",
    quote: "Pleasant Beginnings gave me more than job skills — they gave me confidence. I walked out with a resume, interview experience, and a job offer within three weeks. TeeLee believed in me before I believed in myself.",
    featured: true,
    active: true,
  },
  {
    name: "Jasmine R.",
    role: "Mother of Two, Housing Stability Program",
    quote: "We were facing eviction and didn't know where to turn. The team connected us with resources I didn't even know existed. My family is stable now, and my kids are thriving. I'm forever grateful.",
    featured: true,
    active: true,
  },
  {
    name: "DeShawn M.",
    role: "Youth Leadership Participant",
    quote: "I used to skip school every day. After joining the youth program, I had somewhere to be, people who cared, and goals I actually wanted to reach. I graduated on time and I'm the first in my family going to college.",
    featured: true,
    active: true,
  },
  {
    name: "Tonya B.",
    role: "Community Member",
    quote: "The mental health sessions changed my life. I was carrying so much and didn't realize it. This organization treats you like family, not a case number.",
    featured: false,
    active: true,
  },
  {
    name: "Kevin & Sandra L.",
    role: "Volunteer, Financial Literacy Workshop",
    quote: "We came to the financial literacy workshop not knowing what to expect. Now we have a savings plan, our credit has improved, and we finally feel in control of our future.",
    featured: false,
    active: true,
  },
  {
    name: "Aaliyah P.",
    role: "Creative Economy Program, Class of 2023",
    quote: "I started a small business selling my art after completing the creative economy program. Pleasant Beginnings taught me how to value my work and present it to the world.",
    featured: false,
    active: true,
  },
];

const result = await db.insert(successStoriesTable).values(stories).onConflictDoNothing().returning();
console.log(`Seeded ${result.length} success stories`);
process.exit(0);
