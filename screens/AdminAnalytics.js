import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Layout from '../components/layout/layout';
import AnalyticsFilters from '../components/adminStatistics/AnalyticsFilters';
import KeyMetrics from '../components/adminStatistics/KeyMetrics';
import ChartsGrid from '../components/adminStatistics/ChartsGrid';
import { getFrequencyData, getStatusData } from '../api/reportApi';
import { getSpeciesStats } from '../api/speciesApi';

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
        {/* <AnalyticsFilters /> */}
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