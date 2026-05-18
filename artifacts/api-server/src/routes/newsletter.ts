import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, newsletterSubscribersTable } from "@workspace/db";
import {
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
  ListNewsletterSubscribersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, firstName } = parsed.data;

  const existing = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email.toLowerCase().trim()));

  if (existing.length > 0) {
    res.json(
      SubscribeNewsletterResponse.parse({
        success: true,
        message: "You are already subscribed — thank you!",
        alreadySubscribed: true,
      })
    );
    return;
  }

  await db.insert(newsletterSubscribersTable).values({
    email: email.toLowerCase().trim(),
    firstName: firstName ?? null,
    active: true,
  });

  res.json(
    SubscribeNewsletterResponse.parse({
      success: true,
      message: "Thank you for subscribing!",
      alreadySubscribed: false,
    })
  );
});

router.get("/newsletter/subscribers", async (req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(desc(newsletterSubscribersTable.createdAt));
  res.json(ListNewsletterSubscribersResponse.parse(subscribers));
});

export default router;
