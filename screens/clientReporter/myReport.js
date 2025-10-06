import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import ReportCard from '../../components/ui/ReportCard';

export default function MyReport() {

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


    return (
        <ScrollView style={styles.scrollView}>
            <View style={{ flex: 1, justifyContent: "Center", alignItems: "center" }}>
                {report.map((rept) => (
                    <ReportCard
                        key={rept.id}
                        report={rept} />
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    }
})