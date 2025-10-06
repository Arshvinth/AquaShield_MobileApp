import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HeaderRight = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
      {/* Notification Icon */}
      <TouchableOpacity onPress={() => navigation.navigate('ResearcherNotifications')}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="rgba(30,144,255,0.8)"
          style={{ marginRight: 10 }}
        />
      </TouchableOpacity>

      {/* Aquashield text */}
      <Text
        style={{
          fontWeight: 'bold',
          color: 'rgba(30,144,255,0.5)',
          fontSize: 18,
        }}
      >
        Aquashield
      </Text>
    </View>
  );
};

export default HeaderRight;
