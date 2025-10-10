import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import ReportCard from '../../components/ui/ReportCard';
import TabNavigation from '../../components/ui/TabNavigation';
import ReportOptions from '../../components/ui/ReportOptions';
import { deleteReport, getAllReports } from '../../src/services/reportService';
import ReportDetails from '../../components/ui/ReportDetails';

export default function MyReport() {

    const [activeTab, setActiveTab] = useState('All');
    const [selectReport, setSelectReport] = useState(null);
    const [reportPosition, setReportPosition] = useState({ x: 0, y: 0 });
    const [showOption, setShowOption] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReportDetails, setShowReportDetails] = useState(null);

    const img = require('../../assets/reportimg.jpg');
    const [report, setReports] = useState([]);

    const tabs = ['All', 'PENDING', 'VERIFIED', 'REJECT'];

    const filtereReports = activeTab === 'All' ? report : report.filter(rept => rept.status === activeTab);

    const hanldeTabChange = (tab) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        fetchMyReport();
    }, []);

    const handleLongPress = (report, event) => {
        const { pageX, pageY } = event.nativeEvent;
        setSelectReport(report);
        setReportPosition({ x: pageX, y: pageY });
        setShowOption(true);
    }

    const handleUpdate = () => {
        setShowOption(false);
        Alert.alert(
            "update Report",
            `Update report #${selectReport.id}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update', onPress: () => {
                        Alert.alert('Success', 'Report update initiated');
                    }
                },
            ]
        );
    };

    const fetchMyReport = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching incident types...');
            const types = await getAllReports();
            console.log('Received incident types:', types);
            setReports(types);
        } catch (err) {
            console.log('Failed to fetch incident types', err);
            setError('Failed to Load incident types');
        } finally {
            setLoading(false);
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

    const handleDelete = () => {
        setShowOption(false);
        Alert.alert(
            'Delete Report',
            `Are you sure you want to delete report #${selectReport._id}?`,
            [
                { text: 'Cancel', style: "cancel" },
                {
                    text: 'Delete',
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteReport(selectReport._id);
                            Alert.alert('Success', "Report Deleted Successfully");
                            fetchMyReport();
                        } catch (err) {
                            console.log('Delete error:', err);
                            Alert.alert('Error', err.message || 'Failed to delete report');
                        } finally {
                            setLoading(false);
                        }

                    }
                }
            ]
        )
    };
    if (loading) {
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
                                    <ReportCard
                                        key={rept._id}
                                        report={rept}
                                        onPress={() => {
                                            console.log('Pressed report:', rept);
                                            setShowReportDetails(rept)
                                        }}
                                        onLongPress={(event) => handleLongPress(rept, event)} />
                                ))) : (
                                <View style={styles.emptymsg}>
                                    <Text style={styles.emptyText}>
                                        {getEmptyMessage()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </>
            )}


            <ReportOptions
                visible={showOption}
                onClose={() => setShowOption(false)}
                position={reportPosition}
                selectedReport={selectReport}
                onUpdate={handleUpdate}
                onDelete={handleDelete} />
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