import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface RecruitmentPayload {
  title: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}
/* ---------------- API CALL ---------------- */

/**
 * Fetch all recruitments
 */
export const getAllRecruitments = async () => {
  const res = await axiosInstance.get("/joinus/getall");
  return res.data;
};