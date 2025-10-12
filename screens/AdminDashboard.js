import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Layout from '../components/layout/layout';
import StatsGrid from '../components/adminDashboard/StatsGrid';
import ChartsGrid from '../components/adminDashboard/ChartsGrid';
import RecentReports from '../components/adminDashboard/RecentReports';
import ActivityMapCard from '../components/adminDashboard/ActivityMapCard';
import { 
  getMonthlyStats,
  getRecentReports, 
  getSpeciesData, 
  getTrendData 
} from '../api/reportApi';

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
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [recentData, trend, species, stats] = await Promise.all([
          getRecentReports(),
          getTrendData(),
          getSpeciesData(),
          getMonthlyStats(),
        ]);

        setRecentReports(recentData);
        setTrendData(trend);
        setSpeciesData(species);
        setStats(stats);

      } catch (error) {
        console.error("Error loading dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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
            <RecentReports reports={recentReports} />
          </View>
          <View style={styles.halfColumn}>
            {/* <ActivityMapCard /> */}
          </View>
        </View>

        {/* Charts Grid */}
        <ChartsGrid trendData={trendData} speciesData={speciesData} />
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
    width: '100%',
    paddingHorizontal: 8,
    minWidth: 300, // Ensure minimum width for larger screens
  },
});

export default AdminDashboard;