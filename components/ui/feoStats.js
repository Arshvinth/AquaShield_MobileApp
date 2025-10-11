import React, { useState, useEffect } from 'react'
import { getAllSubmittedReports } from '../../src/services/reportService';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';


export default function FeoStatistics() {

    const [reports, setReports] = useState([]);
    const [count, setCount] = useState({
        verified: 0,
        Reject: 0,
        Pending: 0,
    });
    const [isLoading, setIsLoading] = useState(true);





    useEffect(() => {
        fetchUserReport();

    }, []);

    const fetchUserReport = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching All users Reports...');
            const types = await getAllSubmittedReports();
            console.log('Recived Reports', types);
            setReports(types);

            let veriFIedCount = 0;
            let rejectCount = 0;
            let pendingCount = 0;

            types.forEach((rept) => {
                switch (rept.status) {
                    case 'VERIFIED':
                        veriFIedCount++;
                        break;
                    case 'REJECT':
                        rejectCount++;
                        break;
                    case 'PENDING':
                        pendingCount++;
                        break;
                    default:
                        break;
                }
            });

            setCount({
                verified: veriFIedCount,
                Reject: rejectCount,
                Pending: pendingCount,
            });

        } catch (err) {
            console.log('Failed to fetch reports', err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <ActivityIndicator size="large" color="#146C94" />

    return (
        <View style={styles.container}>
            <View style={styles.containerA}>
                <View style={[styles.card, { borderTopColor: "#FF0000" }]}>
                    <Text style={[styles.label, { color: "#FF0000" }]}>Total Reports</Text>
                    <Text style={[styles.count, { color: "#FF0000" }]}>{count.verified + count.Pending + count.Reject}</Text>
                </View>
                <View style={[styles.card, { borderTopColor: "#19A7CE" }]}>
                    <Text style={[styles.label, { color: "#19A7CE" }]}>Verified</Text>
                    <Text style={[styles.count, { color: "#19A7CE" }]}>{count.verified}</Text>
                </View>
            </View>
            <View style={styles.containerA}>
                <View style={[styles.card, { borderTopColor: "#19CE40" }]}>
                    <Text style={[styles.label, { color: "#19CE40" }]}>Reject</Text>
                    <Text style={[styles.count, { color: "#19CE40" }]}>{count.Reject}</Text>
                </View>
                <View style={[styles.card, { borderTopColor: "#C2C504" }]}>
                    <Text style={[styles.label, { color: "#C2C504" }]}>Pending</Text>
                    <Text style={[styles.count, { color: "#C2C504" }]}>{count.Pending}</Text>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        padding: 10,
        width: 350
    },
    containerA: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 10,
        width: 150,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 8




    },
    label: {
        padding: 5,
        marginBottom: 5
    }


});