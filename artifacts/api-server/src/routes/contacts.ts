import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import {
  CreateContactBody,
  ListContactsResponse,
  ListContactsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contacts", async (req, res): Promise<void> => {
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(ListContactsResponse.parse(contacts));
});

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [contact] = await db.insert(contactsTable).values(parsed.data).returning();
  res.status(201).json(ListContactsResponseItem.parse(contact));
});

export default router;
