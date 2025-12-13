import express from "express";
import { addEvent, deleteEvent, getAllEvents, toggleEventDisplay, updateEvent } from "../controllers/eventController";

const router = express.Router();

router.post("/add", addEvent);
router.get("/getAll", getAllEvents)
router.delete("/:id", deleteEvent);
router.put('/:id', updateEvent)
router.put("/:id/display", toggleEventDisplay);

export default router;
