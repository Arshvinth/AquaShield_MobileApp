import { API_BASE_URL } from "../../config"

export const apiClient = async (endpoint, options = {}) => {

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { ...options.headers };

    // ONLY set Content-Type if it's NOT FormData AND not already set
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers["Content-Type"] = "application/json";
    }
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}:${errorText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};