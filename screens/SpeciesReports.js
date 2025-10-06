import React, { useState } from 'react'; // <-- Import useState
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import Layout from '../components/layout/layout';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Define the color palette
const colors = {
  background: '#F6F1F1',
  primary: '#19A7CE',
  secondary: '#146C94',
  muted: '#AFD3E2',
  accent: '#AFD3E2',
  white: '#FFFFFF',
};

// Component for the Export button row
const ReportButton = ({ title }) => (
  <View style={styles.reportRow}>
    <Text style={styles.reportTitle}>{title}</Text>
    <TouchableOpacity style={styles.exportButton}>
      <Text style={styles.exportButtonText}>Export</Text>
    </TouchableOpacity>
  </View>
);

const SpeciesReports = ({ navigation }) => {
    // State for Search By dropdown
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedSearchBy, setSelectedSearchBy] = useState('Search By');
    
    // Dropdown options
    const searchOptions = ['Location', 'Species Name'];

    // Handler to select an option and close the dropdown
    const handleSelectOption = (option) => {
        setSelectedSearchBy(option);
        setIsDropdownVisible(false);
    };

    return (
        <Layout>
            <ScrollView style={styles.container}>
                
                {/* Reports Section (Top Box) */}
                <View style={styles.reportsContainer}>
                    <ReportButton title="Endangered Species Report" />
                    <ReportButton title="Endangered Species Report" />
                    <ReportButton title="Vulnerable Species Report" />
                </View>

                {/* Search Section (Bottom Box) */}
                <View style={styles.searchContainer}>
                    
                    <View style={styles.searchBar}>
                        
                        {/* Search By Dropdown Button */}
                        <TouchableOpacity 
                            style={styles.searchByButton}
                            onPress={() => setIsDropdownVisible(!isDropdownVisible)} // Toggle visibility
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
                            />
                        </View>
                        
                    </View>
                    
                    {/* Conditional Dropdown Display */}
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

                    {/* Search Result Area */}
                    <View style={styles.searchResults}>
                        <Text style={styles.searchResultsText}>
                            Search result for reports
                        </Text>
                        <Text style={styles.searchResultsText}>
                            filtered by location/date/species
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
    // --- Reports Section Styles (Unchanged) ---
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
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 5,
    },
    exportButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },

    // --- Search Section Styles ---
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
        marginBottom: 10, // Adjusted to make space for the dropdown
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
    
    // --- Dropdown Specific Styles ---
    dropdown: {
        position: 'absolute', 
        top: 60, 
        left: 15,
        width: 150, 
        backgroundColor: colors.white,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.muted,
        zIndex: 10, // Ensure it sits on top
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

    // --- Search Results Styles ---
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
    }
});

export default SpeciesReports;