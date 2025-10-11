import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';

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

export function SpeciesBarChart({ data }) {
  const chartWidth = Math.max(screenWidth - 32, 250); // Account for card padding and margins
  const chartHeight = 300;
  const padding = { left: 80, right: 20, top: 50, bottom: 50 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  if (!data || data.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Most Reported Species</Text>
          <Text style={styles.cardDescription}>Top 5 species most commonly involved in illegal fishing</Text>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        </View>
      </View>
    );
  }

  // Sort by count in descending order and take only top 5
  const topFiveSpecies = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate scales
  const maxCount = Math.max(...topFiveSpecies.map(d => d.count));
  const barWidth = (graphWidth / topFiveSpecies.length) * 0.6;
  const xScale = graphWidth / topFiveSpecies.length;
  const yScale = graphHeight / maxCount;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Most Reported Species</Text>
        <Text style={styles.cardDescription}>Top 5 species most commonly involved in illegal fishing</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid Lines */}
          <G>
            {[0, 1, 2, 3].map(i => (
              <Line
                key={i}
                x1={padding.left}
                y1={padding.top + (graphHeight / 3) * i}
                x2={padding.left + graphWidth}
                y2={padding.top + (graphHeight / 3) * i}
                stroke={COLORS.muted}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}
          </G>

          {/* X Axis */}
          <Line
            x1={padding.left}
            y1={padding.top + graphHeight}
            x2={padding.left + graphWidth}
            y2={padding.top + graphHeight}
            stroke={COLORS.border}
            strokeWidth="2"
          />

          {/* Y Axis */}
          <Line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + graphHeight}
            stroke={COLORS.border}
            strokeWidth="2"
          />

          {/* Y Axis Labels */}
          {[0, Math.round(maxCount / 2), maxCount].map((value, index) => (
            <SvgText
              key={index}
              x={padding.left - 10}
              y={padding.top + graphHeight - (value * yScale)}
              fontSize="10"
              fill={COLORS.mutedForeground}
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {Math.round(value)}
            </SvgText>
          ))}

          {/* Bars */}
          {topFiveSpecies.map((species, index) => {
            const barHeight = species.count * yScale;
            const x = padding.left + index * xScale + (xScale - barWidth) / 2;
            const y = padding.top + graphHeight - barHeight;

            return (
              <G key={index}>
                {/* Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={COLORS.primary}
                  rx="4"
                />
                
                {/* Value Label on top of bar */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 8}
                  fontSize="10"
                  fill={COLORS.mutedForeground}
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {species.count}
                </SvgText>

                {/* Species Label below bar */}
                <SvgText
                  x={x + barWidth / 2}
                  y={padding.top + graphHeight + 20}
                  fontSize="10"
                  fill={COLORS.mutedForeground}
                  textAnchor="middle"
                >
                  {species.species.length > 8 
                    ? species.species.substring(0, 8) + '...' 
                    : species.species
                  }
                </SvgText>

                {/* Full species name on hover equivalent - we'll show it as a label */}
                {species.species.length > 8 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={padding.top + graphHeight + 35}
                    fontSize="9"
                    fill={COLORS.mutedForeground}
                    textAnchor="middle"
                    opacity={0.8}
                  >
                    {species.species}
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Chart Title */}
          <SvgText
            x={chartWidth / 2}
            y={padding.top - 20}
            fontSize="12"
            fill={COLORS.cardForeground}
            textAnchor="middle"
            fontWeight="600"
          >
            Reports by Species
          </SvgText>

          {/* Y Axis Title */}
          <SvgText
            x={padding.left - 40}
            y={padding.top + graphHeight / 2}
            fontSize="10"
            fill={COLORS.mutedForeground}
            textAnchor="middle"
            transform={`rotate(-90, ${padding.left - 40}, ${padding.top + graphHeight / 2})`}
          >
            Number of Reports
          </SvgText>
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

export default SpeciesBarChart;