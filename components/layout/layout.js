import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = ({ title, children, showHeader = true, showFooter = true }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Title below header */}
        {title && <Text style={styles.title}>{title}</Text>}

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {children}
        </ScrollView>
      </View>      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1F1',
  },
  container: {
    flex: 1,
  },
  title: {
    height: 70,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#146C94',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    marginTop: 30,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default Layout;