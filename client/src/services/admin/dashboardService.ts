import axiosInstance from "../axiosInstance";

export interface DashboardResponse {
    stats: {
        totalMembers: number;
        totalEvents: number;
        ongoingEvents: number;
        upcomingEvents: number;
    };

    latestEvent: {
        _id: string;
        name: string;
        date: string;
        time: string;
        venue: string;
        contactPersons?: { name: string; phone: string }[];
    } | null;

    eventTrends: {
        month: string;
        events: number;
    }[];

    ongoingRecruitments: {
        _id: string;
        title: string;
        role: string;
        createdAt: string;
    }[];

    recentActivity: {
        type: "member" | "recruitment" | "event";
        title: string;
        subtitle: string;
        time: string;
    }[];
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
    const res = await axiosInstance.get("/admin/dashboard/getData");
    return res.data;
};

export const syncDashboard = async () => {
  return axiosInstance.post("/admin/dashboard/sync");
};