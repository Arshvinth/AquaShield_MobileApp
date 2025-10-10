import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FrequencyChart from './charts/FrequencyChart';
import StatusPieChart from './charts/StatusPieChart';
import SpeciesBarChart from './charts/SpeciesBarChart';
import HotspotsList from './HotspotsList';

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

const { width: screenWidth } = Dimensions.get('window');

export function ChartsGrid({ frequency, species, status }) {
  return (
    <View style={styles.container}>
      {/* First Row: FrequencyChart and StatusPieChart */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <FrequencyChart data={frequency} />
        </View>
        <View style={styles.halfColumn}>
          <StatusPieChart data={status} />
        </View>
      </View>
      
      {/* Second Row: SpeciesBarChart and HotspotsList */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <SpeciesBarChart data={species} />
        </View>
        <View style={styles.halfColumn}>
          <HotspotsList />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    gap: 16,
  },
  halfColumn: {
    flex: 1,
    minWidth: screenWidth > 768 ? '48%' : '100%',
    paddingHorizontal: 8,
  },
});

export default ChartsGrid;