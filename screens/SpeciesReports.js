// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Alert,
//   Platform,
//   Image
// } from 'react-native';
// import Layout from '../components/layout/layout';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';
// import { Buffer } from 'buffer';

// // --- Color palette ---
// const colors = {
//   background: '#F6F1F1',
//   primary: '#19A7CE',
//   secondary: '#146C94',
//   muted: '#AFD3E2',
//   accent: '#AFD3E2',
//   white: '#FFFFFF',
// };

// // --- Report Button Component ---
// const ReportButton = ({ title, endpoint }) => {
//   const handleExport = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/species/report/${endpoint}`, {
//         responseType: 'arraybuffer',
//       });

//       const base64 = Buffer.from(response.data, 'binary').toString('base64');
//       const fileUri = FileSystem.documentDirectory + `${title.replace(/\s/g, '_')}.pdf`;

//       await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' });

//       const buttons = [
//         {
//           text: 'Share',
//           onPress: async () => {
//             try {
//               await Sharing.shareAsync(fileUri);
//             } catch (err) {
//               console.error('Sharing error:', err);
//               Alert.alert('Error', 'Unable to share file.');
//             }
//           },
//         },
//       ];

//       if (Platform.OS === 'android') {
//         buttons.push({
//           text: 'Download',
//           onPress: async () => {
//             try {
//               const permissions =
//                 await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//               if (permissions.granted) {
//                 const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
//                   permissions.directoryUri,
//                   `${title}.pdf`,
//                   'application/pdf'
//                 );

//                 await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, base64, {
//                   encoding: FileSystem.EncodingType.Base64,
//                 });

//                 Alert.alert('Success', 'PDF downloaded successfully!');
//               } else {
//                 Alert.alert('Permission Denied', 'Storage access is required to save the file.');
//               }
//             } catch (err) {
//               console.error('Download error:', err);
//               Alert.alert('Error', 'Failed to download the file.');
//             }
//           },
//         });
//       }

//       buttons.push({ text: 'Cancel', style: 'cancel' });

//       Alert.alert('Export Report', 'Do you want to share or download the report?', buttons);
//     } catch (error) {
//       console.error('PDF export error:', error);
//       Alert.alert('Error', 'Failed to export PDF report');
//     }
//   };

//   return (
//     <View style={styles.reportRow}>
//       <Text style={styles.reportTitle}>{title}</Text>
//       <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
//         <Text style={styles.exportButtonText}>Export</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // --- Main Screen ---
// const SpeciesReports = () => {
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [selectedSearchBy, setSelectedSearchBy] = useState('Search By');
//   const [searchText, setSearchText] = useState('');
//   const [reports, setReports] = useState([]);

//   const searchOptions = ['Location', 'Species Name'];

//   const handleSelectOption = (option) => {
//     setSelectedSearchBy(option);
//     setIsDropdownVisible(false);
//   };

//   // --- Fetch reports from backend ---
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE_URL}/api/report/getAllReportsResearcher`);
//         setReports(data);
//       } catch (err) {
//         console.error('Failed to fetch reports', err);
//         Alert.alert('Error', 'Unable to fetch reports');
//       }
//     };

//     fetchReports();
//   }, []);

//   // --- Filter reports based on search ---
//   const filteredReports = reports.filter((report) => {
//     if (!searchText.trim()) return true;

//     const lowerSearch = searchText.toLowerCase();

//     if (selectedSearchBy === 'Species Name') {
//       return report.species?.CommonName?.toLowerCase().includes(lowerSearch);
//     } else if (selectedSearchBy === 'Location') {
//       return report.location?.description?.toLowerCase().includes(lowerSearch);
//     }

//     // Default: search across both fields if "Search By" not chosen
//     return (
//       report.species?.CommonName?.toLowerCase().includes(lowerSearch) ||
//       report.location?.description?.toLowerCase().includes(lowerSearch)
//     );
//   });

//   return (
//     <Layout>
//       <ScrollView style={styles.container}>
//         {/* Reports Section */}
//         <View style={styles.reportsContainer}>
//           <ReportButton title="Endangered Species Report" endpoint="endangered" />
//           <ReportButton title="Extinct Species Report" endpoint="extinct" />
//           <ReportButton title="Vulnerable Species Report" endpoint="vulnerable" />
//         </View>

//         {/* Search Section */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             {/* Dropdown Button */}
//             <TouchableOpacity
//               style={styles.searchByButton}
//               onPress={() => setIsDropdownVisible(!isDropdownVisible)}
//             >
//               <Text style={styles.searchByText}>{selectedSearchBy}</Text>
//               <MaterialIcons
//                 name={isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                 size={20}
//                 color={colors.secondary}
//               />
//             </TouchableOpacity>

//             {/* Search Input */}
//             <View style={styles.searchInputWrapper}>
//               <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search"
//                 placeholderTextColor="gray"
//                 value={searchText}
//                 onChangeText={setSearchText}
//               />
//             </View>
//           </View>

//           {/* Dropdown Menu */}
//           {isDropdownVisible && (
//             <View style={styles.dropdown}>
//               {searchOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.dropdownItem}
//                   onPress={() => handleSelectOption(option)}
//                 >
//                   <Text style={styles.dropdownItemText}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Search Results */}
//           <View style={styles.searchResults}>
//             {filteredReports.length > 0 ? (
//               filteredReports.map((report) => (
//                 <View key={report._id} style={styles.reportCard}>
//                   {/* Species Image */}
//                   {report.species?.ImageURL && (
//                     <Image
//                       source={{ uri: report.species.ImageURL }}
//                       style={styles.speciesImage}
//                       resizeMode="cover"
//                     />
//                   )}

//                   {/* Report Info */}
//                   <View style={styles.reportInfo}>
//                     <Text style={styles.reportTitleText}>
//                       Species Name: {report.species?.CommonName || 'Unknown'}
//                     </Text>
//                     <Text style={styles.reportSubText}>
//                       Scientific Name: {report.species?.ScientificName || 'Unknown'}
//                     </Text>
//                     <Text style={styles.reportText}>
//                       Protection Level: {report.species?.ProtectionLevel || 'N/A'}
//                     </Text>
//                     <Text style={styles.reportText}>
//                       Incident Type: {report.incidentType || 'N/A'}
//                     </Text>
//                     <Text style={styles.reportText}>
//                       Location: {report.location?.description || 'N/A'}
//                     </Text>
//                     <Text style={styles.reportText}>
//                       Date:{' '}
//                       {report.date
//                         ? new Date(report.date).toISOString().split('T')[0]
//                         : 'N/A'}
//                     </Text>
//                     <Text style={styles.reportText}>
//                       Report Status: {report.status || 'N/A'}
//                     </Text>
//                   </View>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.searchResultsText}>No reports found</Text>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </Layout>
//   );
// };

// // --- Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     padding: 7,
//   },

//   // Reports Section
//   reportsContainer: {
//     backgroundColor: colors.white,
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   reportRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   reportTitle: {
//     fontSize: 16,
//     color: '#000',
//   },
//   exportButton: {
//     backgroundColor: colors.secondary,
//     paddingHorizontal: 15,
//     paddingVertical: 7,
//     borderRadius: 5,
//   },
//   exportButtonText: {
//     color: colors.white,
//     fontWeight: 'bold',
//   },

//   // Search Section
//   searchContainer: {
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     padding: 15,
//     minHeight: 300,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   searchByButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: colors.muted,
//     borderRadius: 5,
//     marginRight: 10,
//     backgroundColor: colors.white,
//     height: 40,
//   },
//   searchByText: {
//     fontSize: 14,
//     color: colors.secondary,
//     marginRight: 5,
//   },
//   searchInputWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.muted,
//     borderRadius: 5,
//     paddingLeft: 10,
//     height: 40,
//   },
//   searchIcon: {
//     color: 'gray',
//     marginRight: 5,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 5,
//     fontSize: 14,
//     color: '#000',
//   },

//   // Dropdown
//   dropdown: {
//     position: 'absolute',
//     top: 60,
//     left: 15,
//     width: 150,
//     backgroundColor: colors.white,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: colors.muted,
//     zIndex: 10,
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.background,
//   },
//   dropdownItemText: {
//     color: colors.secondary,
//     fontSize: 14,
//   },

//   // Search Results
//   searchResults: {
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     padding: 10,
//     marginTop: 20,
//   },
//   searchResultsText: {
//     color: 'gray',
//     fontSize: 14,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   reportCard: {
//     backgroundColor: colors.white,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3.84,
//     elevation: 3,
//     width: '100%',
//   },

//   speciesImage: {
//     width: '100%',
//     height: 160,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   reportInfo: {
//     paddingHorizontal: 5,
//   },

//   reportTitleText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: colors.secondary,
//     marginBottom: 4,
//   },

//   reportSubText: {
//     fontSize: 14,
//     fontStyle: 'italic',
//     color: '#444',
//     marginBottom: 4,
//   },

//   reportText: {
//     fontSize: 13,
//     color: '#333',
//     marginBottom: 3,
//   },
// });

// export default SpeciesReports;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Image,
} from 'react-native';
import Layout from '../components/layout/layout';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Buffer } from 'buffer';

// --- Color palette ---
const colors = {
  background: '#F6F1F1',
  primary: '#19A7CE',
  secondary: '#146C94',
  muted: '#AFD3E2',
  accent: '#AFD3E2',
  white: '#FFFFFF',
};

// --- Report Button Component ---
const ReportButton = ({ title, endpoint }) => {
  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/species/report/${endpoint}`, {
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const fileUri = FileSystem.documentDirectory + `${title.replace(/\s/g, '_')}.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' });

      const buttons = [
        {
          text: 'Share',
          onPress: async () => {
            try {
              await Sharing.shareAsync(fileUri);
            } catch (err) {
              console.error('Sharing error:', err);
              Alert.alert('Error', 'Unable to share file.');
            }
          },
        },
      ];

      if (Platform.OS === 'android') {
        buttons.push({
          text: 'Download',
          onPress: async () => {
            try {
              const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
              if (permissions.granted) {
                const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  `${title}.pdf`,
                  'application/pdf'
                );

                await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, base64, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                Alert.alert('Success', 'PDF downloaded successfully!');
              } else {
                Alert.alert('Permission Denied', 'Storage access is required to save the file.');
              }
            } catch (err) {
              console.error('Download error:', err);
              Alert.alert('Error', 'Failed to download the file.');
            }
          },
        });
      }

      buttons.push({ text: 'Cancel', style: 'cancel' });

      Alert.alert('Export Report', 'Do you want to share or download the report?', buttons);
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert('Error', 'Failed to export PDF report');
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

// --- Main Screen ---
const SpeciesReports = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedSearchBy, setSelectedSearchBy] = useState('Search By');
  const [searchText, setSearchText] = useState('');
  const [reports, setReports] = useState([]);

  const searchOptions = ['Location', 'Species Name'];

  const handleSelectOption = (option) => {
    setSelectedSearchBy(option);
    setIsDropdownVisible(false);
  };

  // --- Fetch reports from backend ---
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/report/getAllReportsResearcher`);
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
        Alert.alert('Error', 'Unable to fetch reports');
      }
    };

    fetchReports();
  }, []);

  // --- Filter reports based on search ---
  const filteredReports = reports.filter((report) => {
    if (!searchText.trim()) return true;

    const lowerSearch = searchText.toLowerCase();

    if (selectedSearchBy === 'Species Name') {
      return report.species?.CommonName?.toLowerCase().includes(lowerSearch);
    } else if (selectedSearchBy === 'Location') {
      return report.location?.description?.toLowerCase().includes(lowerSearch);
    }

    // Default: search across both fields
    return (
      report.species?.CommonName?.toLowerCase().includes(lowerSearch) ||
      report.location?.description?.toLowerCase().includes(lowerSearch)
    );
  });

  // --- Export Filtered Incident Reports ---
  const handleExportFilteredReports = async () => {
    if (filteredReports.length === 0) {
      Alert.alert('No Data', 'No reports available to export.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/report/exportFilteredReports`, filteredReports, {
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const fileUri = FileSystem.documentDirectory + `Filtered_Incident_Report.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: 'base64' });

      if (Platform.OS === 'android') {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            'Filtered_Incident_Report.pdf',
            'application/pdf'
          );
          await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          Alert.alert('Success', 'Filtered Incident Report downloaded successfully!');
        } else {
          Alert.alert('Permission Denied', 'Storage access is required to save the file.');
        }
      } else {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error exporting filtered reports:', error);
      Alert.alert('Error', 'Failed to export incident report.');
    }
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
            {/* Dropdown Button */}
            <TouchableOpacity
              style={styles.searchByButton}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <Text style={styles.searchByText}>{selectedSearchBy}</Text>
              <MaterialIcons
                name={isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
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

          {/* Search Results */}
          <View style={styles.searchResults}>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <View key={report._id} style={styles.reportCard}>
                  {/* Species Image */}
                  {report.species?.ImageURL && (
                    <Image
                      source={{ uri: report.species.ImageURL }}
                      style={styles.speciesImage}
                      resizeMode="cover"
                    />
                  )}

                  {/* Report Info */}
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitleText}>
                      Species Name: {report.species?.CommonName || 'Unknown'}
                    </Text>
                    <Text style={styles.reportSubText}>
                      Scientific Name: {report.species?.ScientificName || 'Unknown'}
                    </Text>
                    <Text style={styles.reportText}>
                      Protection Level: {report.species?.ProtectionLevel || 'N/A'}
                    </Text>
                    <Text style={styles.reportText}>
                      Incident Type: {report.incidentType || 'N/A'}
                    </Text>
                    <Text style={styles.reportText}>
                      Location: {report.location?.description || 'N/A'}
                    </Text>
                    <Text style={styles.reportText}>
                      Date:{' '}
                      {report.date
                        ? new Date(report.date).toISOString().split('T')[0]
                        : 'N/A'}
                    </Text>
                    <Text style={styles.reportText}>
                      Report Status: {report.status || 'N/A'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.searchResultsText}>No reports found</Text>
            )}
          </View>

          {/* Export Filtered Incident Report Button */}
          <TouchableOpacity style={styles.bottomExportButton} onPress={handleExportFilteredReports}>
            <Ionicons name="download-outline" size={20} color={colors.white} />
            <Text style={styles.bottomExportText}>Export Incident Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 7,
  },
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
  reportTitle: { fontSize: 16, color: '#000' },
  exportButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
  },
  exportButtonText: { color: colors.white, fontWeight: 'bold' },

  // Search Section
  searchContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchBar: { flexDirection: 'row', marginBottom: 10 },
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
    height: 40,
  },
  searchByText: { fontSize: 14, color: colors.secondary, marginRight: 5 },
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
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1, fontSize: 14, color: '#000' },
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
  dropdownItemText: { color: colors.secondary, fontSize: 14 },

  // Search Results
  searchResults: { padding: 10, marginTop: 20 },
  searchResultsText: { color: 'gray', fontSize: 14, textAlign: 'center' },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  speciesImage: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10 },
  reportInfo: { paddingHorizontal: 5 },
  reportTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
  },
  reportSubText: { fontSize: 14, fontStyle: 'italic', color: '#444', marginBottom: 4 },
  reportText: { fontSize: 13, color: '#333', marginBottom: 3 },

  // Bottom Export Button
  bottomExportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  bottomExportText: { color: colors.white, fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
});

export default SpeciesReports;
