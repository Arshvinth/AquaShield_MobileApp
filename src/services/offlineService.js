import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

const PENDING_REPORTS_KEY = "pendingReports";

export const saveReportOffline = async (report) => {
    try {
        const existing = JSON.parse(await AsyncStorage.getItem(PENDING_REPORTS_KEY)) || [];
        existing.push(report);
        await AsyncStorage.setItem(PENDING_REPORTS_KEY, JSON.stringify(existing));
        console.log("Report Saved Offline");
    } catch (err) {
        console.error("Error Saving report Offline", err);
    }
};


export const getAllPendingReports = async () => {
    const data = await AsyncStorage.getItem(PENDING_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const clearPendingReports = async () => {
    await AsyncStorage.removeItem(PENDING_REPORTS_KEY);
    console.log("Pending Reports cleared After Sync");
};
