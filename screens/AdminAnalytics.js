import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../components/layout/Layout';

const AdminAnalytics = () => {
  return (
    <Layout title="STATISTICS & ANALYTICS">
      <View style={styles.container}>
        <Text style={styles.title}>Analytics Content</Text>
        <Text>This is where you'll build the Analytics from your screenshot</Text>
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

export default AdminAnalytics;