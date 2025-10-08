import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsGrid = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text>Stats Grid Component - Total Reports: {stats.totalReports}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default StatsGrid;