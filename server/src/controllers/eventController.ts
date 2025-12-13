import { Request, Response } from "express";
import Event from "../models/events";

export const addEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      name,
      date,
      time,
      venue,
      description,
      contactPersons,
      registrationQuestions,
      whatsappGroupLink,
    } = req.body;

    // 🔴 Validation
    if (!name || !date || !time || !venue || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const event = await Event.create({
      name,
      date,
      time,
      venue,
      description,
      contactPersons: contactPersons || [],
      registrationQuestions: registrationQuestions || [],
      whatsappGroupLink: whatsappGroupLink ?? null,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Add Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllEvents = async (req: any, res: any) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });

    return res.json({
      success: true,
      events,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};


export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      name,
      date,
      time,
      venue,
      description,
      contactPersons,
      registrationQuestions,
      whatsappGroupLink,
      isActive,
    } = req.body;

    // --- Update only provided fields ---
    if (name !== undefined) event.name = name;
    if (date !== undefined) event.date = date;

    // ✅ CRITICAL FIX: always normalize time
    if (time !== undefined) {
      event.time = String(time).trim();
    }

    if (venue !== undefined) event.venue = venue;
    if (description !== undefined) event.description = description;

    if (Array.isArray(contactPersons)) {
      event.contactPersons = contactPersons;
    }

    if (Array.isArray(registrationQuestions)) {
      event.registrationQuestions = registrationQuestions;
    }

    if (whatsappGroupLink !== undefined) {
      event.whatsappGroupLink = whatsappGroupLink || null;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });

  } catch (error: any) {
    console.error("Update Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const toggleEventDisplay = async (req:any, res:any) => {
  try {
    const { id } = req.params;
    const { display } = req.body;

    if (typeof display !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "`display` must be boolean",
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { display },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Event ${display ? "shown" : "hidden"} successfully`,
      event,
    });
  } catch (error) {
    console.error("Toggle display error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating display",
    });
  }
};