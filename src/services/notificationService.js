import { apiClient } from "../api/apiClient";

export const getAllNotification = async (userID) => {
    try {
        const response = await apiClient(`/api/notification/notify/${userID}`, { method: 'GET' });
        return response.data || response;
    } catch (error) {
        console.log("Error fetching Notifications:", error);
        throw error;
    }
}

export const markAsReadNotify = async (id) => {
    try {
        const response = await apiClient(`/api/notification/readNotify/${id}`, { method: 'PUT' });
        return response.data || response;
    } catch (error) {
        console.log("Error fetching Notifications:", error);
        throw error;
    }
}

export const deleteNotify = async (id) => {
    try {
        const response = await apiClient(`/api/notification/deleteNotify/${id}`, { method: 'DELETE' });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
}

export const createNotification = async (notificationData) => {
    try {
        const response = await apiClient('/api/notification/createNotify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationData),

        });
        return response;
    } catch (error) {
        console.log("Error creating notification:", error);
        throw error;
    }
}
