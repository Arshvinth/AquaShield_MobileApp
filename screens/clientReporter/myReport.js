import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import ReportCard from '../../components/ui/ReportCard';
import TabNavigation from '../../components/ui/TabNavigation';

export default function MyReport() {

    const [activeTab, setActiveTab] = useState('All');
    const [selectReport, setSelectReport] = useState(null);
    const [reportPosition, setReportPosition] = useState({ x: 0, y: 0 });
    const [showOption, setShowOption] = useState(false);

    const img = require('../../assets/reportimg.jpg');
    const [report, setReports] = useState([
        {
            id: 1,
            location: 'Kolluptiya',
            date: '09.09.2025',
            status: 'Pending',
            type: 'Illegal Fish Trade',
            uri: img,
        },
        {
            id: 2,
            location: 'Kolluptiya',
            date: '09.09.2025',
            status: 'Verified',
            type: 'Illegal Fish Trade',
            uri: img,
        },
        {
            id: 3,
            location: 'Kolluptiya',
            date: '09.09.2025',
            status: 'Verified',
            type: 'Illegal Fish Trade',
            uri: img,
        },
        {
            id: 4,
            location: 'Kolluptiya',
            date: '09.09.2025',
            status: 'Reject',
            type: 'Illegal Fish Trade',
            uri: img,
        },
        {
            id: 5,
            location: 'Kolluptiya',
            date: '09.09.2025',
            status: 'Reject',
            type: 'Illegal Fish Trade',
            uri: img,
        },
    ]);

    const tabs = ['All', 'Pending', 'Verified', 'Reject'];

    const filtereReports = activeTab === 'All' ? report : report.filter(rept => rept.status === activeTab);

    const hanldeTabChange = (tab) => {
        setActiveTab(tab);
    }

    const handleLongPress = (report, event) => {
        const { pageX, pageY } = event.nativeEvent;
        setSelectReport(report);
        setReportPosition({ x: pageX, y: pageY });
        setShowOption(true);
    }
    return (
        <View style={styles.mainContainer}>
            <TabNavigation
                activeTab={activeTab}
                onTabChange={hanldeTabChange}
                tabs={tabs} />
            <ScrollView style={styles.scrollView}>
                <View style={{ flex: 1, justifyContent: "Center", alignItems: "center" }}>
                    {filtereReports.map((rept) => (
                        <ReportCard
                            key={rept.id}
                            report={rept}
                            onLongPress={(event) => handleLongPress(rept, event)} />
                    ))}
                </View>
            </ScrollView>
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
    }
})