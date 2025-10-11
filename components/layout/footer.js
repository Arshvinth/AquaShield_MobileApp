import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 Aqua Shield</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: '#146C94',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 2,
    marginBottom:-75
  },
  text: {
    color: '#F6F1F1',
    fontSize: 14,
  },
});

export default Footer;
