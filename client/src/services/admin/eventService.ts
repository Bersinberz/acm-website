import axiosInstance from "../axiosInstance";

/* Types matching frontend */
interface ContactPerson {
  name: string;
  phone: string;
}

export interface CreateEventPayload {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  whatsappGroupLink?: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

/**
 * Create a new event
 */
export const createEvent = async (payload: CreateEventPayload) => {
  const response = await axiosInstance.post(
    "admin/eventmanager/add",   
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Get all events
 */
export const getAllEvents = async () => {
  const response = await axiosInstance.get("admin/eventmanager/getAll");
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await axiosInstance.delete(
    `admin/eventmanager/${id}`
  );
  return response.data;
};

export const updateEvent = async (
  id: string,
  payload: UpdateEventPayload
) => {
  const response = await axiosInstance.put(
    `admin/eventmanager/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const toggleEventDisplay = async (
  id: string,
  display: boolean
) => {
  const response = await axiosInstance.put(
    `admin/eventmanager/${id}/display`,
    { display },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};