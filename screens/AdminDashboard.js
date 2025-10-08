import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Layout from '../components/layout/Layout';

// We'll create these components next
import StatsGrid from '../components/adminDashboard/StatsGrid';
// import ChartsGrid from '../components/adminDashboard/ChartsGrid';
// import RecentReports from '../components/adminDashboard/RecentReports';
// import ActivityMapCard from '../components/adminDashboard/ActivityMapCard';

// Mock API functions - replace with your actual API calls
const getMonthlyStats = async () => {
  // Mock data - replace with actual API call
  return {
    totalReports: 2847,
    pending: 23,
    approved: 156,
    successRate: 92.6,
  };
};

const getRecentReports = async () => {
  // Mock data - replace with actual API call
  return [
    { id: 1, species: 'Tuna', location: 'North Pacific', status: 'Pending' },
    { id: 2, species: 'Salmon', location: 'Atlantic', status: 'Approved' },
    { id: 3, species: 'Mackerel', location: 'Indian Ocean', status: 'Under Review' },
  ];
};

const getTrendData = async () => {
  // Mock data - replace with actual API call
  return [
    { month: 'Jan', incidents: 45 },
    { month: 'Feb', incidents: 52 },
    { month: 'Mar', incidents: 38 },
    { month: 'Apr', incidents: 67 },
    { month: 'May', incidents: 58 },
    { month: 'Jun', incidents: 72 },
  ];
};

const getSpeciesData = async () => {
  // Mock data - replace with actual API call
  return [
    { species: 'Tuna', reports: 24 },
    { species: 'Salmon', reports: 16 },
    { species: 'Cod', reports: 12 },
    { species: 'Mackerel', reports: 6 },
    { species: 'Sardines', reports: 3 },
  ];
};

const AdminDashboard = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pending: 0,
    approved: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [recentData, trendData, speciesData, statsData] = await Promise.all([
          getRecentReports(),
          getTrendData(),
          getSpeciesData(),
          getMonthlyStats()
        ]);
        
        setRecentReports(recentData);
        setTrendData(trendData);
        setSpeciesData(speciesData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout title="ADMIN DASHBOARD">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146C94" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title="ADMIN DASHBOARD">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <StatsGrid stats={stats} />
        
        {/* Recent Reports and Activity Map */}
        <View style={styles.row}>
          <View style={styles.halfColumn}>
            {/* <RecentReports reports={recentReports} /> */}
          </View>
          <View style={styles.halfColumn}>
            {/* <ActivityMapCard /> */}
          </View>
        </View>

        {/* Charts Grid */}
        {/* <ChartsGrid trendData={trendData} speciesData={speciesData} /> */}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    color: '#146C94',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  halfColumn: {
    width: '50%',
    paddingHorizontal: 8,
  },
});

export default AdminDashboard;