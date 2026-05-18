import { Router, type IRouter } from "express";
import { gt, sql, eq } from "drizzle-orm";
import {
  db,
  programsTable,
  eventsTable,
  volunteersTable,
  contactsTable,
  eventRsvpsTable,
  newsletterSubscribersTable,
} from "@workspace/db";
import { GetSummaryStatsResponse, GetAnalyticsDashboardResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/summary", async (req, res): Promise<void> => {
  const now = new Date();

  const [programs, volunteers, contacts, upcomingEvents] = await Promise.all([
    db.select().from(programsTable),
    db.select().from(volunteersTable),
    db.select().from(contactsTable),
    db.select().from(eventsTable).where(gt(eventsTable.eventDate, now)),
  ]);

  const stats = {
    totalPrograms: programs.length,
    totalVolunteers: volunteers.length,
    totalContacts: contacts.length,
    upcomingEventsCount: upcomingEvents.length,
    yearsServing: new Date().getFullYear() - 2018,
  };

  res.json(GetSummaryStatsResponse.parse(stats));
});

router.get("/stats/analytics", async (req, res): Promise<void> => {
  const [rsvpRows, volunteerRows, contactRows, newsletterRows] = await Promise.all([
    // RSVPs per event (all events)
    db
      .select({
        eventId: eventsTable.id,
        eventTitle: eventsTable.title,
        eventDate: eventsTable.eventDate,
        rsvpCount: sql<number>`cast(count(${eventRsvpsTable.id}) as int)`,
        totalGuests: sql<number>`cast(coalesce(sum(${eventRsvpsTable.guestCount}), 0) as int)`,
      })
      .from(eventsTable)
      .leftJoin(eventRsvpsTable, eq(eventRsvpsTable.eventId, eventsTable.id))
      .groupBy(eventsTable.id, eventsTable.title, eventsTable.eventDate)
      .orderBy(eventsTable.eventDate),

    // Volunteers by month
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${volunteersTable.createdAt}), 'YYYY-MM')`,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(volunteersTable)
      .groupBy(sql`date_trunc('month', ${volunteersTable.createdAt})`)
      .orderBy(sql`date_trunc('month', ${volunteersTable.createdAt})`),

    // Contacts by month
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${contactsTable.createdAt}), 'YYYY-MM')`,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(contactsTable)
      .groupBy(sql`date_trunc('month', ${contactsTable.createdAt})`)
      .orderBy(sql`date_trunc('month', ${contactsTable.createdAt})`),

    // Newsletter subscribers by month
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${newsletterSubscribersTable.createdAt}), 'YYYY-MM')`,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(newsletterSubscribersTable)
      .groupBy(sql`date_trunc('month', ${newsletterSubscribersTable.createdAt})`)
      .orderBy(sql`date_trunc('month', ${newsletterSubscribersTable.createdAt})`),
  ]);

  // Merge volunteers + contacts into a unified month timeline
  const monthSet = new Set([
    ...volunteerRows.map((r) => r.month),
    ...contactRows.map((r) => r.month),
  ]);
  const sortedMonths = Array.from(monthSet).sort();
  const volMap = Object.fromEntries(volunteerRows.map((r) => [r.month, r.count]));
  const conMap = Object.fromEntries(contactRows.map((r) => [r.month, r.count]));
  const signupsByMonth = sortedMonths.map((month) => ({
    month,
    volunteers: volMap[month] ?? 0,
    contacts: conMap[month] ?? 0,
  }));

  // Newsletter with cumulative total
  let cumulative = 0;
  const newsletterByMonth = newsletterRows.map((r) => {
    cumulative += r.count;
    return { month: r.month, subscribers: r.count, cumulative };
  });

  const dashboard = {
    rsvpsByEvent: rsvpRows.map((r) => ({
      ...r,
      eventDate: r.eventDate.toISOString(),
    })),
    signupsByMonth,
    newsletterByMonth,
  };

  res.json(GetAnalyticsDashboardResponse.parse(dashboard));
});

export default router;
