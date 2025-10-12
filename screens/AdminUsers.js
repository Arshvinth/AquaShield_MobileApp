import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../components/layout/layout';

const AdminUsers = () => {
  return (
    <Layout title="USER MANAGEMENT">
      <View style={styles.container}>
        <Text style={styles.title}>Users Screen</Text>
        <Text>User management content goes here</Text>
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

export default AdminUsers;