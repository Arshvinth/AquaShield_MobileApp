import React, { useState, useEffect } from 'react'
import { ViewPagerAndroidBase } from 'react-native';
import { Dimensions, View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { getAllSubmittedReports } from '../../src/services/reportService';


export default function FeoChart() {

    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const processReportData = (reports) => {

        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthlyCount = new Array(12).fill(0);

        reports.forEach(report => {
            if (report.date) {
                const reportDate = new Date(report.date);
                const monthIndex = reportDate.getMonth();
                monthlyCount[monthIndex]++
            }
        });

        const currentMonth = new Date().getMonth();
        const last6Month = [];
        const last6MonthData = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12

            last6Month.push(month[monthIndex])
            last6MonthData.push(monthlyCount[monthIndex])
        }
        return {
            labels: last6Month,
            datasets: [{ data: last6MonthData }]
        }
    }

    const fetchMyReport = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching all reports...');
            const types = await getAllSubmittedReports();
            const processData = processReportData(types);
            setChartData(processData);
        } catch (err) {
            console.log('Failed to fetch reports', err);
            setError('Failed to Load incident types');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyReport()
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>
                    Report By Month
                </Text>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#146C94" />
                    <Text style={styles.loadingText}>Loading chart data...</Text>
                </View>
            </View>
        )
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Report By Month</Text>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Report By Month
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.chartContainer}
            >
                <BarChart
                    data={chartData}
                    width={Math.max(Dimensions.get("screen").width - 30)}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#FFFFFF",
                        backgroundGradientFrom: "#FFFFFF",
                        backgroundGradientTo: "#FFFFFF",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(25, 167, 206,${opacity})`,
                    }}
                    style={styles.chart}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderColor: "#19A7CE",
        borderWidth: 1,
        borderRadius: 15,
        paddingRight: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
        color: "#146C94",
        margin: 2,
        marginLeft: 10,
        marginTop: 20
    },
    chartContainer: {
        paddingVertical: 2,
    },
    chart: {
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
        marginRight: 5,
    },
});