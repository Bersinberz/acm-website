import axiosInstance from "../axiosInstance";

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const adminLogin = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const res = await axiosInstance.post("/admin/auth/login", payload);
  return res.data;
};
