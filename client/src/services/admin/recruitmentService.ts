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

/* ---------------- API CALLS ---------------- */

// Get all recruitments
export const getAllRecruitments = async () => {
  const res = await axiosInstance.get("/admin/recruitments/getall");
  return res.data;
};

// Create recruitment
export const createRecruitment = async (payload: RecruitmentPayload) => {
  const res = await axiosInstance.post("/admin/recruitments/add", payload);
  return res.data; // created recruitment
};

// Update recruitment
export const updateRecruitment = async (
  id: string,
  payload: RecruitmentPayload
) => {
  const res = await axiosInstance.put(`/admin/recruitments/${id}/update`, payload);
  return res.data;
};

// Delete recruitment
export const deleteRecruitment = async (id: string) => {
  const res = await axiosInstance.delete(`/admin/recruitments/${id}/delete`);
  return res.data;
};

// Toggle open / close
export const toggleRecruitmentStatus = async (
  id: string,
  isOpen: boolean
) => {
  const res = await axiosInstance.patch(
    `/admin/recruitments/${id}/status`,
    { isOpen }
  );
  return res.data;
};
