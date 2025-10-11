import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getKeyMetrics } from '../../api/reportApi';

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
// const getKeyMetrics = async () => {
//   return {
//     totalIncidents: "2,847",
//     prevented: "2,634",
//     preventionRate: 92.6,
//     activeHotspots: 23,
//   };
// };

export function KeyMetrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    getKeyMetrics().then((data) => {
      setMetrics([
        {
          title: "Total Incidents",
          value: data.totalIncidents,
          description: "+8.2% from last year",
          icon: "trending-up",
          iconType: "ionicons",
          color: "default",
        },
        {
          title: "Prevented",
          value: data.prevented,
          description: `${data.preventionRate}% prevention rate`,
          icon: "fish",
          iconType: "material",
          color: "success",
        },
        {
          title: "Active Hotspots",
          value: data.activeHotspots,
          description: data.activeHotspots > 0 ? "Requiring immediate attention" : "",
          icon: "location",
          iconType: "ionicons",
          color: "destructive",
        },
        {
          title: "Response Time",
          value: "2.4h",
          description: "Average response time",
          icon: "time",
          iconType: "ionicons",
          color: "default",
        },
      ]);
    });
  }, []);

  return (
    <View style={styles.gridContainer}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </View>
  );
}

function MetricCard({ title, value, description, icon, iconType, color }) {
  const getValueColor = () => {
    switch (color) {
      case "destructive":
        return COLORS.destructive;
      case "success":
        return COLORS.success;
      default:
        return COLORS.cardForeground;
    }
  };

  const getIconColor = () => {
    switch (color) {
      case "destructive":
        return COLORS.destructive;
      case "success":
        return COLORS.success;
      default:
        return COLORS.mutedForeground;
    }
  };

  const renderIcon = () => {
    const iconProps = {
      size: 20,
      color: getIconColor(),
    };

    if (iconType === 'material') {
      return <MaterialIcons name={icon} {...iconProps} />;
    } else {
      return <Ionicons name={icon} {...iconProps} />;
    }
  };

  const valueColor = getValueColor();

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {renderIcon()}
      </View>
      
      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    minWidth: '48%', // 2 columns on mobile
    marginHorizontal: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.mutedForeground,
    flex: 1,
    marginRight: 8,
  },
  cardContent: {
    // Content styles
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    lineHeight: 16,
  },
});

export default KeyMetrics;