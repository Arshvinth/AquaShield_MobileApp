import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/species`;

// Axios instance (optional but clean)
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
});

// Fetch all species
export const getAllSpecies = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/getAllSpecies`);
    return data;
  } catch (error) {
    console.error("Error fetching species:", error);
    throw error;
  }
};

// Fetch species by ID
export const getSpeciesById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching species ${id}:`, error);
    throw error;
  }
};

// Fetch species status for dashboard
export const getSpeciesStats = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/stats`);
    return data;
  } catch (error) {
    console.error("Error fetching species status:", error);
    throw error;
  }
};
