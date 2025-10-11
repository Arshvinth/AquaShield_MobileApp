import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('ResearcherTabs'); // navigate to your Login screen
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.centerBox}>
        <Text style={styles.title}>Welcome to AquaShield</Text>

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login as Researcher</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',  
    alignItems: 'center',      
    backgroundColor: '#F6F1F1',
    padding: 20,
  },
  centerBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '90%', 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C94',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#19A7CE',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LandingPage;
