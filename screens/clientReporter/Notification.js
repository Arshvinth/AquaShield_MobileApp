import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { deleteNotify, getAllNotification, markAsReadNotify } from '../../src/services/notificationService';
import { SwipeListView } from "react-native-swipe-list-view";


export default function Notification({ userId }) {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const notify = await getAllNotification("68ce9ce7fcece28d887e4cf4");
            setNotifications(notify);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const mark = await markAsReadNotify(id);

            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await deleteNotify(id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));


        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;


    return (
        <SwipeListView
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.notification,
                        item.isRead ? styles.read : styles.unread,
                    ]}
                    onPress={() => markAsRead(item._id)}
                >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.date}>
                        {new Date(item.createdAt).toLocaleString()}
                    </Text>
                </TouchableOpacity>
            )}
            renderHiddenItem={({ item }) => (
                <View style={styles.hiddenContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteNotification(item._id)}
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
            rightOpenValue={-80} />

    )

}

const styles = StyleSheet.create({
    notification: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#19A7CE",
        borderRadius: 15,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,

    },
    unread: {
        backgroundColor: "#e0f7fa",
    },
    read: {
        backgroundColor: "#f9f9f9",
    },
    title: {
        color: "#146C96",
        fontWeight: "bold",
    },
    message: {

        marginTop: 3,
        color: "#146C96",
    },
    date: {
        marginTop: 4,
        fontSize: 12,
        color: "gray",
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 20,
        margin: 10,
        backgroundColor: "#146C96",
    },
    deleteButton: {
        width: 80,
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
});
