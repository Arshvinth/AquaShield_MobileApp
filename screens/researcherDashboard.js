
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Layout from "../components/layout/layout";
import Footer from "../components/layout/footer";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const stats = [
    {
      title: "Total Illegal reports submitted",
      value: 156,
      color: "#19A7CE",
      icon: <MaterialCommunityIcons name="clipboard-check" size={24} color="#146C94" />,
    },
    {
      title: "Actions Taken for submitted illegal reports",
      value: 54,
      color: "#4CAF50",
      icon: <Ionicons name="checkmark-circle" size={24} color="#146C94" />,
    },
    {
      title: "Total Endangered species",
      value: 50,
      color: "#146C94",
      icon: <MaterialCommunityIcons name="alert-circle" size={24} color="#FFFFFF" />,
    },
    {
      title: "Pending species request",
      value: 2,
      color: "#FFD54F",
      icon: <Ionicons name="time-outline" size={24} color="#146C94" />,
    },
  ];

  const mostReportedSpecies = {
    labels: ["Tuna", "Salmon", "Cod", "Shark", "Mackerel"],
    datasets: [{ data: [22, 18, 15, 12, 8] }],
  };

  const incidentTrends = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [50, 55, 53, 57, 60, 70] }],
  };

  const speciesOverview = [
    { name: "Endangered", population: 20, color: "#FF7043", legendFontColor: "#333", legendFontSize: 14 },
    { name: "Vulnerable", population: 60, color: "#2196F3", legendFontColor: "#333", legendFontSize: 14 },
    { name: "Extinct", population: 20, color: "#4CAF50", legendFontColor: "#333", legendFontSize: 14 },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(20, 108, 148, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(20, 108, 148, ${opacity})`,
    propsForBackgroundLines: {
      strokeDasharray: "",
      strokeWidth: 0.4,
      stroke: "#AFD3E2",
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        {/* --- Top Stats Section --- */}
        <View style={styles.statsContainer}>
          {stats.map((item, idx) => (
            <View key={idx} style={[styles.card, { borderColor: item.color }]}>
              <View style={[styles.iconContainer, { backgroundColor: "#AFD3E2" }]}>{item.icon}</View>
              <Text style={[styles.cardValue, { color: item.color }]}>
                {item.value.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* --- Bar Chart --- */}
        <Text style={styles.sectionTitle}>Most Reported Species</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <BarChart
            data={mostReportedSpecies}
            width={mostReportedSpecies.labels.length * 80} // dynamic width
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={false}
            flatColor={true}
            showBarTops={true}
          />
        </ScrollView>

        {/* --- Line Chart --- */}
        <Text style={styles.sectionTitle}>Incident Trends</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <LineChart
            data={incidentTrends}
            width={incidentTrends.labels.length * 70} // dynamic width
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            bezier
            withDots={true}
            withShadow={true}
          />
        </ScrollView>

        {/* --- Pie Chart --- */}
        <Text style={styles.sectionTitle}>Species Overview</Text>
        <View style={styles.pieContainer}>
          <PieChart
            data={speciesOverview}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </ScrollView>

      <Footer />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F1F1",
    paddingVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  card: {
    width: "48%",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 12,
    color: "#146C94",
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#146C94",
    marginVertical: 12,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginBottom: 20,
  },
  pieContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderRadius: 16, alignSelf: "center", marginBottom: 20,
  },
});

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
// import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from "axios";
// import Layout from "../components/layout/layout";
// import Footer from "../components/layout/footer";
// import { API_BASE_URL } from "../config";

// const screenWidth = Dimensions.get("window").width;

// const Dashboard = () => {
//   const [speciesData, setSpeciesData] = useState([]);
//   const [speciesRequests, setSpeciesRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [reportsData, setReportsData] = useState([]);



//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const [speciesRes, requestsRes] = await Promise.all([
//   //         axios.get(`${API_BASE_URL}/species/getAllSpecies`),
//   //         axios.get(`${API_BASE_URL}/speciesRequest/getAllSpeciesRequests`),
//   //       ]);
//   //       setSpeciesData(speciesRes.data);
//   //       setSpeciesRequests(requestsRes.data);  
//   //     } catch (err) {
//   //       console.error("Error fetching dashboard data:", err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchData();
//   // }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [speciesRes, requestsRes, reportsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/species/getAllSpecies`),
//           axios.get(`${API_BASE_URL}/speciesRequest/getAllSpeciesRequests`),
//           axios.get(`${API_BASE_URL}/api/report/getAllReportsDashboard`), // fetch all reports
//         ]);
//         setSpeciesData(speciesRes.data);
//         setSpeciesRequests(requestsRes.data);
//         setReportsData(reportsRes.data); // save reports
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <Layout>
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <ActivityIndicator size="large" color="#146C94" />
//         </View>
//       </Layout>
//     );
//   }

//   // --- Compute Stats ---
//   const totalEndangered = speciesData.filter(s => s.ProtectionLevel?.toLowerCase() === "endangered").length;
//   const pendingRequests = speciesRequests.filter(r => r.RequestStatus === "Pending").length;

//   const speciesOverview = [
//     {
//       name: "Endangered",
//       population: speciesData.filter(s => s.ProtectionLevel?.toLowerCase() === "endangered").length,
//       color: "#FF7043",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//     {
//       name: "Protected",
//       population: speciesData.filter(s => s.ProtectionStatus === true).length,
//       color: "#2196F3",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//     {
//       name: "Common",
//       population: speciesData.filter(
//         s => s.ProtectionStatus !== true && s.ProtectionLevel?.toLowerCase() !== "endangered"
//       ).length,
//       color: "#4CAF50",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//   ];

//   // --- Other Stats (hardcoded as before) ---
//   // const stats = [
//   //   {
//   //     title: "Total Illegal reports submitted",
//   //     value: 156,
//   //     color: "#19A7CE",
//   //     icon: <MaterialCommunityIcons name="clipboard-check" size={24} color="#146C94" />,
//   //   },
//   //   {
//   //     title: "Actions Taken for submitted illegal reports",
//   //     value: 54,
//   //     color: "#4CAF50",
//   //     icon: <Ionicons name="checkmark-circle" size={24} color="#146C94" />,
//   //   },
//   //   {
//   //     title: "Total Endangered species",
//   //     value: totalEndangered,
//   //     color: "#146C94",
//   //     icon: <MaterialCommunityIcons name="alert-circle" size={24} color="#FFFFFF" />,
//   //   },
//   //   {
//   //     title: "Pending species request",
//   //     value: pendingRequests,
//   //     color: "#FFD54F",
//   //     icon: <Ionicons name="time-outline" size={24} color="#146C94" />,
//   //   },
//   // ];

//   const totalReports = reportsData?.length || 0; // all reports
//   const actionsTaken = reportsData?.filter(r => r.status === "CONFIRMED")?.length || 0;

//   const stats = [
//     {
//       title: "Total Illegal reports submitted",
//       value: totalReports,
//       color: "#19A7CE",
//       icon: <MaterialCommunityIcons name="clipboard-check" size={24} color="#146C94" />,
//     },
//     {
//       title: "Actions Taken for submitted illegal reports",
//       value: actionsTaken,
//       color: "#4CAF50",
//       icon: <Ionicons name="checkmark-circle" size={24} color="#146C94" />,
//     },
//     {
//       title: "Total Endangered species",
//       value: totalEndangered,
//       color: "#146C94",
//       icon: <MaterialCommunityIcons name="alert-circle" size={24} color="#FFFFFF" />,
//     },
//     {
//       title: "Pending species request",
//       value: pendingRequests,
//       color: "#FFD54F",
//       icon: <Ionicons name="time-outline" size={24} color="#146C94" />,
//     },
//   ];
//   const mostReportedSpecies = {
//     labels: ["Tuna", "Salmon", "Cod", "Shark", "Mackerel"],
//     datasets: [{ data: [22, 18, 15, 12, 8] }],
//   };

//   const incidentTrends = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [{ data: [50, 55, 53, 57, 60, 70] }],
//   };

//   const chartConfig = {
//     backgroundGradientFrom: "#FFFFFF",
//     backgroundGradientTo: "#FFFFFF",
//     decimalPlaces: 0,
//     color: (opacity = 1) => `rgba(20, 108, 148, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(20, 108, 148, ${opacity})`,
//     propsForBackgroundLines: {
//       strokeDasharray: "",
//       strokeWidth: 0.4,
//       stroke: "#AFD3E2",
//     },
//     propsForLabels: {
//       fontSize: 12,
//     },
//   };

//   return (
//     <Layout>
//       <ScrollView style={styles.container}>
//         {/* --- Top Stats Section --- */}
//         <View style={styles.statsContainer}>
//           {stats.map((item, idx) => (
//             <View key={idx} style={[styles.card, { borderColor: item.color }]}>
//               <View style={[styles.iconContainer, { backgroundColor: "#AFD3E2" }]}>{item.icon}</View>
//               <Text style={[styles.cardValue, { color: item.color }]}>
//                 {item.value.toString().padStart(2, "0")}
//               </Text>
//               <Text style={styles.cardTitle}>{item.title}</Text>
//             </View>
//           ))}
//         </View>

//         {/* --- Bar Chart --- */}
//         <Text style={styles.sectionTitle}>Most Reported Species</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
//           <BarChart
//             data={mostReportedSpecies}
//             width={mostReportedSpecies.labels.length * 80}
//             height={220}
//             chartConfig={chartConfig}
//             style={styles.chart}
//             fromZero
//             showValuesOnTopOfBars
//             withInnerLines={false}
//             flatColor={true}
//             showBarTops={true}
//           />
//         </ScrollView>

//         {/* --- Line Chart --- */}
//         <Text style={styles.sectionTitle}>Incident Trends</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
//           <LineChart
//             data={incidentTrends}
//             width={incidentTrends.labels.length * 70}
//             height={220}
//             chartConfig={chartConfig}
//             style={styles.chart}
//             fromZero
//             bezier
//             withDots={true}
//             withShadow={true}
//           />
//         </ScrollView>

//         {/* --- Pie Chart --- */}
//         <Text style={styles.sectionTitle}>Species Overview</Text>
//         <View style={styles.pieContainer}>
//           <PieChart
//             data={speciesOverview}
//             width={screenWidth - 40}
//             height={200}
//             chartConfig={chartConfig}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="15"
//             absolute
//           />
//         </View>
//       </ScrollView>

//       <Footer />
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#F6F1F1",
//     paddingVertical: 10,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 10,
//     paddingHorizontal: 5,
//   },
//   card: {
//     width: "48%",
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 2,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//     marginBottom: 10,
//   },
//   iconContainer: {
//     padding: 10,
//     borderRadius: 50,
//     marginBottom: 8,
//   },
//   cardValue: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   cardTitle: {
//     fontSize: 12,
//     color: "#146C94",
//     textAlign: "center",
//     marginTop: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#146C94",
//     marginVertical: 12,
//     textAlign: "center",
//   },
//   chart: {
//     borderRadius: 16,
//     marginBottom: 20,
//   },
//   pieContainer: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     alignSelf: "center",
//     marginBottom: 20,
//   },
// });

// export default Dashboard;
