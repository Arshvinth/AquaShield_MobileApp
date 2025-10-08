import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentReports = ({ reports }) => {
  return (
    <View style={styles.container}>
      <Text>Recent Reports Component</Text>
      {reports.map(report => (
        <Text key={report.id}>{report.species} - {report.location}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default RecentReports;