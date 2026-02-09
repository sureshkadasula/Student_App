import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample assignments data
const assignmentsData = [
  {
    id: '1',
    title: 'Mathematics Assignment - Algebra',
    description:
      'Complete exercises 1-20 from Chapter 5 on quadratic equations. Show all work and provide detailed explanations for each solution.',
    subject: 'Mathematics',
    dueDate: '2024-01-25',
    dueTime: '11:59 PM',
    status: 'Pending',
    marks: null,
    teacher: 'Mr. Sharma',
    attachment: 'algebra_worksheet.pdf',
    submissionDate: null,
    comments: null,
  },
  {
    id: '2',
    title: 'Science Project - Solar System Model',
    description:
      'Create a 3D model of the solar system with accurate planetary distances and sizes. Include a brief presentation about each planet.',
    subject: 'Science',
    dueDate: '2024-01-28',
    dueTime: '3:00 PM',
    status: 'Submitted',
    marks: null,
    teacher: 'Dr. Patel',
    attachment: 'solar_system_guide.pdf',
    submissionDate: '2024-01-27',
    comments: 'Good effort! Please add more details about Jupiter.',
  },
  {
    id: '3',
    title: 'English Essay - Climate Change',
    description:
      'Write a 500-word essay on the causes and effects of climate change. Include solutions and personal recommendations.',
    subject: 'English',
    dueDate: '2024-01-20',
    dueTime: '11:59 PM',
    status: 'Graded',
    marks: 85,
    teacher: 'Ms. Johnson',
    attachment: null,
    submissionDate: '2024-01-19',
    comments:
      'Well-researched essay with strong arguments. Minor grammar improvements needed.',
  },
  {
    id: '4',
    title: 'History Project - Ancient Civilizations',
    description:
      'Research and present on one ancient civilization. Include timeline, major achievements, and cultural impact.',
    subject: 'History',
    dueDate: '2024-01-22',
    dueTime: '2:00 PM',
    status: 'Late',
    marks: null,
    teacher: 'Mr. Williams',
    attachment: 'ancient_civilizations.pdf',
    submissionDate: null,
    comments: null,
  },
  {
    id: '5',
    title: 'Computer Science - Python Program',
    description:
      'Create a Python program that calculates student grades based on input scores. Include error handling and user-friendly interface.',
    subject: 'Computer Science',
    dueDate: '2024-01-30',
    dueTime: '11:59 PM',
    status: 'Pending',
    marks: null,
    teacher: 'Ms. Davis',
    attachment: 'python_tutorial.pdf',
    submissionDate: null,
    comments: null,
  },
  {
    id: '6',
    title: 'Physical Education - Fitness Plan',
    description:
      'Design a 4-week fitness plan including cardio, strength training, and flexibility exercises. Track your progress weekly.',
    subject: 'Physical Education',
    dueDate: '2024-01-26',
    dueTime: '5:00 PM',
    status: 'Submitted',
    marks: 92,
    teacher: 'Coach Martinez',
    attachment: null,
    submissionDate: '2024-01-25',
    comments: 'Excellent comprehensive fitness plan!',
  },
];

const AssignmentsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unique subjects for filter options
  const subjects = useMemo(() => {
    const uniqueSubjects = [
      'All',
      ...new Set(assignmentsData.map(a => a.subject)),
    ];
    return uniqueSubjects;
  }, []);

  // Filter and search assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignmentsData;

    // Apply status filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(
        assignment => assignment.status === selectedFilter,
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        assignment =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.subject.toLowerCase().includes(query) ||
          assignment.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery]);

  // Get status details
  const getStatusDetails = status => {
    switch (status) {
      case 'Pending':
        return { color: '#f59e0b', icon: 'clock-outline', bg: '#fef3c7' };
      case 'Submitted':
        return { color: '#10b981', icon: 'check-circle-outline', bg: '#d1fae5' };
      case 'Late':
        return { color: '#ef4444', icon: 'alert-circle-outline', bg: '#fee2e2' };
      case 'Graded':
        return { color: '#3b82f6', icon: 'star-outline', bg: '#dbeafe' };
      default:
        return { color: '#6b7280', icon: 'help-circle-outline', bg: '#f3f4f6' };
    }
  };

  // Get due date status
  const getDueDateStatus = dueDate => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: '#ef4444', text: 'Overdue' };
    if (diffDays === 0) return { color: '#f59e0b', text: 'Due Today' };
    if (diffDays <= 2)
      return { color: '#f59e0b', text: `Due in ${diffDays} days` };
    return { color: '#10b981', text: `Due in ${diffDays} days` };
  };

  // Handle view assignment details
  const handleViewDetails = assignment => {
    setSelectedAssignment(assignment);
    setModalVisible(true);
  };

  // Handle submit assignment
  const handleSubmitAssignment = assignment => {
    setSelectedAssignment(assignment);
    setSubmissionModalVisible(true);
  };

  // Handle download attachment
  const handleDownloadAttachment = assignment => {
    console.log('Download pressed for:', assignment.title);
    if (assignment.attachment) {
      Alert.alert('Download', `Downloading ${assignment.attachment}...`, [
        { text: 'OK', style: 'default' },
      ]);
    } else {
      Alert.alert('No Attachment', 'This assignment has no attached files.');
    }
  };

  // Handle submit confirmation
  const handleConfirmSubmit = () => {
    if (!submissionText.trim()) {
      Alert.alert('Error', 'Please enter submission details.');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionModalVisible(false);
      setSubmissionText('');
      Alert.alert('Success', 'Assignment submitted successfully!', [
        { text: 'OK', style: 'default' },
      ]);
    }, 1500);
  };

  // Render assignment card
  const renderAssignmentCard = ({ item }) => {
    const dueDateStatus = getDueDateStatus(item.dueDate);
    const statusDetails = getStatusDetails(item.status);

    return (
      <TouchableOpacity
        style={styles.assignmentCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.assignmentTitle} numberOfLines={2}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
            <Icon name={statusDetails.icon} size={14} color={statusDetails.color} style={{ marginRight: 4 }} />
            <Text style={[styles.statusText, { color: statusDetails.color }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="book-open-page-variant" size={16} color="#64748b" style={styles.icon} />
            <Text style={styles.infoText}>{item.subject}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="account" size={16} color="#64748b" style={styles.icon} />
            <Text style={styles.infoText}>{item.teacher}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-clock" size={16} color="#64748b" style={styles.icon} />
            <Text style={[styles.infoText, { color: dueDateStatus.color, fontWeight: '500' }]}>
              {dueDateStatus.text} - {item.dueDate}
            </Text>
          </View>

          {item.marks !== null && (
            <View style={styles.infoRow}>
              <Icon name="star" size={16} color="#f59e0b" style={styles.icon} />
              <Text style={[styles.infoText, { color: '#f59e0b', fontWeight: '600' }]}>Marks: {item.marks}/100</Text>
            </View>
          )}

          {item.attachment && (
            <View style={styles.attachmentChip}>
              <Icon name="paperclip" size={14} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.attachmentText} numberOfLines={1}>{item.attachment}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>

          {item.status === 'Pending' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={() => handleSubmitAssignment(item)}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
              <Icon name="arrow-right" size={16} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter button
  const renderFilterButton = filter => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

      <FlatList
        data={filteredAssignments}
        renderItem={renderAssignmentCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Assignments</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search assignments..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Filter Buttons */}
            <View style={{ marginBottom: 16 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
              >
                {subjects.map(renderFilterButton)}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notebook-outline" size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>No assignments found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' && !searchQuery
                ? 'Check back later for new tasks.'
                : 'Try adjusting your filters.'}
            </Text>
          </View>
        }
      />

      {/* Assignment Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assignment Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedAssignment && (
                <View style={styles.modalBody}>
                  <Text style={styles.modalAssignmentTitle}>{selectedAssignment.title}</Text>

                  <View style={styles.modalMetaContainer}>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Subject</Text>
                      <Text style={styles.modalMetaValue}>{selectedAssignment.subject}</Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Teacher</Text>
                      <Text style={styles.modalMetaValue}>{selectedAssignment.teacher}</Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Due Date</Text>
                      <Text style={styles.modalMetaValue}>{selectedAssignment.dueDate}</Text>
                    </View>
                  </View>

                  <View style={styles.statusSection}>
                    <Text style={styles.sectionTitle}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusDetails(selectedAssignment.status).bg, alignSelf: 'flex-start' }]}>
                      <Icon name={getStatusDetails(selectedAssignment.status).icon} size={16} color={getStatusDetails(selectedAssignment.status).color} style={{ marginRight: 6 }} />
                      <Text style={[styles.statusText, { color: getStatusDetails(selectedAssignment.status).color, fontSize: 13 }]}>{selectedAssignment.status}</Text>
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {selectedAssignment.description}
                    </Text>
                  </View>

                  {selectedAssignment.attachment && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Attachment</Text>
                      <TouchableOpacity style={styles.attachmentButton} onPress={() => handleDownloadAttachment(selectedAssignment)}>
                        <Icon name="file-document-outline" size={20} color="#3b82f6" />
                        <Text style={styles.attachmentButtonText}>{selectedAssignment.attachment}</Text>
                        <Icon name="download" size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {selectedAssignment.comments && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Teacher Feedback</Text>
                      <View style={styles.feedbackContainer}>
                        <Icon name="comment-quote-outline" size={20} color="#64748b" style={{ marginBottom: 8 }} />
                        <Text style={styles.feedbackText}>{selectedAssignment.comments}</Text>
                      </View>
                    </View>
                  )}

                  {selectedAssignment.status === 'Pending' && (
                    <TouchableOpacity
                      style={styles.modalSubmitButton}
                      onPress={() => {
                        setModalVisible(false);
                        handleSubmitAssignment(selectedAssignment);
                      }}
                    >
                      <Text style={styles.modalSubmitButtonText}>Submit Assignment</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Submission Modal */}
      <Modal
        visible={submissionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSubmissionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Keyboard avoiding logic normally needed here but simplified for now */}
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Assignment</Text>
              <TouchableOpacity
                onPress={() => setSubmissionModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={styles.submissionInfo}>
                  <Text style={styles.submissionInfoLabel}>Submitting for:</Text>
                  <Text style={styles.submissionInfoText}>{selectedAssignment?.title}</Text>
                </View>

                <Text style={styles.inputLabel}>
                  Your Work
                </Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={8}
                  placeholder="Type your answer here or paste a link to your work..."
                  value={submissionText}
                  onChangeText={setSubmissionText}
                  placeholderTextColor="#94a3b8"
                  textAlignVertical="top"
                />

                <TouchableOpacity style={styles.uploadButton}>
                  <Icon name="cloud-upload-outline" size={24} color="#64748b" />
                  <Text style={styles.uploadButtonText}>Attach File</Text>
                </TouchableOpacity>

              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setSubmissionModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmSubmitButton}
                  onPress={handleConfirmSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.confirmSubmitButtonText}>
                    {isSubmitting ? 'Sending...' : 'Turn In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterContainer: {
    paddingLeft: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#FF751F',
    borderColor: '#FF751F',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 30,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: '#475569',
    maxWidth: 200,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#FF751F',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
    paddingBottom: 40,
  },
  modalAssignmentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  modalMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalMetaItem: {
    width: '50%',
    marginBottom: 12,
  },
  modalMetaLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  modalMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  section: {
    marginBottom: 24,
  },
  statusSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    padding: 12,
  },
  attachmentButtonText: {
    fontSize: 15,
    color: '#0369a1',
    fontWeight: '500',
    marginLeft: 12,
  },
  feedbackContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#64748b',
  },
  feedbackText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#334155',
  },
  modalSubmitButton: {
    backgroundColor: '#FF751F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Submission Modal Specifics
  submissionInfo: {
    marginBottom: 20,
  },
  submissionInfoLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  submissionInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#334155',
    marginBottom: 20,
    minHeight: 120,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 'auto',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmSubmitButton: {
    flex: 2,
    backgroundColor: '#FF751F',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  confirmSubmitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AssignmentsScreen;
