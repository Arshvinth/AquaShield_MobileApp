import React from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import RecentData from '../../components/ui/RecentData';
import ReportChart from '../../components/ui/ReportChart';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ClientHomeScreen() {

    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>

            <View style={styles.row}>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Report')}>
                    <Ionicons
                        name="flag"
                        size={25}
                        color={"#ffffff"}
                        style={styles.cardIcon} />
                    <Text style={styles.cardText}>
                        Report Illegal Action
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Ionicons
                        name="search"
                        size={25}
                        color={"#ffffff"}
                        style={styles.cardIcon} />

                    <Text style={styles.cardText}>
                        Cheack Species DB
                    </Text>
                </TouchableOpacity>
            </View>
            <View >

                <ReportChart />
                <RecentData />
            </View>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F6F1F1",

    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
        padding: 10,
    },
    card: {
        flex: 1,
        backgroundColor: "#146C94",
        padding: 10,
        margin: 5,
        borderRadius: 10,
        alignItems: "center"
    },
    cardText: {
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center"
    },
    cardIcon: {
        alignItems: "center"
    }



});
