import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet, Image, Alert } from "react-native";
import { updateStatus } from "../../src/services/reportService";
import { createNotification } from "../../src/services/notificationService";

export default function FeoReportCard({ report, onPress }) {
    console.log('report data in card', report);
    const getReportStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    backgroundColor: '#C2C504'
                }
            case 'VERIFIED':
                return {
                    backgroundColor: '#146C94'
                }
            case 'REJECT':
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
            case 'PENDING': return 'time-outline';
            case 'VERIFIED': return 'checkmark-circle-outline';
            case 'REJECT': return 'close-circle-outline';
            default: return 'help-circle-outline';
        }
    };

    const handleStatusChange = async (reportid, newStatus) => {
        try {
            const result = await updateStatus(reportid, newStatus);

            const notificationStatus = {
                title: "Submitted Report Status",
                message: "Your report Status : Peniding"
            };
            console.log('Sending notification:', notificationStatus);
            await createNotification(notificationStatus);

            Alert.alert("Success", `Report marked as ${newStatus}`);

        } catch (error) {
            Alert.alert("Error", "Failed to update report status");
        }
    }

    return (

        <TouchableOpacity
            style={styles.ReportCard}
            onPress={onPress}
        >
            <View style={styles.reportHeader}>
                <View style={styles.sampleEvidence}>
                    {report.evidencePhotos && report.evidencePhotos.length > 0 ? (
                        <Image
                            source={{ uri: report.evidencePhotos[0].url }}
                            style={styles.evidenceImage}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/reportimg.jpg')}
                            style={styles.evidenceImage}
                        />
                    )}

                </View>
                <View style={styles.locationContainer}>
                    <Text style={styles.label}>
                        Location
                    </Text>
                    <Text style={styles.retriveDta}>
                        {report.location?.description}
                    </Text>
                    <View style={styles.dateSection}>
                        <Ionicons
                            name="calendar-clear-outline"
                            size={16}
                            color={"#146C94"} />
                        <Text style={styles.retriveDta}>
                            {new Date(report.date).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {report.status == "PENDING" ? (

                    <View style={styles.actionBtns}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#19CE40' }]}
                            onPress={() => handleStatusChange(report._id, 'VERIFIED')}>
                            <Ionicons name="checkmark-circle-outline" size={20} color={"#FFFFFF"} />
                            <Text style={styles.actionText}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#FF0000' }]}
                            onPress={() => handleStatusChange(report._id, 'REJECT')}>
                            <Ionicons name="close-circle-outline" size={20} color={"#FFFFFF"} />
                            <Text style={styles.actionText}>Reject</Text>
                        </TouchableOpacity>
                    </View>

                ) : (
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
                                {report.incidentType}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>

    );
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
        maxWidth: 95,
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
    },
    actionBtns: {
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    actionBtn: {
        flexDirection: "row",
        padding: 10,
        width: 100,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    actionText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700"
    }



})