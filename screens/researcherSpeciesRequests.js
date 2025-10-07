// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import Layout from '../components/layout/layout';
// import { MaterialIcons } from '@expo/vector-icons'; // For edit/delete iconss


// const sampleData = [
//   { id: 1, date: '2025-09-20', species: 'Tuna', status: 'Pending' },
//   { id: 2, date: '2025-09-18', species: 'Shark', status: 'Approved' },
//   { id: 3, date: '2025-09-15', species: 'Salmon', status: 'Rejected' },
// ];

// const ResearcherSpeciesRequests = ({ navigation }) => {
//   return (
//     <Layout>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Table Header */}
//         <View style={[styles.row, styles.headerRow]}>
//           <Text style={[styles.cell, styles.headerText, styles.dateSpeciesCol]}>Date - Species</Text>
//           <Text style={[styles.cell, styles.headerText, styles.statusCol]}>Status</Text>
//           <Text style={[styles.cell, styles.headerText, styles.actionCol]}>Action</Text>
//         </View>

//         {/* Table Rows */}
//         {sampleData.map((item) => (
//           <View key={item.id} style={styles.row}>
//             <Text style={[styles.cell, styles.dateSpeciesCol]}>
//               {item.date} - {item.species}
//             </Text>
//             <Text style={[styles.cell, styles.statusCol]}>{item.status}</Text>
//             <View style={[styles.cell, styles.actionCol]}>
//               <TouchableOpacity onPress={() => alert(`Edit ${item.species}`)} style={styles.iconBtn}>
//                 <MaterialIcons name="edit" size={20} color="#19A7CE" />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => alert(`Delete ${item.species}`)} style={styles.iconBtn}>
//                 <MaterialIcons name="delete" size={20} color="#FF4D4D" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         {/* Add New Species Request Button */}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => navigation.navigate('AddSpeciesRequest')}
//         >
//           <Text style={styles.addButtonText}>+ Add New Request</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 3,
//     backgroundColor: '#F6F1F1',
//     paddingBottom: 30,
//   },
//   row: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 2,
//     marginBottom: 5,
//     alignItems: 'center',
//     shadowColor: '#146C94',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   headerRow: {
//     backgroundColor: '#AFD3E2',
//     marginBottom: 5,
//   },
//   headerText: {
//     fontWeight: '700',
//     color: '#146C94',
//   },
//   cell: {
//     fontSize: 14,
//     color: '#146C94',
//     paddingHorizontal: 3,
//   },
//   dateSpeciesCol: { width: '50%' },
//   statusCol: { width: '25%' },
//   actionCol: { width: '25%', flexDirection: 'row', justifyContent: 'flex-start', gap: 5 },
//   iconBtn: { marginRight: 10 },
//   addButton: {
//     marginTop: '80%',
//     backgroundColor: '#19A7CE',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });

// export default ResearcherSpeciesRequests;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Layout from '../components/layout/layout';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // make sure you have this

const ResearcherSpeciesRequests = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch species requests from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/speciesRequest/getAllSpeciesRequests`);
      setData(res.data); // assuming your backend returns an array
    } catch (error) {
      console.error('Error fetching species requests:', error);
      Alert.alert('Error', 'Failed to fetch species requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (speciesId, speciesName) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${speciesName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/speciesRequest/deleteSpeciesRequest/${speciesId}`);
              Alert.alert("Deleted", `${speciesName} has been deleted.`);
              fetchData(); // Refresh the list
            } catch (err) {
              console.error("Delete failed:", err);
              Alert.alert("Error", "Failed to delete species request.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#19A7CE" />
          <Text style={{ color: '#146C94', marginTop: 10 }}>Loading...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText, styles.dateSpeciesCol]}>Date - Species</Text>
          <Text style={[styles.cell, styles.headerText, styles.statusCol]}>Status</Text>
          <Text style={[styles.cell, styles.headerText, styles.actionCol]}>Action</Text>
        </View>

        {/* Table Rows */}
        {data.length > 0 ? (
          data.map((item) => (
            <View key={item._id} style={styles.row}>
              <Text style={[styles.cell, styles.dateSpeciesCol]}>
                {item.updatedDate?.split('T')[0]} - {item.ScientificName || item.CommonName}
              </Text>
              <Text style={[styles.cell, styles.statusCol]}>{item.RequestStatus || 'Pending'}</Text>
              <View style={[styles.cell, styles.actionCol]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditRequest', { speciesId: item._id })}
                  style={styles.iconBtn}
                >
                  <MaterialIcons name="edit" size={20} color="#19A7CE" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item._id, item.ScientificName || item.CommonName)}
                  style={styles.iconBtn}
                >
                  <MaterialIcons name="delete" size={20} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#146C94' }}>
            No species requests found.
          </Text>
        )}

        {/* Add New Species Request Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddSpeciesRequest')}
        >
          <Text style={styles.addButtonText}>+ Add New Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
    backgroundColor: '#F6F1F1',
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 2,
    marginBottom: 5,
    alignItems: 'center',
    shadowColor: '#146C94',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    backgroundColor: '#AFD3E2',
    marginBottom: 5,
  },
  headerText: {
    fontWeight: '700',
    color: '#146C94',
  },
  cell: {
    fontSize: 14,
    color: '#146C94',
    paddingHorizontal: 3,
  },
  dateSpeciesCol: { width: '50%' },
  statusCol: { width: '25%' },
  actionCol: { width: '25%', flexDirection: 'row', justifyContent: 'flex-start', gap: 5 },
  iconBtn: { marginRight: 10 },
  addButton: {
    marginTop: '80%',
    backgroundColor: '#19A7CE',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ResearcherSpeciesRequests;
