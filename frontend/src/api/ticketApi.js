import axios from "axios";
import API_URL from "../config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const TICKETS_URL = `/tickets`;

export const getTickets = async () => {
  try {
    const response = await axiosInstance.get(TICKETS_URL);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error viewing tickets." };
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await axiosInstance.post(TICKETS_URL, ticketData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error creating tickets." };
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await axiosInstance.get(`${TICKETS_URL}/${id}`);
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || {
        message: `Error taking over the ticket with ID ${id}.`,
      }
    );
  }
};

export const updateTicket = async (id, ticketData) => {
  try {
    const response = await axiosInstance.put(
      `${TICKETS_URL}/${id}`,
      ticketData
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error updating ticket." };
  }
};

export const deleteTicket = async (id) => {
  try {
    await axiosInstance.delete(`${TICKETS_URL}/${id}`);
  } catch (err) {
    throw err.response?.data || { message: "Error deleting ticket." };
  }
}

  export const getTicketsByBoardId = async (boardId) => {
    try {
      const response = await axiosInstance.get(
        `${TICKETS_URL}/by-board/${boardId}`
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || { message: "Error loading board tickets." };
    }
};

export const searchTickets = async (query) => {

  const response = await axiosInstance.get(`${TICKETS_URL}/search?query=${query}`);
  return response.data;
};