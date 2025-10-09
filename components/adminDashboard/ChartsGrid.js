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

const ChartsGrid = ({ trendData, speciesData }) => {
  return (
    <View style={styles.gridContainer}>
      <IncidentTrendsChart data={trendData} />
      <TopSpeciesChart data={speciesData} />
    </View>
  );
};

function IncidentTrendsChart({ data }) {
  const chartWidth = screenWidth - 80; // Account for padding
  const chartHeight = 200;
  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => d.incidents));
  const xScale = graphWidth / (data.length - 1);
  const yScale = graphHeight / maxValue;

  // Generate points for the line
  const points = data.map((item, index) => ({
    x: padding + index * xScale,
    y: padding + graphHeight - (item.incidents * yScale)
  }));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Incident Trends</Text>
        <Text style={styles.cardDescription}>
          Monthly illegal fishing incidents over time
        </Text>
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
          {[0, maxValue / 2, maxValue].map((value, index) => (
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

          {/* Line Chart */}
          {points.map((point, index) => {
            if (index === 0) return null;
            return (
              <Line
                key={index}
                x1={points[index - 1].x}
                y1={points[index - 1].y}
                x2={point.x}
                y2={point.y}
                stroke={COLORS.primary}
                strokeWidth="3"
              />
            );
          })}

          {/* Data Points */}
          {points.map((point, index) => (
            <Rect
              key={index}
              x={point.x - 4}
              y={point.y - 4}
              width="8"
              height="8"
              fill={COLORS.primary}
              rx="4"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}

function TopSpeciesChart({ data }) {
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;
  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => d.reports || d.count));
  const barWidth = (graphWidth / data.length) * 0.6;
  const xScale = graphWidth / data.length;
  const yScale = graphHeight / maxValue;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Most Reported Species</Text>
        <Text style={styles.cardDescription}>
          Species most commonly involved in illegal fishing
        </Text>
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

          {/* Bars */}
          {data.map((item, index) => {
            const value = item.reports || item.count;
            const barHeight = value * yScale;
            const x = padding + index * xScale + (xScale - barWidth) / 2;
            const y = padding + graphHeight - barHeight;

            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={COLORS.primary}
                  rx="2"
                />
                {/* Value Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fill={COLORS.mutedForeground}
                  textAnchor="middle"
                >
                  {value}
                </SvgText>
                {/* Species Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={padding + graphHeight + 20}
                  fontSize="10"
                  fill={COLORS.mutedForeground}
                  textAnchor="middle"
                >
                  {item.species}
                </SvgText>
              </G>
            );
          })}

          {/* Y Axis Labels */}
          {[0, maxValue / 2, maxValue].map((value, index) => (
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
        </Svg>
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
  },
  card: {
    flex: 1,
    minWidth: screenWidth > 768 ? '48%' : '100%',
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
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
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
});

export default ChartsGrid;