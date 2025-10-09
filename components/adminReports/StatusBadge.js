import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
      case 'under review':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#92400E',
          label: 'Pending'
        };
      case 'approved':
        return {
          backgroundColor: '#DCFCE7',
          textColor: '#166534',
          label: 'Approved'
        };
      case 'rejected':
      case 'denied':
        return {
          backgroundColor: '#FEE2E2',
          textColor: '#991B1B',
          label: 'Rejected'
        };
      case 'completed':
        return {
          backgroundColor: '#DBEAFE',
          textColor: '#1E40AF',
          label: 'Completed'
        };
      default:
        return {
          backgroundColor: COLORS.muted,
          textColor: COLORS.mutedForeground,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StatusBadge;