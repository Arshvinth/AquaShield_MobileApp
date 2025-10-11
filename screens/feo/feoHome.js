import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import FeoStatistics from '../../components/ui/feoStats'
import FeoChart from '../../components/ui/feoChart'
import RecentData from '../../components/ui/RecentData'

export default function feoHome() {
    return (
        <ScrollView style={styles.container}>
            <View style={{ flex: 1, justifyContent: "Center", alignItems: "center" }}>

                <FeoStatistics />

                <FeoChart />
                <RecentData />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F6F1F1",

    },
})
