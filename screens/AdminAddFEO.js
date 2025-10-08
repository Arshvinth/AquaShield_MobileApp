import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../components/layout/Layout';

const AdminAddFEO = () => {
  return (
    <Layout title="Add FEO">
      <View style={styles.container}>
        <Text style={styles.title}>Add FEO Screen</Text>
        <Text>Add FEO content goes here</Text>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#146C94',
    marginBottom: 20,
  },
});

export default AdminAddFEO;