import { apiClient } from "../api/apiClient"

export const createNewReport = async (reportData, userId) => {

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('locationInfo', JSON.stringify(reportData.locationInfo));
    formData.append('incidentInfo', JSON.stringify(reportData.incidentInfo));
    formData.append('personalInfo', JSON.stringify(reportData.personalInfo));

    if (reportData.evidences && reportData.evidences.length > 0) {
        reportData.evidences.forEach((uri, index) => {
            const file = {
                uri: uri,
                type: 'image/jpeg',
                name: `evidence_${index}.jpg`
            };
            formData.append('evidence', file);
        })
    }


    console.log("Sending FormData with:", {
        userId: userId,
        location: reportData.locationInfo,
        incident: reportData.incidentInfo,
        personal: reportData.personalInfo,
        evidenceCount: reportData.evidences?.length || 0
    });


    return await apiClient("/api/report/create", {
        method: "POST",
        body: formData
    });
};

export const getIncidentType = async () => {

    try {
        const response = await apiClient("/api/report/incidentType");
        return response.data || response;
    } catch (error) {
        console.log("Error fetching incident Types:", error);
        throw error;
    }
}

export const getAllReports = async (userId) => {
    try {
        console.log(userId);
        const response = await apiClient(`/api/report/getReports/${userId}`);
        return response.data || response;
    } catch (error) {
        console.log("Error fetching incident Types:", error);
        throw error;
    }
}

export const getAllSubmittedReports = async () => {
    try {
        const response = await apiClient("/api/report/getAllReports");
        return response.data || response;
    } catch (error) {
        console.log("Error fetching  All reports:", error);
        throw error;
    }
}

export const updateStatus = async (reportid, newStatus) => {
    try {
        const response = await apiClient(`/api/report/reportAction/${reportid}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus }),
            });
        return await response;


    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    try {
        const response = await apiClient(`/api/report/deleteReport/${reportId}`, { method: 'DELETE' });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
}





export const updateReport = async (reportData, reportId) => {

    const formData = new FormData();

    formData.append('locationInfo', JSON.stringify(reportData.locationInfo || {}));
    formData.append('incidentInfo', JSON.stringify(reportData.incidentInfo || {}));
    formData.append('personalInfo', JSON.stringify(reportData.personalInfo || {}));

    if (reportData.evidences && reportData.evidences.length > 0) {
        reportData.evidences.forEach((uri, index) => {
            const file = {
                uri: uri,
                type: 'image/jpeg',
                name: `evidence_${index}.jpg`
            };
            formData.append('evidence', file);
        })
    }


    console.log("Sending FormData with:", {
        location: reportData.locationInfo,
        incident: reportData.incidentInfo,
        personal: reportData.personalInfo,
        evidenceCount: reportData.evidences?.length || 0
    });


    return await apiClient(`/api/report/updateReport/${reportId}`, {
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" }
    });
};
