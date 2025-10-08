// import React, { useState } from 'react'; // <-- Import useState
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
// import Layout from '../components/layout/layout';
// import { MaterialIcons } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';

// // Define the color palette
// const colors = {
//   background: '#F6F1F1',
//   primary: '#19A7CE',
//   secondary: '#146C94',
//   muted: '#AFD3E2',
//   accent: '#AFD3E2',
//   white: '#FFFFFF',
// };

// // Component for the Export button row
// const ReportButton = ({ title }) => (
//   <View style={styles.reportRow}>
//     <Text style={styles.reportTitle}>{title}</Text>
//     <TouchableOpacity style={styles.exportButton}>
//       <Text style={styles.exportButtonText}>Export</Text>
//     </TouchableOpacity>
//   </View>
// );

// const SpeciesReports = ({ navigation }) => {
//     // State for Search By dropdown
//     const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//     const [selectedSearchBy, setSelectedSearchBy] = useState('Search By');

//     // Dropdown options
//     const searchOptions = ['Location', 'Species Name'];

//     // Handler to select an option and close the dropdown
//     const handleSelectOption = (option) => {
//         setSelectedSearchBy(option);
//         setIsDropdownVisible(false);
//     };

//     return (
//         <Layout>
//             <ScrollView style={styles.container}>

//                 {/* Reports Section (Top Box) */}
//                 <View style={styles.reportsContainer}>
//                     <ReportButton title="Endangered Species Report" />
//                     <ReportButton title="Endangered Species Report" />
//                     <ReportButton title="Vulnerable Species Report" />
//                 </View>

//                 {/* Search Section (Bottom Box) */}
//                 <View style={styles.searchContainer}>

//                     <View style={styles.searchBar}>

//                         {/* Search By Dropdown Button */}
//                         <TouchableOpacity 
//                             style={styles.searchByButton}
//                             onPress={() => setIsDropdownVisible(!isDropdownVisible)} // Toggle visibility
//                         >
//                             <Text style={styles.searchByText}>{selectedSearchBy}</Text>
//                             <MaterialIcons 
//                                 name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
//                                 size={20} 
//                                 color={colors.secondary} 
//                             />
//                         </TouchableOpacity>

//                         {/* Search Input */}
//                         <View style={styles.searchInputWrapper}>
//                             <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
//                             <TextInput
//                                 style={styles.searchInput}
//                                 placeholder="Search"
//                                 placeholderTextColor="gray"
//                             />
//                         </View>

//                     </View>

//                     {/* Conditional Dropdown Display */}
//                     {isDropdownVisible && (
//                         <View style={styles.dropdown}>
//                             {searchOptions.map((option) => (
//                                 <TouchableOpacity 
//                                     key={option}
//                                     style={styles.dropdownItem}
//                                     onPress={() => handleSelectOption(option)}
//                                 >
//                                     <Text style={styles.dropdownItemText}>{option}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     )}

//                     {/* Search Result Area */}
//                     <View style={styles.searchResults}>
//                         <Text style={styles.searchResultsText}>
//                             Search result for reports
//                         </Text>
//                         <Text style={styles.searchResultsText}>
//                             filtered by location/date/species
//                         </Text>
//                     </View>
//                 </View>

//             </ScrollView>
//         </Layout>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.background,
//         padding: 7,
//     },
//     // --- Reports Section Styles (Unchanged) ---
//     reportsContainer: {
//         backgroundColor: colors.white,
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     reportRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 10,
//     },
//     reportTitle: {
//         fontSize: 16,
//         color: '#000',
//     },
//     exportButton: {
//         backgroundColor: '#000',
//         paddingHorizontal: 15,
//         paddingVertical: 7,
//         borderRadius: 5,
//     },
//     exportButtonText: {
//         color: colors.white,
//         fontWeight: 'bold',
//     },

//     // --- Search Section Styles ---
//     searchContainer: {
//         backgroundColor: colors.white,
//         borderRadius: 10,
//         padding: 15,
//         minHeight: 300,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.22,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     searchBar: {
//         flexDirection: 'row',
//         marginBottom: 10, // Adjusted to make space for the dropdown
//     },
//     searchByButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         borderWidth: 1,
//         borderColor: colors.muted,
//         borderRadius: 5,
//         marginRight: 10,
//         backgroundColor: colors.white,
//         height: 40,
//     },
//     searchByText: {
//         fontSize: 14,
//         color: colors.secondary,
//         marginRight: 5,
//     },
//     searchInputWrapper: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: colors.muted,
//         borderRadius: 5,
//         paddingLeft: 10,
//         height: 40,
//     },
//     searchIcon: {
//         color: 'gray',
//         marginRight: 5,
//     },
//     searchInput: {
//         flex: 1,
//         paddingVertical: 5,
//         fontSize: 14,
//         color: '#000',
//     },

//     // --- Dropdown Specific Styles ---
//     dropdown: {
//         position: 'absolute', 
//         top: 60, 
//         left: 15,
//         width: 150, 
//         backgroundColor: colors.white,
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: colors.muted,
//         zIndex: 10, // Ensure it sits on top
//     },
//     dropdownItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.background,
//     },
//     dropdownItemText: {
//         color: colors.secondary,
//         fontSize: 14,
//     },

//     // --- Search Results Styles ---
//     searchResults: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         marginTop: 50,
//     },
//     searchResultsText: {
//         color: 'gray',
//         fontSize: 14,
//         textAlign: 'center',
//         lineHeight: 20,
//     }
// });

// export default SpeciesReports;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import Layout from '../components/layout/layout';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Buffer } from "buffer";


// Define color palette
const colors = {
    background: '#F6F1F1',
    primary: '#19A7CE',
    secondary: '#146C94',
    muted: '#AFD3E2',
    accent: '#AFD3E2',
    white: '#FFFFFF',
};

// Report Button Component
const ReportButton = ({ title, endpoint }) => {
    const handleExport = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/species/report/${endpoint}`, {
                responseType: 'arraybuffer', // binary PDF data
            });

            // Convert binary to base64
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            const fileUri = FileSystem.documentDirectory + `${title.replace(/\s/g, '_')}.pdf`;

            // Save PDF using string 'base64' instead of FileSystem.EncodingType.Base64
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' });

            // Share the PDF
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error("PDF export error:", error);
            alert("Failed to export PDF report");
        }
    };

    return (
        <View style={styles.reportRow}>
            <Text style={styles.reportTitle}>{title}</Text>
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
        </View>
    );
};

const SpeciesReports = () => {
    // State for Search By dropdown
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedSearchBy, setSelectedSearchBy] = useState('Search By');
    const [searchText, setSearchText] = useState('');

    const searchOptions = ['Location', 'Species Name'];

    const handleSelectOption = (option) => {
        setSelectedSearchBy(option);
        setIsDropdownVisible(false);
    };

    return (
        <Layout>
            <ScrollView style={styles.container}>

                {/* Reports Section */}
                <View style={styles.reportsContainer}>
                    <ReportButton title="Endangered Species Report" endpoint="endangered" />
                    <ReportButton title="Extinct Species Report" endpoint="extinct" />
                    <ReportButton title="Vulnerable Species Report" endpoint="vulnerable" />
                </View>

                {/* Search Section */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>

                        {/* Search By Dropdown */}
                        <TouchableOpacity
                            style={styles.searchByButton}
                            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                        >
                            <Text style={styles.searchByText}>{selectedSearchBy}</Text>
                            <MaterialIcons
                                name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                size={20}
                                color={colors.secondary}
                            />
                        </TouchableOpacity>

                        {/* Search Input */}
                        <View style={styles.searchInputWrapper}>
                            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                placeholderTextColor="gray"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>

                    {/* Dropdown Menu */}
                    {isDropdownVisible && (
                        <View style={styles.dropdown}>
                            {searchOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelectOption(option)}
                                >
                                    <Text style={styles.dropdownItemText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Placeholder for Search Results */}
                    <View style={styles.searchResults}>
                        <Text style={styles.searchResultsText}>
                            Search result for reports filtered by location/date/species
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 7,
    },

    // --- Reports Section ---
    reportsContainer: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    reportTitle: {
        fontSize: 16,
        color: '#000',
    },
    exportButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 5,
    },
    exportButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },

    // --- Search Section ---
    searchContainer: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        minHeight: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    searchBar: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    searchByButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.muted,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: colors.white,
        height: 40,
    },
    searchByText: {
        fontSize: 14,
        color: colors.secondary,
        marginRight: 5,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.muted,
        borderRadius: 5,
        paddingLeft: 10,
        height: 40,
    },
    searchIcon: {
        color: 'gray',
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 5,
        fontSize: 14,
        color: '#000',
    },

    // --- Dropdown ---
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 15,
        width: 150,
        backgroundColor: colors.white,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.muted,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    dropdownItemText: {
        color: colors.secondary,
        fontSize: 14,
    },

    // --- Search Results ---
    searchResults: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    searchResultsText: {
        color: 'gray',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default SpeciesReports;
