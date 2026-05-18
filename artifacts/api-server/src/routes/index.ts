import { Router, type IRouter } from "express";
import healthRouter from "./health";
import programsRouter from "./programs";
import eventsRouter from "./events";
import eventRsvpsRouter from "./event-rsvps";
import volunteersRouter from "./volunteers";
import contactsRouter from "./contacts";
import statsRouter from "./stats";
import newsletterRouter from "./newsletter";
import storiesRouter from "./stories";
import galleryRouter from "./gallery";
import storageRouter from "./storage";

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
