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

export interface AdminSettings {
  orgName: string;

  about: string;
  mission: string;
  vision: string;
  ideology: string;

  contact: {
    location: string;
    email: string;
    phone: string;
  };

  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AdminSettingsResponse {
  success: boolean;
  data: AdminSettings;
}


/**
 * Submit contact form as JSON
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  const res = await axiosInstance.post("/home/submit", formData);
  return res.data;
};

export const getAdminSettings = async (): Promise<AdminSettings> => {
  const res = await axiosInstance.get<AdminSettingsResponse>(
    "/home/settings"
  );

  return res.data.data;
};