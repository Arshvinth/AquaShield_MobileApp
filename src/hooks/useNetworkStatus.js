import React, { useState, useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { clearPendingReports, getAllPendingReports } from '../services/offlineService';
import { createNewReport } from '../services/reportService';

export default function useNetworkStatus() {

    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unSubscribe = NetInfo.addEventListener(async (state) => {

            if (state.isConnected) {
                console.log("Back Online-Syncing reports...");
                const pending = await getAllPendingReports();
                for (const report of pending) {
                    try {
                        await createNewReport(report);
                    } catch (err) {
                        console.log("Sync Failed for a report", err);
                        return;
                    }
                }
                await clearPendingReports();
                console.log("All pending reports synced successfully!")
            }
        })
        return () => unSubscribe();
    }, []);
};
