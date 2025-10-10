import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Layout from '../components/layout/Layout';
import ReportFilters from '../components/adminReports/ReportFilters';
import ReportsTable from '../components/adminReports/ReportsTable';
// import ReportDetailsDialog from '../components/adminReports/ReportDetailsDialog';

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

// Mock API function - replace with your actual API
const getAllReports = async () => {
  return [
    {
      _id: '1',
      species: 'Bluefin Tuna',
      location: 'North Pacific Ocean',
      status: 'PENDING',
      date: '2024-01-15',
      time: '14:30',
      description: 'Illegal fishing activity detected near international waters',
      evidencePhotos: ['photo1.jpg'],
      coordinates: [35.0, -150.0]
    },
    {
      _id: '2',
      species: 'Atlantic Salmon',
      location: 'Atlantic Coast',
      status: 'APPROVED',
      date: '2024-01-14',
      time: '10:15',
      description: 'Unauthorized fishing vessel spotted',
      evidencePhotos: ['photo2.jpg', 'photo3.jpg'],
      coordinates: [25.0, -70.0]
    },
    {
      _id: '3',
      species: 'Mackerel',
      location: 'Indian Ocean',
      status: 'REJECTED',
      date: '2024-01-13',
      time: '16:45',
      description: 'False alarm - legal fishing activity',
      evidencePhotos: [],
      coordinates: [-20.0, 70.0]
    },
    {
      _id: '4',
      species: 'Cod',
      location: 'Mediterranean Sea',
      status: 'PENDING',
      date: '2024-01-12',
      time: '09:20',
      description: 'Suspicious fishing vessel without proper identification',
      evidencePhotos: ['photo4.jpg'],
      coordinates: [35.0, 18.0]
    },
    {
      _id: '5',
      species: 'Sardines',
      location: 'South China Sea',
      status: 'APPROVED',
      date: '2024-01-11',
      time: '13:45',
      description: 'Confirmed illegal fishing operation',
      evidencePhotos: ['photo5.jpg', 'photo6.jpg'],
      coordinates: [12.0, 113.0]
    }
  ];
};

export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout title="Reports">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title="REPORT MANAGEMENT">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReportFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <ReportsTable 
          reports={filteredReports}
          onViewReport={setSelectedReport}
        />
        
        {/* <ReportDetailsDialog 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        /> */}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default AdminReports;