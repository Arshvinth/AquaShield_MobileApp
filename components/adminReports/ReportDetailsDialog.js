import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import { updateReportStatus } from '../../api/reportApi';

const COLORS = {
  background: '#F6F1F1',
  foreground: '#2C3E50',
  card: '#FFFFFF',
  cardForeground: '#2C3E50',
  primary: '#19A7CE',
  primaryForeground: '#FFFFFF',
  secondary: '#146C94',
  secondaryForeground: '#FFFFFF',
  muted: '#AFD3E2',
  mutedForeground: '#34495E',
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  border: '#D6DBDF',
  success: '#16A34A',
};

const ReportDetailsDialog = ({ report, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  if (!report) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return COLORS.success;
      case 'PENDING': return '#F59E0B';
      case 'REJECTED': return COLORS.destructive;
      default: return COLORS.mutedForeground;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await updateReportStatus(report._id, newStatus);

      Toast.show({
        type: 'success',
        text1: 'Report Updated',
        text2: `Report marked as ${getStatusText(newStatus)}`,
        position: 'top',
        visibilityTime: 2500,
      });

      // Convert to lowercase when passing to parent
      onStatusChange?.(report._id, newStatus.toLowerCase());

      setTimeout(onClose, 500); // close modal after toast
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update report status. Try again.',
        position: 'top',
      });
      console.error('Status update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!report}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody}>
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Report ID:</Text>
                <Text style={styles.detailValue}>{report._id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Species:</Text>
                <Text style={styles.detailValue}>{report.species}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{report.location}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Coordinates:</Text>
                <Text style={styles.detailValue}>
                  {report.coordinates?.[0]}°, {report.coordinates?.[1]}°
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Timeline</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{formatDate(report.date)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>{report.time}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {getStatusText(report.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{report.description}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Evidence</Text>
              <Text style={styles.evidenceText}>
                {report.evidencePhotos?.length || 0} photo(s) attached
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons - Only show for PENDING reports */}
          {report.status?.toLowerCase() === 'pending' && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: COLORS.destructive }]}
                disabled={loading}
                onPress={() => handleStatusUpdate('REJECTED')}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.actionButtonText}>Reject</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                disabled={loading}
                onPress={() => handleStatusUpdate('CONFIRMED')}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.actionButtonText}>Approve</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.closeModalButtonText}>
                {loading ? 'Processing...' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.cardForeground,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.mutedForeground,
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.cardForeground,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.cardForeground,
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.cardForeground,
    lineHeight: 20,
  },
  evidenceText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    fontStyle: 'italic',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ReportDetailsDialog;