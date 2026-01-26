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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Sample homework data
const homeworkData = [
  {
    id: '1',
    title: 'Mathematics - Quadratic Equations',
    description:
      'Complete exercises 1-20 from Chapter 5. Show all work and provide detailed explanations.',
    subject: 'Mathematics',
    dueDate: '2024-01-26',
    dueTime: '11:59 PM',
    status: 'Pending',
    marks: null,
    teacher: 'Mr. Sharma',
    attachment: 'quadratic_worksheet.pdf',
    submissionDate: null,
    comments: null,
    submittedFiles: [],
  },
  {
    id: '2',
    title: 'Science - Plant Life Cycle',
    description:
      'Create a diagram showing the life cycle of a plant. Include all stages from seed to maturity.',
    subject: 'Science',
    dueDate: '2024-01-28',
    dueTime: '3:00 PM',
    status: 'Submitted',
    marks: null,
    teacher: 'Dr. Patel',
    attachment: 'plant_guide.pdf',
    submissionDate: '2024-01-27',
    comments: 'Great diagram! Very detailed.',
    submittedFiles: [{ uri: 'file://photo1.jpg', name: 'plant_diagram.jpg' }],
  },
  {
    id: '3',
    title: 'English - Creative Writing',
    description:
      'Write a short story (500 words) about a journey of discovery. Focus on character development.',
    subject: 'English',
    dueDate: '2024-01-24',
    dueTime: '11:59 PM',
    status: 'Graded',
    marks: 92,
    teacher: 'Ms. Johnson',
    attachment: null,
    submissionDate: '2024-01-23',
    comments: 'Excellent storytelling! Very creative.',
    submittedFiles: [{ uri: 'file://story.docx', name: 'creative_story.docx' }],
  },
  {
    id: '4',
    title: 'History - Ancient Egypt',
    description:
      'Research and present information about Ancient Egyptian civilization. Include pyramids and pharaohs.',
    subject: 'History',
    dueDate: '2024-01-22',
    dueTime: '2:00 PM',
    status: 'Late',
    marks: null,
    teacher: 'Mr. Williams',
    attachment: 'egypt_research.pdf',
    submissionDate: null,
    comments: null,
    submittedFiles: [],
  },
  {
    id: '5',
    title: 'Computer Science - HTML Project',
    description:
      'Create a simple webpage about your favorite hobby. Include images and proper HTML structure.',
    subject: 'Computer Science',
    dueDate: '2024-01-30',
    dueTime: '11:59 PM',
    status: 'Pending',
    marks: null,
    teacher: 'Ms. Davis',
    attachment: 'html_tutorial.pdf',
    submissionDate: null,
    comments: null,
    submittedFiles: [],
  },
  {
    id: '6',
    title: 'Art - Self Portrait',
    description:
      'Create a self-portrait using any medium. Include a brief description of your artistic choices.',
    subject: 'Art',
    dueDate: '2024-01-26',
    dueTime: '5:00 PM',
    status: 'Submitted',
    marks: 88,
    teacher: 'Mr. Anderson',
    attachment: null,
    submissionDate: '2024-01-25',
    comments: 'Beautiful portrait! Great use of colors.',
    submittedFiles: [{ uri: 'file://portrait.jpg', name: 'self_portrait.jpg' }],
  },
];

const HomeWorkScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get unique subjects for filter options
  const subjects = useMemo(() => {
    const uniqueSubjects = [
      'All',
      ...new Set(homeworkData.map(h => h.subject)),
    ];
    return uniqueSubjects;
  }, []);

  // Filter and search homework
  const filteredHomework = useMemo(() => {
    let filtered = homeworkData;

    // Apply status filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(
        homework => homework.status === selectedFilter,
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        homework =>
          homework.title.toLowerCase().includes(query) ||
          homework.subject.toLowerCase().includes(query) ||
          homework.description.toLowerCase().includes(query),
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

  // Handle view homework details
  const handleViewDetails = homework => {
    setSelectedHomework(homework);
    setModalVisible(true);
  };

  // Handle submit homework
  const handleSubmitHomework = homework => {
    setSelectedHomework(homework);
    setSubmissionModalVisible(true);
    setSelectedImage(null);
    setSubmissionText('');
  };

  // Handle download attachment
  const handleDownloadAttachment = homework => {
    if (homework.attachment) {
      Alert.alert('Download', `Downloading ${homework.attachment}...`, [
        { text: 'OK', style: 'default' },
      ]);
    } else {
      Alert.alert('No Attachment', 'This homework has no attached files.');
    }
  };

  // Handle take photo
  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to take photo');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera');
    }
  };

  // Handle select from gallery
  const handleSelectFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to select image');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access gallery');
    }
  };

  // Handle remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  // Handle submit confirmation
  const handleConfirmSubmit = () => {
    if (!submissionText.trim() && !selectedImage) {
      Alert.alert(
        'Error',
        'Please enter submission details or attach a photo.',
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionModalVisible(false);
      setSubmissionText('');
      setSelectedImage(null);
      Alert.alert('Success', 'Homework submitted successfully!', [
        { text: 'OK', style: 'default' },
      ]);
    }, 1500);
  };

  // Render homework card
  const renderHomeworkCard = ({ item }) => {
    const dueDateStatus = getDueDateStatus(item.dueDate);

    return (
      <TouchableOpacity
        style={styles.homeworkCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.homeworkTitle}>{item.title}</Text>
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
              onPress={() => handleSubmitHomework(item)}
            >
              <Icon
                name="camera"
                size={14}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}

          {item.attachment && (
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Homework</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search homework..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {subjects.map(renderFilterButton)}
      </ScrollView>

      {/* Homework List */}
      <FlatList
        data={filteredHomework}
        renderItem={renderHomeworkCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No homework found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' && !searchQuery
                ? 'Homework will appear here'
                : 'Try adjusting your filters'}
            </Text>
          </View>
        }
      />

      {/* Homework Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedHomework && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedHomework.title}
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
                          {selectedHomework.subject}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Teacher:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHomework.teacher}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedHomework.status,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {selectedHomework.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Date:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHomework.dueDate} at{' '}
                          {selectedHomework.dueTime}
                        </Text>
                      </View>
                      {selectedHomework.marks !== null && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Marks:</Text>
                          <Text style={styles.detailValue}>
                            {selectedHomework.marks}/100
                          </Text>
                        </View>
                      )}
                      {selectedHomework.submissionDate && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Submitted:</Text>
                          <Text style={styles.detailValue}>
                            {selectedHomework.submissionDate}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.modalDescription}>
                        {selectedHomework.description}
                      </Text>
                    </View>

                    {selectedHomework.attachment && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Attachment</Text>
                        <View style={styles.attachmentInfo}>
                          <Icon name="paperclip" size={16} color="#666" />
                          <Text style={styles.attachmentName}>
                            {selectedHomework.attachment}
                          </Text>
                          <TouchableOpacity
                            style={styles.downloadAttachmentButton}
                            onPress={() =>
                              handleDownloadAttachment(selectedHomework)
                            }
                          >
                            <Icon name="download" size={16} color="#2196F3" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {selectedHomework.comments && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>
                          Teacher Comments
                        </Text>
                        <Text style={styles.modalDescription}>
                          {selectedHomework.comments}
                        </Text>
                      </View>
                    )}

                    {selectedHomework.submittedFiles &&
                      selectedHomework.submittedFiles.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>
                            Submitted Files
                          </Text>
                          {selectedHomework.submittedFiles.map(
                            (file, index) => (
                              <View key={index} style={styles.fileInfo}>
                                <Icon name="file" size={14} color="#666" />
                                <Text style={styles.fileName}>{file.name}</Text>
                              </View>
                            ),
                          )}
                        </View>
                      )}
                  </View>

                  <View style={styles.modalActions}>
                    {selectedHomework.status === 'Pending' && (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.submitButton]}
                        onPress={() => {
                          setModalVisible(false);
                          handleSubmitHomework(selectedHomework);
                        }}
                      >
                        <Icon
                          name="camera"
                          size={16}
                          color="#fff"
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.buttonText}>Submit Homework</Text>
                      </TouchableOpacity>
                    )}
                    {selectedHomework.attachment && (
                      <TouchableOpacity
                        style={[
                          styles.modalActionButton,
                          styles.downloadButton,
                        ]}
                        onPress={() =>
                          handleDownloadAttachment(selectedHomework)
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
                    )}
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
                <Text style={styles.modalTitle}>Submit Homework</Text>
                <TouchableOpacity
                  onPress={() => setSubmissionModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Homework Details</Text>
                  <Text style={styles.modalDescription}>
                    {selectedHomework?.title}
                  </Text>
                  <Text style={styles.modalDescription}>
                    Subject: {selectedHomework?.subject}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Upload Photo</Text>
                  <Text style={styles.inputLabel}>
                    Take a photo or select from gallery:
                  </Text>
                  <View style={styles.uploadButtons}>
                    <TouchableOpacity
                      style={[styles.uploadButton, styles.cameraButton]}
                      onPress={handleTakePhoto}
                    >
                      <Icon name="camera" size={20} color="#fff" />
                      <Text style={styles.uploadButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.uploadButton, styles.galleryButton]}
                      onPress={handleSelectFromGallery}
                    >
                      <Icon name="image" size={20} color="#fff" />
                      <Text style={styles.uploadButtonText}>Select Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedImage && (
                    <View style={styles.imagePreview}>
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={handleRemoveImage}
                      >
                        <Icon name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Submission Details</Text>
                  <Text style={styles.inputLabel}>
                    Enter submission details (optional):
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={6}
                    placeholder="Describe your submission, add notes, or provide additional information..."
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
                    {isSubmitting ? 'Submitting...' : 'Submit Homework'}
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
    backgroundColor: '#7B1FA2',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  },
  filterContent: {
    paddingRight: 15,
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
    backgroundColor: '#7B1FA2',
    borderColor: '#7B1FA2',
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
  homeworkCard: {
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
  homeworkTitle: {
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
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  fileName: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
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
  uploadButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#7B1FA2',
  },
  galleryButton: {
    backgroundColor: '#FF9800',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  imagePreview: {
    position: 'relative',
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeWorkScreen;
