import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native'


export default function ReportOptions({ visible, onClose, position, selectedReport, onUpdate, onDelete }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}>

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View
                        style={[styles.optionContainer,
                        {
                            top: position.y - 100,
                            left: position.x - 120,
                        }
                        ]}>
                        {selectedReport?.status === 'PENDING' && (
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={onUpdate}>
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="#146C94" />
                                <Text style={styles.optionText}>Update</Text>

                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={onDelete}
                        >
                            <Ionicons name="trash-outline"
                                size={20}
                                color="#F44336" />
                            <Text style={[styles.optionText, { color: '#F44336' }]}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close-outline"
                                size={20}
                                color="#666" />

                            <Text style={[styles.optionText, { color: "#666" }]}>Cancel</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

    )
}
const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rbga(0,0,0,0.1)',
    },
    optionContainer: {
        position: 'absolute',
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 8,
        shadowColor: "#146C94",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        minWidth: 140,
        marginLeft: 100

    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    optionText: {
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 12,
        color: "#146C94"
    }


})
