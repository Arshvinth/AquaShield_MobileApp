import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Rect, Text as SvgText, G } from 'react-native-svg';

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

export function FrequencyChart({ data }) {
  const chartWidth = Math.max(screenWidth - 32, 250); // Account for card padding and margins
  const chartHeight = 300;
  const padding = 50;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  if (!data || data.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Incident Frequency Over Time</Text>
          <Text style={styles.cardDescription}>Monthly incidents and prevention success</Text>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        </View>
      </View>
    );
  }

  // Calculate scales
  const maxIncidents = Math.max(...data.map(d => d.incidents || 0));
  const maxPrevented = Math.max(...data.map(d => d.prevented || 0));
  const maxValue = Math.max(maxIncidents, maxPrevented);

  const xScale = data.length > 1 ? graphWidth / (data.length - 1) : 0;
  const yScale = graphHeight / maxValue;

  // Generate points for both lines
  const incidentPoints = data.map((item, index) => ({
    x: padding + index * xScale,
    y: padding + graphHeight - ((item.incidents || 0) * yScale)
  }));

  const preventedPoints = data.map((item, index) => ({
    x: padding + index * xScale,
    y: padding + graphHeight - ((item.prevented || 0) * yScale)
  }));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Incident Frequency Over Time</Text>
        <Text style={styles.cardDescription}>Monthly incidents and prevention success</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid Lines */}
          <G>
            {[0, 1, 2, 3].map(i => (
              <Line
                key={i}
                x1={padding}
                y1={padding + (graphHeight / 3) * i}
                x2={padding + graphWidth}
                y2={padding + (graphHeight / 3) * i}
                stroke={COLORS.muted}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}
          </G>

          {/* X Axis */}
          <Line
            x1={padding}
            y1={padding + graphHeight}
            x2={padding + graphWidth}
            y2={padding + graphHeight}
            stroke={COLORS.border}
            strokeWidth="2"
          />

          {/* Y Axis */}
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={padding + graphHeight}
            stroke={COLORS.border}
            strokeWidth="2"
          />

          {/* X Axis Labels */}
          {data.map((item, index) => (
            <SvgText
              key={index}
              x={padding + index * xScale}
              y={padding + graphHeight + 20}
              fontSize="10"
              fill={COLORS.mutedForeground}
              textAnchor="middle"
            >
              {item.month}
            </SvgText>
          ))}

          {/* Y Axis Labels */}
          {[0, Math.round(maxValue / 2), maxValue].map((value, index) => (
            <SvgText
              key={index}
              x={padding - 10}
              y={padding + graphHeight - (value * yScale)}
              fontSize="10"
              fill={COLORS.mutedForeground}
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {Math.round(value)}
            </SvgText>
          ))}

          {/* Incident Line */}
          {incidentPoints.map((point, index) => {
            if (index === 0) return null;
            return (
              <Line
                key={`incident-${index}`}
                x1={incidentPoints[index - 1].x}
                y1={incidentPoints[index - 1].y}
                x2={point.x}
                y2={point.y}
                stroke={COLORS.destructive}
                strokeWidth="3"
              />
            );
          })}

          {/* Prevented Line */}
          {preventedPoints.map((point, index) => {
            if (index === 0) return null;
            return (
              <Line
                key={`prevented-${index}`}
                x1={preventedPoints[index - 1].x}
                y1={preventedPoints[index - 1].y}
                x2={point.x}
                y2={point.y}
                stroke={COLORS.primary}
                strokeWidth="3"
              />
            );
          })}

          {/* Incident Data Points */}
          {incidentPoints.map((point, index) => (
            <Rect
              key={`incident-point-${index}`}
              x={point.x - 4}
              y={point.y - 4}
              width="8"
              height="8"
              fill={COLORS.destructive}
              rx="4"
            />
          ))}

          {/* Prevented Data Points */}
          {preventedPoints.map((point, index) => (
            <Rect
              key={`prevented-point-${index}`}
              x={point.x - 4}
              y={point.y - 4}
              width="8"
              height="8"
              fill={COLORS.primary}
              rx="4"
            />
          ))}

          {/* Legend */}
          <G>
            {/* Total Incidents Legend */}
            <Rect
              x={padding + 10}
              y={padding - 30}
              width="12"
              height="12"
              fill={COLORS.destructive}
              rx="2"
            />
            <SvgText
              x={padding + 30}
              y={padding - 20}
              fontSize="12"
              fill={COLORS.cardForeground}
              textAnchor="start"
            >
              Total Incidents
            </SvgText>

            {/* Prevented Legend */}
            <Rect
              x={padding + 120}
              y={padding - 30}
              width="12"
              height="12"
              fill={COLORS.primary}
              rx="2"
            />
            <SvgText
              x={padding + 140}
              y={padding - 20}
              fontSize="12"
              fill={COLORS.cardForeground}
              textAnchor="start"
            >
              Prevented
            </SvgText>
          </G>
        </Svg>
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
});

export default FrequencyChart;