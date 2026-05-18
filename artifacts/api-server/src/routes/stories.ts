import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, successStoriesTable } from "@workspace/db";
import { CreateSuccessStoryBody, ListSuccessStoriesResponseItem } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stories", async (req, res): Promise<void> => {
  const stories = await db
    .select()
    .from(successStoriesTable)
    .where(eq(successStoriesTable.active, true))
    .orderBy(desc(successStoriesTable.featured), desc(successStoriesTable.createdAt));
  res.json(stories);
});

router.post("/stories", async (req, res): Promise<void> => {
  const parsed = CreateSuccessStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [story] = await db
    .insert(successStoriesTable)
    .values({
      name: parsed.data.name,
      role: parsed.data.role ?? null,
      quote: parsed.data.quote,
      featured: parsed.data.featured ?? false,
      active: parsed.data.active ?? true,
    })
    .returning();
  res.status(201).json(ListSuccessStoriesResponseItem.parse(story));
});

router.delete("/stories/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(successStoriesTable).where(eq(successStoriesTable.id, id));
  res.status(204).send();
});

export default router;
