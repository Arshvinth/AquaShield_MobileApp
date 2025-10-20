import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import faqData from '../data/faqData.json';

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

const Chatbot = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load FAQ data
  useEffect(() => {
    const loadFaqData = () => {
      try {
        // Using imported JSON data directly
        setFaqs(faqData.faqs || []);
      } catch (error) {
        console.error('Error loading FAQ data:', error);
        setFaqs([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    loadFaqData();
  }, []);

  const handleQuestionPress = (item) => {
    setSelectedQuestion(item);
  };

  const closeAnswer = () => {
    setSelectedQuestion(null);
  };

  const renderQuestion = ({ item }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => handleQuestionPress(item)}
    >
      <Text style={styles.questionText}>{item.question}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.mutedForeground} />
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="help-circle" size={24} color={COLORS.primaryForeground} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="help-circle" size={24} color={COLORS.primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* Chatbot Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Aqua Shield Help</Text>
              <Text style={styles.headerSubtitle}>Frequently Asked Questions</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.background} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {selectedQuestion ? (
            // Answer View
            <View style={styles.answerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={closeAnswer}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.backText}>Back to Questions</Text>
              </TouchableOpacity>

              <View style={styles.answerCard}>
                <Text style={styles.questionTitle}>{selectedQuestion.question}</Text>
                <Text style={styles.answerText}>{selectedQuestion.answer}</Text>
              </View>
            </View>
          ) : (
            // Questions List
            <View style={styles.questionsContainer}>
              <Text style={styles.sectionTitle}>Common Questions ({faqs.length})</Text>
              {faqs.length > 0 ? (
                <FlatList
                  data={faqs}
                  renderItem={renderQuestion}
                  keyExtractor={item => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No questions available</Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Need more help? Contact support@aquashield.com
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Fixed FAB Container - KEY FIX
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
    // These ensure it stays above everything
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Floating Action Button
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.secondaryForeground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
  },
  closeButton: {
    padding: 8,
  },

  // Questions List
  questionsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  questionItem: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionText: {
    fontSize: 15,
    color: COLORS.cardForeground,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },

  // Answer View
  answerContainer: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  answerCard: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.cardForeground,
    marginBottom: 16,
  },
  answerText: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    lineHeight: 24,
  },

  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    textAlign: 'center',
  },
});

export default Chatbot;