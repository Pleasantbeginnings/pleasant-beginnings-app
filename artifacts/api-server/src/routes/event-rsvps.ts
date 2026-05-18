import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, eventRsvpsTable } from "@workspace/db";
import {
  CreateEventRsvpBody,
  ListEventRsvpsResponseItem,
  ListEventRsvpsResponse,
  GetEventRsvpCountResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events/:id/rsvps", async (req, res): Promise<void> => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rsvps = await db
    .select()
    .from(eventRsvpsTable)
    .where(eq(eventRsvpsTable.eventId, eventId));
  res.json(ListEventRsvpsResponse.parse(rsvps));
});

router.post("/events/:id/rsvps", async (req, res): Promise<void> => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = CreateEventRsvpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [rsvp] = await db
      .insert(eventRsvpsTable)
      .values({ ...parsed.data, eventId, guestCount: parsed.data.guestCount ?? 1 })
      .returning();
    res.status(201).json(ListEventRsvpsResponseItem.parse(rsvp));
  } catch (err: unknown) {
    const pg = err as { code?: string };
    if (pg.code === "23505") {
      res.status(409).json({ error: "You have already RSVP'd for this event with that email address." });
      return;
    }
    throw err;
  }
});

router.get("/events/:id/rsvp-count", async (req, res): Promise<void> => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db
    .select({
      rsvpCount: sql<number>`cast(count(*) as int)`,
      totalGuests: sql<number>`cast(coalesce(sum(${eventRsvpsTable.guestCount}), 0) as int)`,
    })
    .from(eventRsvpsTable)
    .where(eq(eventRsvpsTable.eventId, eventId));

  res.json(
    GetEventRsvpCountResponse.parse({
      eventId,
      rsvpCount: row?.rsvpCount ?? 0,
      totalGuests: row?.totalGuests ?? 0,
    })
  );
});

export default router;
