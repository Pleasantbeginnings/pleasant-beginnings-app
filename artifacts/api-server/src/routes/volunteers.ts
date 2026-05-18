import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, volunteersTable } from "@workspace/db";
import {
  CreateVolunteerBody,
  ListVolunteersResponse,
  ListVolunteersResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/volunteers", async (req, res): Promise<void> => {
  const volunteers = await db.select().from(volunteersTable).orderBy(desc(volunteersTable.createdAt));
  res.json(ListVolunteersResponse.parse(volunteers));
});

router.post("/volunteers", async (req, res): Promise<void> => {
  const parsed = CreateVolunteerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [volunteer] = await db.insert(volunteersTable).values(parsed.data).returning();
  res.status(201).json(ListVolunteersResponseItem.parse(volunteer));
});

export default router;
