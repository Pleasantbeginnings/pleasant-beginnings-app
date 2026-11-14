import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import programsRouter from "./programs.js";
import eventsRouter from "./events.js";
import eventRsvpsRouter from "./event-rsvps.js";
import volunteersRouter from "./volunteers.js";
import contactsRouter from "./contacts.js";
import statsRouter from "./stats.js";
import newsletterRouter from "./newsletter.js";
import storiesRouter from "./stories.js";
import galleryRouter from "./gallery.js";
import storageRouter from "./storage.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(programsRouter);
router.use(eventsRouter);
router.use(eventRsvpsRouter);
router.use(volunteersRouter);
router.use(contactsRouter);
router.use(statsRouter);
router.use(newsletterRouter);
router.use(storiesRouter);
router.use(galleryRouter);

export default router;
