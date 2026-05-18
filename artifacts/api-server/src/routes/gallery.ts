import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import { CreateGalleryImageBody, ListGalleryResponse, ListGalleryResponseItem } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryTable)
    .where(eq(galleryTable.active, true))
    .orderBy(galleryTable.createdAt);
  res.json(ListGalleryResponse.parse(images));
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [image] = await db.insert(galleryTable).values({
    objectPath: parsed.data.objectPath,
    caption: parsed.data.caption ?? "",
    category: parsed.data.category ?? "General",
  }).returning();
  res.status(201).json(ListGalleryResponseItem.parse(image));
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(galleryTable).where(eq(galleryTable.id, id));
  res.status(204).end();
});

export default router;
