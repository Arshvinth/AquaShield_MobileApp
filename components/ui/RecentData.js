import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { getAllReports } from '../../src/services/reportService';

export default function RecentData() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await getAllReports();

            const sortedReports = data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            const recentReports = sortedReports.slice(0, 8);

            setReports(recentReports);
        } catch (err) {
            console.error("Error Fetching reports", err);
            setError("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const renderRaw = ({ item, index }) => (
        <View key={item._id} style={styles.row}>
            <Text style={[styles.cell, styles.idCell]}>{item._id}</Text>
            <Text style={[styles.cell, styles.dateCell]}>{new Date(item.date).toISOString().split('T')[0]}</Text>
            <Text style={[styles.cell, styles.locationCell]}>{item.location.description || 'N/A'}</Text>
            <View style={[styles.statusCell, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Recent Reports</Text>
                <ActivityIndicator size="large" color="#19A7CE" style={{ margin: 15 }} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Recent Reports</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }


    return (


        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.header, styles.idCell]}>ID</Text>
                    <Text style={[styles.cell, styles.header, styles.dateCell]}>Date</Text>
                    <Text style={[styles.cell, styles.header, styles.locationCell]}>Location</Text>
                    <Text style={[styles.cell, styles.header]}>Status</Text>
                </View>

                {reports.map((item, index) => renderRaw({ item, index }))}

                {reports.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No recent reports</Text>
                    </View>
                )}

            </View>
        </ScrollView>

    );
}

const getStatusStyle = (status) => {
    switch (status) {
        case "PENDING":
            return {
                backgroundColor: "#C2C504",
                padding: 12
            };
        case "VERIFIED":
            return {
                backgroundColor: "#19A7CE",
                padding: 12
            };
        case "REJECT":
            return {
                backgroundColor: "#19CE40",
                padding: 12
            };
        default:
            return {
                backgroundColor: "#ccc",
                padding: 12
            }

    }
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderWidth: 1,
        backgroundColor: "#ffffff",
        borderColor: "#19A7CE",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 20
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#19A7CE",
        alignItems: "center",
    },
    headerRow: {
        backgroundColor: "#f1f1f1",
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#146C94",
        height: 50,

    },
    header: {
        fontWeight: "bold",
        fontSize: 15,
    },
    statusCell: {
        flex: 1,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
    },
    idCell: { minWidth: 120 },
    dateCell: { minWidth: 100 },
    locationCell: { minWidth: 150 },
})