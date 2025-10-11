import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

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

const ReportsTable = ({ reports, onViewReport }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return COLORS.success;
      case 'PENDING': return '#F59E0B'; // Orange
      case 'REJECTED': return COLORS.destructive;
      default: return COLORS.mutedForeground;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (reports.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reports found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports ({reports.length})</Text>
      
      <ScrollView 
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
      >
        {reports.map((report, index) => (
          <TouchableOpacity
            key={report._id}
            style={styles.reportRow}
            onPress={() => onViewReport(report)}
          >
            <View style={styles.rowContent}>
              <View style={styles.rowMain}>
                <Text style={styles.speciesText}>{report.species}</Text>
                <Text style={styles.locationText}>{report.location}</Text>
              </View>
              
              <View style={styles.rowDetails}>
                <Text style={styles.dateText}>{formatDate(report.date)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {getStatusText(report.status)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.cardForeground,
    marginBottom: 16,
  },
  tableContainer: {
    maxHeight: 400,
  },
  reportRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowMain: {
    flex: 1,
  },
  speciesText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cardForeground,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  rowDetails: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: 'center',
  },
});

export default ReportsTable;