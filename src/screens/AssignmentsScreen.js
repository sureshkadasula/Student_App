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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FF9800'; // Orange
      case 'Submitted':
        return '#4CAF50'; // Green
      case 'Late':
        return '#F44336'; // Red
      case 'Graded':
        return '#2196F3'; // Blue
      default:
        return '#757575'; // Gray
    }
  };

  // Get due date status
  const getDueDateStatus = dueDate => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: '#F44336', text: 'Overdue' };
    if (diffDays === 0) return { color: '#FF9800', text: 'Due Today' };
    if (diffDays <= 2)
      return { color: '#FF9800', text: `Due in ${diffDays} days` };
    return { color: '#4CAF50', text: `Due in ${diffDays} days` };
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

    return (
      <TouchableOpacity
        style={styles.assignmentCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.9} // Increased opacity to differentiate from inner buttons
      >
        <View style={styles.cardHeader}>
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="book" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.subject}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="user" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.teacher}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color="#666" style={styles.icon} />
            <Text style={[styles.infoText, { color: dueDateStatus.color }]}>
              Due: {item.dueDate} at {item.dueTime}
            </Text>
          </View>

          {item.marks !== null && (
            <View style={styles.infoRow}>
              <Icon name="star" size={14} color="#FFC107" style={styles.icon} />
              <Text style={styles.infoText}>Marks: {item.marks}/100</Text>
            </View>
          )}

          {item.attachment && (
            <View style={styles.infoRow}>
              <Icon
                name="paperclip"
                size={14}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.infoText}>{item.attachment}</Text>
            </View>
          )}

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="eye" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          {item.status === 'Pending' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={() => handleSubmitAssignment(item)}
            >
              <Icon
                name="upload"
                size={14}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}

          {/* {item.attachment && (
            <TouchableOpacity
              style={[styles.actionButton, styles.downloadButton]}
              onPress={() => handleDownloadAttachment(item)}
            >
              <Icon
                name="download"
                size={14}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          )} */}
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
              <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search assignments..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            {/* Filter Buttons */}
            <View style={{ marginBottom: 10 }}>
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
            <Icon name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No assignments found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' && !searchQuery
                ? 'Assignments will appear here'
                : 'Try adjusting your filters'}
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedAssignment && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedAssignment.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Icon name="times" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Details</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Subject:</Text>
                        <Text style={styles.detailValue}>
                          {selectedAssignment.subject}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Teacher:</Text>
                        <Text style={styles.detailValue}>
                          {selectedAssignment.teacher}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedAssignment.status,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {selectedAssignment.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Date:</Text>
                        <Text style={styles.detailValue}>
                          {selectedAssignment.dueDate} at{' '}
                          {selectedAssignment.dueTime}
                        </Text>
                      </View>
                      {selectedAssignment.marks !== null && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Marks:</Text>
                          <Text style={styles.detailValue}>
                            {selectedAssignment.marks}/100
                          </Text>
                        </View>
                      )}
                      {selectedAssignment.submissionDate && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Submitted:</Text>
                          <Text style={styles.detailValue}>
                            {selectedAssignment.submissionDate}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.modalDescription}>
                        {selectedAssignment.description}
                      </Text>
                    </View>

                    {selectedAssignment.attachment && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Attachment</Text>
                        <View style={styles.attachmentInfo}>
                          <Icon name="paperclip" size={16} color="#666" />
                          <Text style={styles.attachmentName}>
                            {selectedAssignment.attachment}
                          </Text>
                          <TouchableOpacity
                            style={styles.downloadAttachmentButton}
                            onPress={() =>
                              handleDownloadAttachment(selectedAssignment)
                            }
                          >
                            <Icon name="download" size={16} color="#2196F3" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {selectedAssignment.comments && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>
                          Teacher Comments
                        </Text>
                        <Text style={styles.modalDescription}>
                          {selectedAssignment.comments}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalActions}>
                    {selectedAssignment.status === 'Pending' && (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.submitButton]}
                        onPress={() => {
                          setModalVisible(false);
                          handleSubmitAssignment(selectedAssignment);
                        }}
                      >
                        <Icon
                          name="upload"
                          size={16}
                          color="#fff"
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>Submit Assignment</Text>
                      </TouchableOpacity>
                    )}
                    {/* {selectedAssignment.attachment && (
                      <TouchableOpacity
                        style={[
                          styles.modalActionButton,
                          styles.downloadButton,
                        ]}
                        onPress={() =>
                          handleDownloadAttachment(selectedAssignment)
                        }
                      >
                        <Icon
                          name="download"
                          size={16}
                          color="#fff"
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>
                          Download Attachment
                        </Text>
                      </TouchableOpacity>
                    )} */}
                  </View>
                </>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit Assignment</Text>
                <TouchableOpacity
                  onPress={() => setSubmissionModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Assignment Details</Text>
                  <Text style={styles.modalDescription}>
                    {selectedAssignment?.title}
                  </Text>
                  <Text style={styles.modalDescription}>
                    Subject: {selectedAssignment?.subject}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Submission Details</Text>
                  <Text style={styles.inputLabel}>
                    Enter submission details or upload files:
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={6}
                    placeholder="Describe your submission, attach files, or provide links..."
                    value={submissionText}
                    onChangeText={setSubmissionText}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.cancelButton]}
                  onPress={() => setSubmissionModalVisible(false)}
                >
                  <Icon
                    name="times"
                    size={16}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.submitButton]}
                  onPress={handleConfirmSubmit}
                  disabled={isSubmitting}
                >
                  <Icon
                    name="check"
                    size={16}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF751F',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filterContainer: {
    paddingLeft: 15,
    marginBottom: 10,
    maxHeight: 100, // Ensure it has height
  },
  filterContent: {
    paddingRight: 15,
    alignItems: 'center', // Center buttons vertically
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#FF751F',
    borderColor: '#FF751F',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#757575',
    marginTop: 8,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  downloadButton: {
    backgroundColor: '#FF9800',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  downloadAttachmentButton: {
    padding: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});

export default AssignmentsScreen;
