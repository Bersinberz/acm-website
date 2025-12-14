import { Request, Response } from "express";
import Member from "../models/Member";
import Event from "../models/events";
import Recruitment from "../models/recruitments";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    /* ---------------- DATE SETUP ---------------- */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* ---------------- MEMBERS ---------------- */
    const totalMembers = await Member.countDocuments();

    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name createdAt")
      .lean();

    /* ---------------- EVENTS ---------------- */
    const events = await Event.find({
      display: true,
      isClosed: false,
    })
      .select("name date time venue contactPersons createdAt")
      .lean();

    let ongoingEvents = 0;
    let upcomingEvents = 0;
    const upcomingList: any[] = [];

    events.forEach((e) => {
      const eventDate = new Date(`${e.date}T00:00:00`);

      if (eventDate.getTime() === today.getTime()) {
        ongoingEvents++;
      } else if (eventDate > today) {
        upcomingEvents++;
        upcomingList.push(e);
      }
    });

    const latestEvent =
      upcomingList.length > 0
        ? upcomingList.sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0]
        : null;

    /* ---------------- EVENT ANALYTICS (LAST 6 MONTHS) ---------------- */
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const eventTrendsRaw = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          events: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const eventTrends = eventTrendsRaw.map((e) => ({
      month: monthNames[e._id - 1],
      events: e.events,
    }));

    /* ---------------- RECRUITMENTS ---------------- */
    const ongoingRecruitments = await Recruitment.find({ isOpen: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("title role createdAt")
      .lean();

    const recentRecruitments = await Recruitment.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title role createdAt")
      .lean();

    /* ---------------- RECENT EVENTS (ONLY 3) ---------------- */
    const recentEvents = events
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 3)
      .map((e) => ({
        type: "event",
        title: e.name,
        subtitle: "Event scheduled",
        time: e.createdAt,
      }));

    /* ---------------- RECENT ACTIVITY ---------------- */
    const recentActivity = [
      ...recentEvents,
      ...recentRecruitments.map((r) => ({
        type: "recruitment",
        title: r.title,
        subtitle: `Role: ${r.role}`,
        time: r.createdAt,
      })),
      ...recentMembers.map((m) => ({
        type: "member",
        title: m.name,
        subtitle: "Joined the chapter",
        time: m.createdAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      )
      .slice(0, 5);

    /* ---------------- RESPONSE ---------------- */
    res.status(200).json({
      stats: {
        totalMembers,
        totalEvents: events.length,
        ongoingEvents,
        upcomingEvents,
      },
      latestEvent,
      eventTrends,
      ongoingRecruitments,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const syncDashboardData = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Dashboard synced" });
  } catch (err) {
    res.status(500).json({ message: "Sync failed" });
  }
};