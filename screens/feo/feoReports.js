import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { getAllSubmittedReports } from '../../src/services/reportService';
import { createNotification } from '../../src/services/notificationService';
import FeoReportCard from '../../components/ui/feoReportCard';
import ReportDetails from '../../components/ui/ReportDetails';
import TabNavigation from '../../components/ui/TabNavigation';

export default function feoReports() {

    const [activeTab, setActiveTab] = useState('PENDING');
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectReport, setSelectReport] = useState(null);
    const [showReportDetails, setShowReportDetails] = useState(null);

    const tabs = ['All', 'PENDING', 'VERIFIED', 'REJECT'];

    const filtereReports = activeTab === 'All' ? reports : reports.filter(rept => rept.status === activeTab);

    const hanldeTabChange = (tab) => {
        setActiveTab(tab);
    }
    useEffect(() => {

        const sendNotification = async () => {
            try {
                const notificationData = {
                    title: "Accessing FEO Report Section",
                    message: "You have successfully accessed to the Report Section",
                };

                console.log("Sending notification:", notificationData);
                await createNotification(notificationData);
            } catch (error) {
                console.error("Failed to send notification:", error);
            }
        };
        sendNotification();
        fetchUserReport();

    }, []);

    const fetchUserReport = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching All users Reports...');
            const types = await getAllSubmittedReports();
            console.log('Recived Reports', types);
            setReports(types);
        } catch (err) {
            console.log('Failed to fetch reports', err);
        } finally {
            setIsLoading(false);
        }
    }
    const getEmptyMessage = () => {

        switch (activeTab) {
            case 'PENDING':
                return 'No pending reports found';
            case 'VERIFIED':
                return 'No verified reports found';
            case 'REJECT':
                return 'No reject reports found';
            default:
                return 'No report found';
        }
    };

    const handleStatusUpdate = () => {
        console.log("Refreshing Reports");
        fetchUserReport();
    }

    if (isLoading) {
        return (


            <View style={[styles.mainLoader, styles.centerContent]}>
                <ActivityIndicator size="large" color="#146C94" />
                <Text style={styles.loadingText}>Loading reports...</Text>
            </View>
        );
    };
    return (
        <View style={styles.mainContainer}>
            {showReportDetails ? (
                <ReportDetails
                    report={showReportDetails}
                    onBack={() => setShowReportDetails(null)}
                />
            ) : (
                <>

                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={hanldeTabChange}
                        tabs={tabs} />
                    <ScrollView style={styles.scrollView}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {filtereReports.length > 0 ? (
                                filtereReports.map((rept) => (
                                    <FeoReportCard
                                        key={rept._id}
                                        report={rept}
                                        onPress={() => {
                                            console.log('Pressed report:', rept);
                                            setShowReportDetails(rept)
                                        }}
                                        onStatusUpdate={handleStatusUpdate} />
                                ))) : (
                                <View style={styles.emptymsg}>
                                    <Text style={styles.emptyText}>
                                        {getEmptyMessage()}
                                    </Text>
                                </View>
                            )
                            }
                        </View>
                    </ScrollView>
                </>
            )}


        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollView: {
        flex: 1
    },
    mainLoader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200
    },
    emptymsg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 180
    },
    emptyText: {
        textAlign: "center",
        color: "#146C94",
        fontSize: 16

    }
})