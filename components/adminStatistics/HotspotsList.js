// components/statistics/HotspotsList.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
const getHotspots = async () => {
  return [
    { region: 'North Pacific Ocean', lat: 35.0, lng: -150.0, incidents: 247 },
    { region: 'Atlantic Coast', lat: 25.0, lng: -70.0, incidents: 189 },
    { region: 'Indian Ocean', lat: -20.0, lng: 70.0, incidents: 156 },
    { region: 'Mediterranean Sea', lat: 35.0, lng: 18.0, incidents: 134 },
    { region: 'South China Sea', lat: 12.0, lng: 113.0, incidents: 112 },
  ];
};

export function HotspotsList() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    getHotspots().then((data) => setHotspots(data));
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Global Hotspots</Text>
        <Text style={styles.cardDescription}>Regions with highest illegal fishing activity</Text>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.hotspotsList}>
          {hotspots.map((hotspot, index) => (
            <HotspotItem key={index} hotspot={hotspot} index={index} />
          ))}
        </View>
        
        {/* Optional: Add interactive heatmap button later */}
        {/* <View style={styles.buttonContainer}>
          <Button variant="outline" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            View Interactive Heatmap
          </Button>
        </View> */}
      </View>
    </View>
  );
}

function HotspotItem({ hotspot, index }) {
  return (
    <View style={styles.hotspotItem}>
      <View style={styles.hotspotLeft}>
        <LinearGradient
          colors={['#19A7CE', '#146C94']}
          style={styles.rankBadge}
        >
          <Text style={styles.rankText}>{index + 1}</Text>
        </LinearGradient>
        
        <View style={styles.hotspotInfo}>
          <Text style={styles.regionName}>{hotspot.region}</Text>
          <Text style={styles.coordinates}>
            {hotspot.lat}°, {hotspot.lng}°
          </Text>
        </View>
      </View>
      
      <View style={styles.hotspotRight}>
        <Text style={styles.incidentCount}>{hotspot.incidents}</Text>
        <Text style={styles.incidentLabel}>incidents</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.cardForeground,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  cardContent: {
    // Content container
  },
  hotspotsList: {
    gap: 12,
  },
  hotspotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hotspotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryForeground,
  },
  hotspotInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.cardForeground,
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  hotspotRight: {
    alignItems: 'flex-end',
  },
  incidentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.destructive,
    marginBottom: 2,
  },
  incidentLabel: {
    fontSize: 11,
    color: COLORS.mutedForeground,
  },
  buttonContainer: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default HotspotsList;