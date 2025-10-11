import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native';
import { ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function TabNavigation({ activeTab, onTabChange, tabs }) {

    const underlineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const index = tabs.indexOf(activeTab);
        Animated.spring(underlineAnim, {
            toValue: index * (screenWidth / tabs.length),
            useNativeDriver: false,
            friction: 8,
        }).start();
    }, [activeTab]);

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContent}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab == tab && styles.activeTab
                        ]}
                        onPress={() => onTabChange(tab)}>
                        <Text style={[
                            styles.tabText,
                            activeTab == tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Animated.View
                style={[
                    styles.underLine,
                    {
                        width: screenWidth / tabs.length,
                        transform: [{ translateX: underlineAnim }]
                    }
                ]} />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
    },

    tabContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    tab: {
        paddingVertical: 10,
        width: screenWidth / 4,
        alignItems: "center"
    },
    tabText: {
        color: "#146C94",
        fontSize: 14,
        fontWeight: "500"
    },
    activeTabText: {
        color: "#19A7CE",
        fontWeight: "700"
    },
    underLine: {
        height: 3,
        backgroundColor: "#19A7CE",
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: 2,
    }


})
export default TabNavigation;