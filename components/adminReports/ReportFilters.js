import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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

const ReportFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Reports</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by species, location, or ID..."
          placeholderTextColor={COLORS.mutedForeground}
          value={searchTerm}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Status:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusButtons}
        >
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusButton,
                statusFilter === option.value && styles.statusButtonActive
              ]}
              onPress={() => onStatusFilterChange(option.value)}
            >
              <Text style={[
                styles.statusButtonText,
                statusFilter === option.value && styles.statusButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.cardForeground,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersLabel: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginRight: 12,
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    paddingRight: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: COLORS.primaryForeground,
  },
});

export default ReportFilters;