import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportCard({ report, onLongPress }) {

    const getReportStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    backgroundColor: '#C2C504'
                }
            case 'Verified':
                return {
                    backgroundColor: '#146C94'
                }
            case 'Reject':
                return {
                    backgroundColor: '#FF0000'
                }

            default:
                return {
                    backgroundColor: '#666'
                }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return 'time-outline';
            case 'Verified': return 'checkmark-circle-outline';
            case 'Reject': return 'close-circle-outline';
            default: return 'help-circle-outline';
        }
    };

    return (
        <TouchableOpacity
            style={styles.ReportCard}
            onLongPress={onLongPress}
            delayLongPress={500}
            activeOpacity={0.7}
        >

            <View style={styles.reportHeader}>
                <View style={styles.sampleEvidence}>
                    <Image source={report.uri} style={styles.evidenceImage} />
                </View>
                <View style={styles.locationContainer}>
                    <Text style={styles.label}>
                        Location
                    </Text>
                    <Text style={styles.retriveDta}>
                        {report.location}
                    </Text>
                    <View style={styles.dateSection}>
                        <Ionicons
                            name="calendar-clear-outline"
                            size={16}
                            color={"#146C94"} />
                        <Text style={styles.retriveDta}>
                            {report.date}
                        </Text>
                    </View>
                </View>
                <View style={styles.statusType}>
                    <View style={[styles.statusContainer, getReportStatusColor(report.status)]}>
                        <Ionicons
                            name={getStatusIcon(report.status)}
                            size={20}
                            color={"#FFFF"}

                        />
                        <Text style={styles.statusText}>{report.status}</Text>

                    </View>
                    <View style={styles.typeSection}>
                        <Text style={styles.labelType}>
                            {report.type}
                        </Text>
                    </View>
                </View>

            </View>


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    ReportCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#146C94',
        marginTop: 12,
        width: 370



    },
    reportHeader: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-around"

    },
    evidenceImage: {
        width: 100,
        height: 100
    },
    locationContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        gap: 15,
        maxWidth: 100
    },
    dateSection: {
        flexDirection: "row",
        gap: 3,
        alignItems: "center"
    },
    label: {
        color: "#146C94",
        fontSize: 16,
        fontWeight: "bold"
    },
    retriveDta: {
        color: "#AFD3E2",
        fontWeight: "400"

    },
    statusContainer: {
        flexDirection: "row",
        gap: 4,
        maxWidth: 85,
        borderRadius: 10,
        padding: 5

    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600"
    },
    statusType: {
        flexDirection: "column",
        gap: 20,
        justifyContent: "flex-start"
    },
    typeSection: {
        maxWidth: 93,
        backgroundColor: "#AFD3E1",
        padding: 2,
        textAlign: "center",
    },
    labelType: {
        color: "#146C94",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center"
    }



})

