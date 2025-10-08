import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChartsGrid = ({ trendData, speciesData }) => {
  return (
    <View style={styles.container}>
      <Text>Charts Grid Component</Text>
      <Text>Trend Data: {trendData.length} items</Text>
      <Text>Species Data: {speciesData.length} items</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default ChartsGrid;