import axiosInstance from "../axiosInstance";

export interface ContactFormData {
  Firstname: string;
  Lastname: string;
  Email: string;
  Mobile: string;
  Message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  timestamp?: string;
}

/**
 * Submit contact form as JSON
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  const res = await axiosInstance.post("/home/submit", formData);
  return res.data;
};