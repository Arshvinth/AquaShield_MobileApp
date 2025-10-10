import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const COLORS = {
  background: '#F6F1F1',
  foreground: '#2C3E50',
  card: '#FFFFFF',
  cardForeground: '#2C3E50',
  primary: '#19A7CE',
  primaryForeground: '#FFFFFF',
  secondary: '#146C94',
  secondaryForeground: '#FFFFFF',
  muted: '#AFD3E2',
  mutedForeground: '#34495E',
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  border: '#D6DBDF',
  success: '#16A34A',
};

const { width, height } = Dimensions.get('window');

// Mock API function
const getRecentReports = async () => {
  return [
    {
      id: 1,
      species: 'Tuna',
      location: {
        description: 'Colombo Port',
        coordinates: [79.8612, 6.9271] // Colombo
      },
      status: 'PENDING',
      date: '2024-01-15',
      time: '14:30',
      description: 'Illegal fishing activity detected near port',
    },
    {
      id: 2,
      species: 'Salmon',
      location: {
        description: 'Eastern Coast',
        coordinates: [81.7729, 7.2964] // East of Sri Lanka
      },
      status: 'CONFIRMED',
      date: '2024-01-14',
      time: '10:15',
      description: 'Unauthorized fishing vessel spotted',
    },
    {
      id: 3,
      species: 'Mackerel',
      location: {
        description: 'Southern Coast',
        coordinates: [80.4037, 5.9496] // Galle
      },
      status: 'REJECTED',
      date: '2024-01-13',
      time: '16:45',
      description: 'False alarm - legal fishing activity',
    }
  ];
};

const SRI_LANKA_REGION = {
  latitude: 7.8731,
  longitude: 80.7718,
  latitudeDelta: 3.0,
  longitudeDelta: 3.0,
};

export default function ActivityMap() {
  const [recentReports, setRecentReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getRecentReports().then(setRecentReports).catch(console.error);
  }, []);

  const getReportPosition = (report) => {
    if (report.location && report.location.coordinates) {
      const [lng, lat] = report.location.coordinates;
      return { 
        latitude: typeof lat === 'number' ? lat : parseFloat(lat),
        longitude: typeof lng === 'number' ? lng : parseFloat(lng)
      };
    }
    return null;
  };

  const handleMarkerPress = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return COLORS.success;
      case 'REJECTED': return COLORS.destructive;
      case 'PENDING': return '#F59E0B';
      default: return COLORS.mutedForeground;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmed';
      case 'REJECTED': return 'Rejected';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={SRI_LANKA_REGION}
      >
        {recentReports.map((report) => {
          const position = getReportPosition(report);
          if (!position) return null;
          
          return (
            <Marker
              key={report.id}
              coordinate={position}
              onPress={() => handleMarkerPress(report)}
              pinColor={getStatusColor(report.status)}
            />
          );
        })}
      </MapView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Fishing Report #{selectedReport.id}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Species:</Text>
                    <Text style={styles.infoValue}>{selectedReport.species}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoValue}>{selectedReport.location?.description}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(selectedReport.date)}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Time:</Text>
                    <Text style={styles.infoValue}>{selectedReport.time}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                      {getStatusText(selectedReport.status)}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Description:</Text>
                    <Text style={styles.infoValue}>{selectedReport.description}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.cardForeground,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.mutedForeground,
  },
  modalBody: {
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.mutedForeground,
    width: '30%',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.cardForeground,
    width: '70%',
    textAlign: 'right',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});