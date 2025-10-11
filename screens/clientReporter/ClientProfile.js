import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { createNotification } from '../../src/services/notificationService';

export default function ClientProfile() {

    useEffect(async () => {
        const sendNotification = async () => {
            try {
                const notificationData = {
                    title: "Accessing Client Reporter Profile ",
                    message: "You have successfully accessed profile",
                };

                console.log("Sending notification:", notificationData);
                await createNotification(notificationData);
            } catch (error) {
                console.error("Failed to send notification:", error);
            }
        };

        sendNotification();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "Center", alignItems: "center" }}>
            <Text>ClientReport Incident</Text>
        </View>
    )
}
