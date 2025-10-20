import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    }
    return Promise.reject(error);
  }
);

// Helper to upload with XMLHttpRequest
const uploadWithXHR = (url, formData, token) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: response });
        } catch (e) {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network request failed"));
    xhr.ontimeout = () => reject(new Error("Request timed out"));

    xhr.open("PUT", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.timeout = 30000;
    xhr.send(formData);
  });
};

// Helper to create FormData
const createFormData = (data) => {
  const formData = new FormData();

  if (data.profileImage?.uri) {
    const uri = data.profileImage.uri;
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("profileImage", {
      uri: uri,
      name: filename,
      type: type,
    });
  }

  Object.keys(data).forEach((key) => {
    if (
      key !== "profileImage" &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      formData.append(key, String(data[key]));
    }
  });

  return formData;
};

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  feoLogin: (data) => api.post("/auth/feo-login", data),
  adminLogin: (data) => api.post("/auth/admin-login", data),
  getMe: () => api.get("/auth/me"),

  forgotPassword: (email, userType = "user") => {
    const endpoint =
      userType === "feo"
        ? "/auth/feo-forgot-password"
        : "/auth/forgot-password";
    return api.post(endpoint, { email });
  },

  resetPassword: (resetToken, newPassword, userType = "user") => {
    const endpoint =
      userType === "feo"
        ? `/auth/feo-reset-password/${resetToken}`
        : `/auth/reset-password/${resetToken}`;
    return api.put(endpoint, { newPassword });
  },
};

// User APIs
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
  deleteAccount: () => api.delete("/users/profile"),
  requestDeletion: (reason) => api.post("/users/request-deletion", { reason }),
  cancelDeletionRequest: () => api.delete("/users/cancel-deletion-request"),
};

// FEO APIs
export const feoAPI = {
  createFEO: (data) => api.post("/feo", data),
  getAllFEOs: (params) => api.get("/feo", { params }),
  getFEOById: (id) => api.get(`/feo/${id}`),
  updateFEO: (id, data) => api.put(`/feo/${id}`, data),
  deleteFEO: (id) => api.delete(`/feo/${id}`),
  getFEOProfile: () => api.get("/feo/profile/me"),
  updateFEOProfile: (data) => api.put("/feo/profile/me", data),
  changeFEOPassword: (data) => api.put("/feo/profile/change-password", data),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get("/admin/stats"),

  // UPDATED: Deletion request management with filter support
  getDeletionRequests: (status = "all") =>
    api.get("/admin/deletion-requests", { params: { status } }),
  approveDeletion: (id) => api.put(`/admin/users/${id}/approve-deletion`),
  rejectDeletion: (id) => api.put(`/admin/users/${id}/reject-deletion`),
};

export default api;
