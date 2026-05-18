import { Router, type IRouter } from "express";
import { asc, eq, gt } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import {
  CreateEventBody,
  ListEventsResponse,
  ListEventsResponseItem,
  ListUpcomingEventsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events", async (req, res): Promise<void> => {
  const events = await db.select().from(eventsTable).orderBy(asc(eventsTable.eventDate));
  res.json(ListEventsResponse.parse(events));
});

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [event] = await db.insert(eventsTable).values(parsed.data).returning();
  res.status(201).json(ListEventsResponseItem.parse(event));
});

router.delete("/events/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.status(204).end();
});

router.get("/events/upcoming", async (req, res): Promise<void> => {
  const now = new Date();
  const events = await db
    .select()
    .from(eventsTable)
    .where(gt(eventsTable.eventDate, now))
    .orderBy(asc(eventsTable.eventDate))
    .limit(3);
  res.json(ListUpcomingEventsResponse.parse(events));
});

export default router;
