import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Layout from '../components/layout/Layout';
import AnalyticsFilters from '../components/adminStatistics/AnalyticsFilters';
import KeyMetrics from '../components/adminStatistics/KeyMetrics';
import ChartsGrid from '../components/adminStatistics/ChartsGrid';

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

// Mock API functions - replace with your actual API calls
const getFrequencyData = async () => {
  return [
    { month: 'Jan', incidents: 45, prevented: 38 },
    { month: 'Feb', incidents: 52, prevented: 45 },
    { month: 'Mar', incidents: 38, prevented: 32 },
    { month: 'Apr', incidents: 67, prevented: 58 },
    { month: 'May', incidents: 58, prevented: 50 },
    { month: 'Jun', incidents: 72, prevented: 65 },
  ];
};

const getSpeciesStats = async () => {
  return [
    { species: 'Bluefin Tuna', count: 24 },
    { species: 'Atlantic Salmon', count: 18 },
    { species: 'Atlantic Cod', count: 15 },
    { species: 'Mackerel', count: 12 },
    { species: 'Sardines', count: 9 },
    { species: 'Swordfish', count: 7 },
    { species: 'Yellowfin Tuna', count: 6 },
  ];
};

const getStatusData = async () => {
  return [
    { status: 'Approved', count: 156, percentage: 65 },
    { status: 'Pending', count: 23, percentage: 10 },
    { status: 'Rejected', count: 45, percentage: 19 },
    { status: 'Under Review', count: 16, percentage: 6 },
  ];
};

export function AdminAnalytics() {
  const [frequency, setFrequency] = useState([]);
  const [species, setSpecies] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [freqData, speciesData, statusData] = await Promise.all([
          getFrequencyData(),
          getSpeciesStats(),
          getStatusData()
        ]);
        setFrequency(freqData);
        setSpecies(speciesData);
        setStatus(statusData);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout title="STATISTICS & ANALYTICS">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title="STATISTICS & ANALYTICS">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnalyticsFilters />
        <KeyMetrics />
        <ChartsGrid frequency={frequency} species={species} status={status} />
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

export default AdminAnalytics;