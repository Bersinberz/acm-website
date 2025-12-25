import axiosInstance from "../axiosInstance";

export interface MemberPayload {
    name: string;
    designation: string;
    batch: string;
    profilePic?: File | null;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
}

// ➤ CREATE MEMBER (POST /members)
export const createMember = async (data: MemberPayload) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("batch", data.batch);

    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.facebook) formData.append("facebook", data.facebook);

    if (data.profilePic) {
        formData.append("profilePic", data.profilePic);
    }

    const response = await axiosInstance.post("/admin/members/add", formData);
    return response.data;
};

// ➤ GET ALL MEMBERS (GET /members)
export const getMembers = async () => {
    const response = await axiosInstance.get("/admin/members/getAll");
    return response.data;
};

// ➤ DELETE MEMBER (DELETE /members/:id)
export const deleteMember = async (id: string) => {
    const response = await axiosInstance.delete(`admin/members/${id}`);
    return response.data;
};

// ➤ UPDATE MEMBER (PUT /members/:id)
export const updateMember = async (id: string, data: Partial<MemberPayload>) => {
  const formData = new FormData();

  if (data.name !== undefined) formData.append("name", data.name);
  if (data.designation !== undefined) formData.append("designation", data.designation);
  if (data.batch !== undefined) formData.append("batch", data.batch);

  // 🔑 IMPORTANT PART
  formData.append("linkedin", data.linkedin?.trim() || "");
  formData.append("instagram", data.instagram?.trim() || "");
  formData.append("facebook", data.facebook?.trim() || "");

  if (data.profilePic instanceof File) {
    formData.append("profilePic", data.profilePic);
  }

  const response = await axiosInstance.put(`admin/members/${id}`, formData);
  return response.data;
};
