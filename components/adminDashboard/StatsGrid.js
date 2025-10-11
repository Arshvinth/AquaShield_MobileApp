import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Your color scheme converted to React Native
const COLORS = {
  background: '#F6F1F1',
  foreground: '#2C3E50', // 205 30% 20%
  card: '#FFFFFF',
  cardForeground: '#2C3E50',
  primary: '#19A7CE',
  primaryForeground: '#FFFFFF',
  secondary: '#146C94',
  secondaryForeground: '#FFFFFF',
  muted: '#AFD3E2',
  mutedForeground: '#34495E', // 205 30% 25%
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  border: '#D6DBDF', // 205 25% 85%
  success: '#16A34A', // green color for approved
};

const statCards = [
  {
    key: "totalReports",
    title: "Total Reports",
    icon: "document-text",
    iconType: "ionicons",
    color: "default",
    description: "+12% from last month"
  },
  {
    key: "successRate",
    title: "Success Rate",
    icon: "trending-up",
    iconType: "ionicons",
    color: "primary",
    description: "+2% from last month",
    format: (value) => `${value}%`
  },
  {
    key: "approved",
    title: "Approved",
    icon: "checkmark-circle",
    iconType: "ionicons",
    color: "success",
    description: "This month"
  },
  {
    key: "pending",
    title: "Pending Review",
    icon: "time",
    iconType: "ionicons",
    color: "destructive",
    description: "Requires immediate attention",
    showCondition: (value) => value > 0
  }
];

const StatsGrid = ({ stats }) => {
  return (
    <View style={styles.gridContainer}>
      {statCards.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={stats[stat.key]}
          icon={stat.icon}
          iconType={stat.iconType}
          color={stat.color}
          description={stat.description}
          showCondition={stat.showCondition}
          format={stat.format}
        />
      ))}
    </View>

  );
};

function StatCard({ title, value, icon, iconType, color, description, showCondition, format }) {
  // Determine value color based on color prop
  const getValueColor = () => {
    switch (color) {
      case "destructive":
        return COLORS.destructive;
      case "success":
        return COLORS.success;
      case "primary":
        return COLORS.primary;
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
      case "primary":
        return COLORS.primary;
      default:
        return COLORS.mutedForeground;
    }
  };

  const displayValue = format ? format(value) : value;
  const shouldShowDescription = !showCondition || showCondition(value);
  const valueColor = getValueColor();
  const iconColor = getIconColor();

  const renderIcon = () => {
    const iconProps = {
      size: 20,
      color: iconColor,
    };

    if (iconType === 'material') {
      return <MaterialIcons name={icon} {...iconProps} />;
    } else {
      return <Ionicons name={icon} {...iconProps} />;
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {renderIcon()}
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={[styles.value, { color: valueColor }]}>{displayValue}</Text>
        {shouldShowDescription && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: '48%', // 2 columns on mobile
    marginHorizontal: 8,
    marginBottom: 16,
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

export default StatsGrid;