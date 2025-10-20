import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/report`;

// Axios instance (optional but clean)
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
});

// Fetch all reports
export const getAllReports = async () => {
  try {
    const { data } = await api.get("/all-reports");
    return data;
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    throw error;
  }
};

// Fetch single report by ID
export const getReportById = async (id) => {
  try {
    const { data } = await api.get(`/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error.message);
    throw error;
  }
};

// Fetch recent reports for dashboard
export const getRecentReports = async () => {
  try {
    const { data } = await api.get("/recent");
    return data;
  } catch (error) {
    console.error("Error fetching recent reports:", error.message);
    throw error;
  }
};

// Fetch trend data for charts
export const getTrendData = async () => {
  try {
    const { data } = await api.get("/trends");
    return data;
  } catch (error) {
    console.error("Error fetching trend data:", error.message);
    throw error;
  }
};

// Fetch species data for filters
export const getSpeciesData = async () => {
  try {
    const { data } = await api.get("/species");
    return data;
  } catch (error) {
    console.error("Error fetching species data:", error.message);
    throw error;
  }
};

// Fetch monthly statistics for dashboard
export const getMonthlyStats = async () => {
  try {
    const { data } = await api.get("/monthly-stats");
    return data;
  } catch (error) {
    console.error("Error fetching monthly stats:", error.message);
    throw error;
  }
};

// Fetch frequency data for reports
export const getFrequencyData = async () => {
  try {
    const { data } = await api.get("/frequency");
    return data;
  } catch (error) {
    console.error("Error fetching frequency data:", error.message);
    throw error;
  }
};

// Fetch status data for reports
export const getStatusData = async () => {
  try {
    const { data } = await api.get("/status");
    return data;
  } catch (error) {
    console.error("Error fetching status data:", error.message);
    throw error;
  }
};

// Fetch key metrics for statistics overview
export const getKeyMetrics = async () => {
  try {
    const { data } = await api.get("/key-metrics");
    return data;
  } catch (error) {
    console.error("Error fetching key metrics:", error.message);
    throw error;
  }
};

// Fetch hotspot data for maps and statistics
export const getHotspots = async () => {
  try {
    const { data } = await api.get("/hotspots");
    return data;
  } catch (error) {
    console.error("Error fetching hotspots data:", error.message);
    throw error;
  }
};

// Update report status
export const updateReportStatus = async (id, status) => {
  try {
    const { data } = await api.put(`/updateStatus/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Failed to update report status:", error.message);
    throw error;
  }
};
