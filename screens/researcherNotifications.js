import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Add new species request accepted', icon: 'checkmark-done-outline' },
    { id: '2', title: 'Species request status changed', icon: 'sync-circle-outline' },
    { id: '3', title: 'Exported report', icon: 'document-text-outline' },
    { id: '4', title: 'Exported report', icon: 'document-text-outline' },
    { id: '5', title: 'New illegal species report found', icon: 'alert-circle-outline' },
    { id: '6', title: 'Message from AquaShield Team', icon: 'chatbubble-ellipses-outline' },
  ]);

  const handleDelete = id => {
    setNotifications(notifications.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.leftContent}>
        <Ionicons name={item.icon} size={22} color="#146C94" style={{ marginRight: 10 }} />
        <Text style={styles.notificationText}>{item.title}</Text>
      </View>

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <MaterialCommunityIcons name="delete-outline" size={22} color="#146C94" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {notifications.length > 0 ? (
          <>
            <FlatList
              data={notifications}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <TouchableOpacity style={styles.clearAllButton} onPress={clearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#AFD3E2" />
            <Text style={styles.emptyText}>No new notifications</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F1F1',
    padding: 16,
    paddingBottom: 150,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#AFD3E2',
    shadowColor: '#146C94',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#AFD3E2',
    opacity: 0.6,
  },
  clearAllButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  clearAllText: {
    color: '#146C94',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#AFD3E2',
    fontSize: 16,
    fontWeight: '500',
  },
});
