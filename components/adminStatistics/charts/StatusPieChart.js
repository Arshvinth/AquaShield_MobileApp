import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';

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

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.muted,
  // COLORS.success,
];

// Function to get color based on status name
const getColorByStatus = (statusName, index) => {
  // Use destructive color for PENDING status
  if (statusName?.toUpperCase() === 'PENDING') {
    return COLORS.destructive;
  }
  
  // Use success color for APPROVED status
  if (statusName?.toUpperCase() === 'APPROVED') {
    return COLORS.success;
  }
  
  // Use other colors for different statuses
  return CHART_COLORS[index % CHART_COLORS.length];
};

const { width: screenWidth } = Dimensions.get('window');

export function StatusPieChart({ data }) {
  const chartWidth = screenWidth - 96;
  const chartHeight = 300;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const outerRadius = 100;
  const innerRadius = 60;

  if (!data || data.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Report Status Breakdown</Text>
          <Text style={styles.cardDescription}>Distribution of report statuses</Text>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        </View>
      </View>
    );
  }

  // Add colors to each data item based on their status name
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: getColorByStatus(item.name || item.status, index),
    value: item.value || item.count || item.percentage || 0
  }));

  // Calculate total for percentages
  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  // Function to calculate pie slice coordinates
  const calculateSlice = (startAngle, percent) => {
    const angle = (percent / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);
    
    const innerX1 = centerX + innerRadius * Math.cos(startRad);
    const innerY1 = centerY + innerRadius * Math.sin(startRad);
    const innerX2 = centerX + innerRadius * Math.cos(endRad);
    const innerY2 = centerY + innerRadius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = [
      `M ${innerX1} ${innerY1}`,
      `L ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${innerX2} ${innerY2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
      'Z'
    ].join(' ');
    
    return {
      path,
      startAngle,
      endAngle,
      midAngle: startAngle + angle / 2
    };
  };

  // Generate pie slices
  let currentAngle = 0;
  const slices = dataWithColors.map((item, index) => {
    const percent = (item.value / total) * 100;
    const slice = calculateSlice(currentAngle, percent);
    currentAngle += percent * 3.6; // Convert percent to degrees
    
    return {
      ...slice,
      data: item,
      percent: percent.toFixed(1)
    };
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Report Status Breakdown</Text>
        <Text style={styles.cardDescription}>Distribution of report statuses</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <G>
            {/* Pie Slices */}
            {slices.map((slice, index) => (
              <Path
                key={index}
                d={slice.path}
                fill={slice.data.color}
                stroke={COLORS.card}
                strokeWidth="2"
              />
            ))}
            
            {/* Center Text - Total */}
            <SvgText
              x={centerX}
              y={centerY - 10}
              fontSize="16"
              fontWeight="bold"
              fill={COLORS.cardForeground}
              textAnchor="middle"
            >
              {total}
            </SvgText>
            <SvgText
              x={centerX}
              y={centerY + 10}
              fontSize="12"
              fill={COLORS.mutedForeground}
              textAnchor="middle"
            >
              Total
            </SvgText>

            {/* Percentage Labels */}
            {slices.map((slice, index) => {
              if (slice.percent < 5) return null; // Don't show labels for very small slices
              
              const labelRadius = (outerRadius + innerRadius) / 2;
              const midRad = (slice.midAngle * Math.PI) / 180;
              const labelX = centerX + labelRadius * Math.cos(midRad);
              const labelY = centerY + labelRadius * Math.sin(midRad);
              
              return (
                <SvgText
                  key={index}
                  x={labelX}
                  y={labelY}
                  fontSize="10"
                  fill={COLORS.primaryForeground}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontWeight="500"
                >
                  {slice.percent}%
                </SvgText>
              );
            })}
          </G>
        </Svg>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          {dataWithColors.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: item.color }
                ]} 
              />
              <Text style={styles.legendText}>
                {item.name || item.status}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
});

export default StatusPieChart;