import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import StatusBadge from '../adminReports/StatusBadge';

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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function RecentReports({ reports }) {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Recent Reports</Text>
        <Text style={styles.cardDescription}>
          Latest illegal fishing activity reports
        </Text>
      </View>
      
      {/* Card Content */}
      <View style={styles.cardContent}>
        {(!reports || reports.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent reports</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.reportsList}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {reports.map((report, idx) => (
              <ReportItem
                key={report.id}
                report={report}
                isLast={idx === reports.length - 1}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function ReportItem({ report, isLast }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.reportItem, !isLast && { marginBottom: 10 }]}>
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportId}>#{report.id}</Text>
        </View>
        <Text style={styles.reportDetails}>
          {report.species} • {report.location?.description || report.location}
        </Text>
        <Text style={styles.reportDate}>
          {report.date ? formatDate(report.date) : 'Date not available'}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <StatusBadge status={report.status} />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
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
  cardContent: {
    flex: 1,
    minHeight: 120,
    maxHeight: screenHeight * 0.4, // 40% of screen height for scrollable area
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: 'center',
  },
  reportsList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  reportContent: {
    flex: 1,
    marginRight: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cardForeground,
  },
  reportDetails: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    opacity: 0.8,
  },
  statusContainer: {
    // Status badge container
  },
});

export default RecentReports;