import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Modal, FlatList, Dimensions, Alert, Linking } from 'react-native'

const { width: screenWidth } = Dimensions.get('window');

export default function ReportDetails({ report, onBack }) {

    const [selectedImage, setSelectedImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getReportStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    backgroundColor: '#C2C504',
                    borderRadius: 15
                }
            case 'VERIFIED':
                return {
                    backgroundColor: '#146C94',
                    borderRadius: 15
                }
            case 'REJECT':
                return {
                    backgroundColor: '#FF0000',
                    borderRadius: 15
                }

            default:
                return {
                    backgroundColor: '#666'
                }
        }
    };

    const getValidEvidences = () => {
        if (!report?.evidencePhotos || !Array.isArray(report.evidencePhotos)) {
            return [];
        }

        return report.evidencePhotos.filter(photo => {
            if (typeof photo === 'string') return photo.trim() !== '';
            if (photo && photo.url) return photo.url.trim() !== '';
            return false;
        }).map(photo => typeof photo === 'string' ? photo : photo.url);
    };

    const validEvidencePhotos = getValidEvidences();

    const openImageModal = (imageUri, index) => {
        setSelectedImage(imageUri);
        setCurrentImageIndex(index);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const navigateImage = (direction) => {
        const newIndex = direction === 'next'
            ? (currentImageIndex + 1) % validEvidencePhotos.length
            : (currentImageIndex - 1 + validEvidencePhotos.length) % validEvidencePhotos.length;

        setCurrentImageIndex(newIndex);
        setSelectedImage(validEvidencePhotos[newIndex]);
    };

    const openInGoogleMaps = (location) => {
        let url = "";

        if (report?.location?.coordinates?.length === 2) {
            const [lng, lat] = report.location.coordinates;
            console.log(lng, lat);
            url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        } else if (report?.location?.description) {
            url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.description)}`;
        } else {
            Alert.alert("Error", "Location not available");
            return;
        }

        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "Unable to open Google Maps");
        });
    };


    const renderEvidenceItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.evidenceItem}
            onPress={() => openImageModal(item, index)}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item }}
                style={styles.evidenceImage}
                resizeMode="cover"
                onError={(error) => console.log('Image loading error')}
            />
            <View style={styles.evidenceOverlay}>
                <View style={styles.evidenceBadge}>
                    <Text style={styles.evidenceBadgeText}>{index + 1}</Text>
                </View>
                <View style={styles.evidenceAction}>
                    <Ionicons name="expand" size={20} color="#FFF" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => onBack()}>
                    <Text style={styles.backText}>
                        <Ionicons
                            name="arrow-back"
                            size={14}
                            color={"#146C96"} />
                    </Text>
                </TouchableOpacity>
                <Text style={styles.title}>REPORT DETAILS</Text>

            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>


                <View style={styles.statusBox}>
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color={"#146C96"} />
                    <Text style={styles.statusText}>
                        Report Submitted Successfully
                    </Text>
                </View>

                <View style={styles.Summary}>
                    <View style={styles.summaryHeader}>
                        <Ionicons
                            name="document-text-outline"
                            size={24}
                            color={"#146C96"} />
                        <Text style={styles.summaryTxt}>
                            Report Summary
                        </Text>
                    </View>
                    <View style={styles.summaryDetails}>
                        <View style={styles.containerA}>
                            <View style={styles.section}>
                                <Text style={styles.subtopic}>
                                    Report ID
                                </Text>
                                <Text style={styles.details}>
                                    {report._id}
                                </Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.subtopic}>
                                    Date
                                </Text>
                                <Text style={styles.details}>
                                    {new Date(report.date).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.containerA}>
                            <View style={styles.section}>
                                <Text style={styles.subtopic}>
                                    Location
                                </Text>
                                <Text style={styles.details}>
                                    {report.location.description}
                                </Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.subtopic}>
                                    Status
                                </Text>
                                <Text style={[styles.detailstxt, getReportStatusColor(report.status)]}>
                                    {report.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.view}
                        onPress={openInGoogleMaps}>
                        <Ionicons
                            name="map-outline"
                            size={24}
                            color={"#ffffff"} />
                        <Text style={styles.mapText}>
                            View On Map
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.Summary}>
                    <View style={styles.summaryHeader}>
                        <Ionicons
                            name="information-circle-outline"
                            size={24}
                            color={"#146C96"} />
                        <Text style={styles.summaryTxt}>
                            Incident Information
                        </Text>
                    </View>
                    <View style={styles.summaryDetailsA}>
                        <View style={styles.subSection}>
                            <Text style={styles.subtopic}>
                                Incident Type
                            </Text>
                            <Text style={styles.details}>
                                {report.incidentType}
                            </Text>
                        </View>

                        <View style={styles.subSection}>
                            <Text style={styles.subtopic}>
                                Species
                            </Text>
                            <Text style={styles.details}>
                                {report.species}
                            </Text>
                        </View>

                        <View style={styles.subSection}>
                            <Text style={styles.subtopic}>
                                Description
                            </Text>
                            <Text style={styles.details}>
                                {report.description}
                            </Text>
                        </View>
                    </View>


                </View>

                {validEvidencePhotos.length > 0 ? (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="images" size={20} color="#146C94" />
                            <Text style={styles.cardTitle}>
                                Evidence Photos ({validEvidencePhotos.length})
                            </Text>
                        </View>

                        <FlatList
                            data={validEvidencePhotos}
                            renderItem={renderEvidenceItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.evidenceList}
                            snapToInterval={screenWidth * 0.8 + 16}
                            decelerationRate="fast"
                        />

                        <View style={styles.evidenceHint}>
                            <Ionicons name="information-circle-outline" size={14} color="#666" />
                            <Text style={styles.evidenceHintText}>
                                Tap to view • Swipe for more
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="images" size={20} color="#146C94" />
                            <Text style={styles.cardTitle}>Evidence Photos</Text>
                        </View>
                        <View style={styles.noEvidence}>
                            <Ionicons name="image-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.noEvidenceText}>No evidence photos available</Text>
                        </View>
                    </View>
                )}





            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closeImageModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={closeImageModal}
                    >
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>

                    {validEvidencePhotos.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={[styles.navButton, styles.prevButton]}
                                onPress={() => navigateImage('prev')}
                            >
                                <Ionicons name="chevron-back" size={28} color="#FFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.navButton, styles.nextButton]}
                                onPress={() => navigateImage('next')}
                            >
                                <Ionicons name="chevron-forward" size={28} color="#FFF" />
                            </TouchableOpacity>

                            <View style={styles.imageCounter}>
                                <Text style={styles.imageCounterText}>
                                    {currentImageIndex + 1} / {validEvidencePhotos.length}
                                </Text>
                            </View>
                        </>
                    )}

                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.modalImage}
                            resizeMode="contain"
                            onError={closeImageModal}
                        />

                    )}
                </View>
            </Modal>

        </>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F6F1F1",
        flexDirection: "column",
        columnGap: 20
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#FFFFFF",
        padding: 20
    },
    title: {
        color: "#146C96",
        fontSize: 16,
        fontWeight: "bold"
    },
    statusBox: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 24,
        gap: 10,
        backgroundColor: "#AFD3E2",
        padding: 5,

    },
    statusText: {
        color: "#146C96",
        fontSize: 14,
        fontWeight: "bold"
    },
    Summary: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        padding: 10,
        marginTop: 12,
        margin: 12

    },
    summaryHeader: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10
    },
    summaryTxt: {
        color: "#146C96",
        fontWeight: "bold",
        fontSize: 16,
        alignItems: "center"
    },
    summaryDetails: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    containerA: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        gap: 4,
        justifyContent: "center"
    },
    section: {
        backgroundColor: "#AFD3E2",
        padding: 10,
        minHeight: 80,
        maxWidth: 150,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "stretch"
    },
    subtopic: {
        color: "#146C96",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    details: {
        color: "#19A7CE",
        fontSize: 15,
        textAlign: "center",
        fontWeight: "500"
    },
    detailstxt: {
        color: "#ffff",
        textAlign: "center",
        fontWeight: "500"
    },
    view: {
        backgroundColor: "#146C96",
        width: 150,
        margin: 2,
        marginTop: 15,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        padding: 10,
        alignItems: "center",
        borderRadius: 15,
        marginBottom: 12
    },
    mapText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center"
    },
    summaryDetailsA: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    subSection: {
        backgroundColor: "#AFD3E2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        width: 300
    },
    card: {
        backgroundColor: "#FFFFFF",
        margin: 12,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    cardTitle: {
        color: "#146C96",
        fontSize: 16,
        fontWeight: "bold",
    },
    evidenceList: {
        paddingHorizontal: 4,
    },
    evidenceItem: {
        width: screenWidth * 0.8,
        height: 200,
        marginHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    evidenceImage: {
        width: '100%',
        height: '100%',
    },
    evidenceOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        padding: 12,
    },
    evidenceBadge: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    evidenceBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: "600"
    },
    evidenceAction: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 20,
        padding: 8,
        alignSelf: 'flex-end'

    },
    evidenceHint: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        gap: 6
    },
    evidenceHintText: {
        color: "#64748B",
        fontSize: 12,
        fontStyle: "italic",
    },
    noEvidence: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noEvidenceText: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 12,
        fontStyle: 'italic',
    },
    actionContainer: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginBottom: 20,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#146C94',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 8,
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 25,
        padding: 12,
        zIndex: 1,
    },
    prevButton: {
        left: 20,
    },
    nextButton: {
        right: 20,
    },
    imageCounter: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    imageCounterText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    modalImage: {
        width: screenWidth,
        height: screenWidth,
    }


})