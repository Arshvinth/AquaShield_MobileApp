import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { View, Image, Text, TextInput, StyleSheet, Button, ScrollView, TouchableOpacity, Alert, Switch, Platform, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import MapView, { Marker } from "react-native-maps";
import * as DocumentPicker from 'expo-document-picker';
import NetInfo from "@react-native-community/netinfo";
import { createNewReport, getIncidentType } from '../../src/services/reportService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveReportOffline } from '../../src/services/offlineService';
import { useNavigation } from '@react-navigation/native';
import { createNotification } from '../../src/services/notificationService';


export default function ClientReportIncident() {

    const navigation = useNavigation();

    const initialFormData = {
        locationInfo: {
            type: "Point",
            coordinates: [],
            lat: "",
            lng: "",
            description: "",
        },
        incidentInfo: {
            incidentDate: "",
            incidentTime: "",
            incidentType: "",
            species: "",
            description: "",
        },
        evidences: [],
        personalInfo: {
            name: "",
            mobile: "",
            email: "",
            anonymity: false,
        },
    };

    const [formData, setFormData] = useState(initialFormData);
    const [incidentType, setIncidentType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const speciesImg = require("../../assets/shark.jpeg");

    {/*const incidentTypes = [
        { id: 1, name: "Fishing without license", requiresSpecies: false },
        { id: 2, name: "Fishing in restricted area", requiresSpecies: false },
        { id: 3, name: "Using explosives", requiresSpecies: false },
        { id: 4, name: "Using cyanide", requiresSpecies: false },
        { id: 5, name: "Using banned nets", requiresSpecies: false },
        { id: 6, name: "Catching undersized fish", requiresSpecies: true },
        { id: 7, name: "Exceeding quota", requiresSpecies: true },
        { id: 8, name: "Targeting endangered species", requiresSpecies: true },
        { id: 9, name: "Illegal fish trade", requiresSpecies: true },
        { id: 10, name: "Foreign vessel intrusion", requiresSpecies: true }
    ];*/}



    const speciesTypes = [
        "Tuna",
        "Shark",
        "Lobster",
        "Sea Cucumber",
        "Ornamental Fish"
    ];

    useEffect(() => {
        fetchIncidentTypes();

    }, []);

    const resetForm = () => {
        setFormData(initialFormData);
    }

    const fetchIncidentTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching incident types...');
            const types = await getIncidentType();
            console.log('Received incident types:', types);
            setIncidentType(types);

        } catch (err) {
            console.log('Failed to fetch incident types', err);
            setError('Failed to Load incident types');
        } finally {
            setLoading(false);
        }
    };

    const updateForm = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleLocationSelect = (coordinate) => {
        updateForm("locationInfo", "lat", coordinate.latitude.toString());
        updateForm("locationInfo", "lng", coordinate.longitude.toString());
    };

    const handleSpecieSelect = (species) => {
        updateForm("incidentInfo", "species", species);
    };
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const newEvidences = result.assets.map(asset => asset.uri);
            setFormData(
                pre => ({
                    ...pre,
                    evidences: [...pre.evidences, ...newEvidences]
                })
            );
        }
    };
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                evidences: [...prev.evidences, result.assets[0].uri]
            }));
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'video/*', 'application/pdf'],
                multiple: true,
            });
            if (!result.canceled && result.assets) {
                const newEvidences = result.assets.map(asset => asset.uri);
                setFormData(prev => ({
                    ...prev,
                    evidences: [...prev.evidences, ...newEvidences]
                }));
            }

        } catch (error) {
            console.log('Document picker error:', error);
        }
    };

    const removeEvidence = (index) => {
        setFormData(prev => ({
            ...prev,
            evidences: prev.evidences.filter((_, i) => i !== index)
        }));
    };

    const selectedIncidentType = incidentType?.find(
        (type) => type === formData.incidentInfo.incidentType
    ) || null;

    const requiresSpecies = (incidentType) => {
        const speciesRRequiredTypes = [
            "Catching undersized fish",
            "Exceeding quota",
            "Targeting endangered species",
            "Illegal fish trade",
            "Foreign vessel intrusion"
        ];
        return speciesRRequiredTypes.includes(incidentType);
    }


    const toggleAnnonymity = () => {
        const newAnonymityState = !formData.personalInfo.anonymity;
        updateForm("personalInfo", "anonymity", newAnonymityState);

        if (newAnonymityState) {
            Alert.alert('Anonymous Reporting', 'Your report will be submitted anonymously');
        }

    };

    const handleSubmit = async () => {
        console.log("Submit button clicked");
        const state = await NetInfo.fetch();

        if (state.isConnected) {
            try {
                await createNewReport(formData);

                const notificationData = {
                    title: "Report Submitted Successfully",
                    message: `Your report "${formData.incidentInfo.incidentType}" has been submitted and is under review.`
                };
                console.log('Sending notification:', notificationData);
                await createNotification(notificationData);

                const notificationStatus = {
                    title: "Submitted Report Status",
                    message: "Your report Status : Peniding"
                };
                console.log('Sending notification:', notificationStatus);
                await createNotification(notificationStatus);
                Alert.alert("Success", "Report Submitted Successfully!", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('My Report')
                    }
                ]);

                resetForm();
            } catch (error) {
                Alert.alert("Error", "Failed to submit Report.")
            }
        } else {
            await saveReportOffline(formData);
            resetForm();
            Alert.alert("Saved Offline", "You 're Offline.Report saedd locally and will upload when connected", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate('My Report')
                }
            ]);

        }
    }
    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>

            <TouchableWithoutFeedback onPress={dismissKeyboard}>

                <ScrollView style={styles.scrollView}>

                    <View style={styles.incident}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="information"
                                size={25}
                                color={"#146C94"}
                            />
                            <Text style={styles.header}>
                                Incident information
                            </Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.label}>Incident Type</Text>

                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#146C94" />
                                    <Text style={styles.loadingText}>Loading Incident Types...</Text>
                                </View>
                            ) : error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : (
                                <Picker
                                    selectedValue={formData.incidentInfo.incidentType}
                                    onValueChange={(value) => {
                                        updateForm("incidentInfo", "incidentType", value);
                                        updateForm("incidentInfo", "species", "");
                                    }}
                                    style={{ color: "#19A7CE", fontSize: 16 }}  >
                                    <Picker.Item label="-- Select Incident --" value="" style={{ color: "#146C94", fontSize: 14 }} />
                                    {Array.isArray(incidentType) && incidentType.map((type, index) => (
                                        <Picker.Item key={index} label={type} value={type} />
                                    ))}
                                </Picker>
                            )}


                            {formData.incidentInfo.incidentType && requiresSpecies(formData.incidentInfo.incidentType) && (
                                <>
                                    <Text style={styles.label}>Species</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.speciesScroll}>
                                        <View style={styles.speciesContainer}>
                                            {speciesTypes.map((species, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        styles.speciesCard,
                                                        formData.incidentInfo.species === species && styles.selectSpeciesCard
                                                    ]}
                                                    onPress={() => handleSpecieSelect(species)}
                                                >
                                                    <Image
                                                        source={speciesImg}
                                                        style={styles.spImg}
                                                    />
                                                    <Text style={[
                                                        styles.speciesText,
                                                        formData.incidentInfo.species === species && styles.selectedSpeciesText
                                                    ]}>
                                                        {species}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                </>

                            )}

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                multiline
                                value={formData.incidentInfo.description}
                                onChangeText={(text) => updateForm("incidentInfo", "description", text)} />

                        </View>

                    </View>
                    <View style={styles.evidences}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="camera"
                                size={25}
                                color={"#146C94"}
                            />
                            <Text style={styles.header}>Evidence Information</Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.label}>Add Evidence</Text>
                            <View style={styles.evidecebtns}>
                                <TouchableOpacity style={styles.evidencebtn} onPress={takePhoto}>
                                    <Ionicons name="camera-outline" size={20} color="#146C94" />
                                    <Text style={styles.evidenceButtonText}>Take Photo</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.evidencebtn} onPress={pickImage}>
                                    <Ionicons name="image-outline" size={20} color="#146C94" />
                                    <Text style={styles.evidenceButtonText}>Gallery</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.evidencebtn} onPress={pickDocument}>
                                    <Ionicons name="document-outline" size={20} color="#146C94" />
                                    <Text style={styles.evidenceButtonText}>Files</Text>
                                </TouchableOpacity>
                            </View>

                            {formData.evidences.length > 0 && (
                                <View style={styles.evidencePreview}>
                                    <Text style={styles.evidenceCount}>
                                        {formData.evidences.length} file{formData.evidences.length !== 1 ? 's' : ''} attached

                                    </Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.evidenceList}>
                                            {formData.evidences.map((uri, index) => (
                                                <View key={index} style={styles.evidenceItem}>
                                                    <Image source={{ uri }} style={styles.evidenceImage} />

                                                    <TouchableOpacity style={styles.removebtn} onPress={() => removeEvidence(index)}>
                                                        <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                                                    </TouchableOpacity>
                                                </View>

                                            ))}
                                        </View>
                                    </ScrollView>
                                </View>

                            )}
                        </View>
                    </View>

                    <View style={styles.Location}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="location"
                                size={25}
                                color={"#146C94"}
                            />
                            <Text style={styles.header}>Location Information</Text>

                        </View>

                        <View style={styles.sectionContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 6.9271,
                                    longitude: 79.8612,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05,
                                }}
                                onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
                            >
                                {formData.locationInfo.lat !== "" && (
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(formData.locationInfo.lat),
                                            longitude: parseFloat(formData.locationInfo.lng),
                                        }}
                                    />
                                )}
                            </MapView>
                            {(formData.locationInfo.lat && formData.locationInfo.lng) && (
                                <Text style={styles.coordinates}>
                                    Selected: {parseFloat(formData.locationInfo.lat).toFixed(4)}, {parseFloat(formData.locationInfo.lng).toFixed(4)}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={formData.locationInfo.description}
                            onChangeText={(text) => updateForm("locationInfo", "description", text)} />



                    </View>

                    <View style={styles.person}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="person"
                                size={25}
                                color={"#146C94"}
                            />
                            <Text style={styles.header}>Personal Information</Text>

                        </View>

                        <View style={styles.sectionContainer}>
                            <View style={styles.anonymityContainer}>
                                <View style={styles.anonymityTextContainer}>
                                    <Ionicons name="eye-off-outline" size={20} color="#146C94" />

                                    <View style={styles.annonymityText}>
                                        <Text style={styles.annonimityTitle}>
                                            Report Annonymously
                                        </Text>
                                        <Text style={styles.anonymitySubtitle}>
                                            We secure your personal informations
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={formData.personalInfo.anonymity}
                                    onValueChange={toggleAnnonymity}
                                    trackColor={{ false: '#787070ff', true: '#146C94' }}
                                    thumbColor={formData.personalInfo.anonymity ? '#FFFFFF' : '#F5F5F5'}
                                    ios_backgroundColor='#E3F2FD' />
                                {formData.personalInfo.anonymity && (
                                    Alert.alert('Your Report Submitted Annonymously')
                                )}
                            </View>
                        </View>
                        {!formData.personalInfo.anonymity && (
                            <View style={styles.personalDetails}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Full Name'
                                    placeholderTextColor='#999'
                                    value={formData.personalInfo.name}
                                    returnKeyType='next'
                                    onChangeText={(text) => updateForm("personalInfo", "name", text)}
                                />

                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Your email'
                                    placeholderTextColor='#999'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    value={formData.personalInfo.email}
                                    returnKeyType="next"
                                    onChangeText={(text) => updateForm("personalInfo", "email", text)}
                                />

                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Mobile Number'
                                    placeholderTextColor='#999'
                                    keyboardType='phone-pad'
                                    returnKeyType="done"
                                    value={formData.personalInfo.mobile}
                                    onChangeText={(text) => updateForm("personalInfo", "mobile", text)}
                                />





                            </View>
                        )}

                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit Report</Text>
                        <Ionicons name="send" size={20} color="#146C94" />
                    </TouchableOpacity>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    scrollView: {
        flex: 1,
    },
    incident: {
        flexDirection: "column",
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: "#ffff",
        borderRadius: 15,
        borderColor: "#19A7CE",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: 10,
        paddingTop: 15,
        paddingBottom: 30

    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    header: {
        color: "#146C94",
        fontSize: 16,
        fontWeight: "bold",

    },
    label: {
        color: "#146C94",
        fontSize: 16,
        marginBottom: 10
    },
    speciesScroll: {
        marginVertical: 10,
    },
    speciesContainer: {
        flexDirection: "row",
        paddingVertical: 5
    },
    speciesCard: {
        backgroundColor: "#ffff",
        flexDirection: "column",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#19A7CE",
        justifyContent: "center",
        alignItems: "center"
    },
    selectSpeciesCard: {
        backgroundColor: "#19A7CE",
    },
    selectedSpeciesText: {
        color: "#ffff",
    },
    speciesText: {
        color: "#19A7CE",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center"
    },
    sectionContainer: {
        justifyContent: "center",
        marginLeft: 15
    },
    spImg: {
        width: 75,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        Height: 200,
        borderColor: "#19A7CE",
        borderWidth: 1,
        borderRadius: 15,
    },
    evidences: {
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: "#ffff",
        borderRadius: 15,
        borderColor: "#19A7CE",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    evidecebtns: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    evidencebtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F0F8FF",
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#E3F2FD"
    },
    evidenceButtonText: {
        color: "#146C94",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 6
    },
    evidencePreview: {
        marginTop: 8
    },
    evidenceCount: {
        color: "#666",
        fontSize: 14,
        marginBottom: 8
    },
    evidenceList: {
        flexDirection: 'row',
    },
    evidenceItem: {
        position: 'relative',
        marginRight: 12,
    },
    evidenceImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E3F2FD',
    },
    removebtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    Location: {
        marginBottom: 30,
        marginTop: 10,
        backgroundColor: "#ffff",
        borderRadius: 15,
        borderColor: "#19A7CE",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    map: {
        width: "100%",
        height: 500,
        borderRadius: 12
    },
    coordinates: {
        marginTop: 12,
        color: "#19A7CE",
        fontSize: 15,
        textAlign: "center",
        fontFamily: 'monospace'
    },
    person: {
        marginBottom: 30,
        marginTop: 10,
        backgroundColor: "#ffff",
        borderRadius: 15,
        borderColor: "#19A7CE",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: 20

    },
    anonymityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E3F2FD',
        marginBottom: 20
    },
    anonymityTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    annonymityText: {
        marginLeft: 12,
        flex: 1,
    },
    annonimityTitle: {
        color: '#146C94',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 2,
    },
    anonymitySubtitle: {
        color: '#19A7CE',
        fontSize: 12,
        lineHeight: 16,
    },
    submitButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: "#146C94",
        borderRadius: 10,
        padding: 18,
        borderRadius: 12,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,


    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: "700"
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: "center"
    },
    loadingText: {
        marginLeft: 10,
        color: '#146C94',
        fontSize: 14,
    },
    errorContainer: {
        padding: 10,
        alignItems: "center",
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10
    }





})
