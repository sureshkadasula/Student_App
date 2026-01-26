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
  Picker,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample request types
const requestTypes = [
  {
    id: '1',
    name: 'Transfer Certificate',
    icon: 'file-text',
    description: 'Request for transfer certificate',
  },
  {
    id: '2',
    name: 'Bonafide Certificate',
    icon: 'certificate',
    description: 'Request for bonafide certificate',
  },
  {
    id: '3',
    name: 'ID Card',
    icon: 'id-card',
    description: 'Request for student ID card',
  },
  {
    id: '4',
    name: 'Character Certificate',
    icon: 'star',
    description: 'Request for character certificate',
  },
  {
    id: '5',
    name: 'Course Completion',
    icon: 'check-circle',
    description: 'Request for course completion certificate',
  },
  {
    id: '6',
    name: 'Migration Certificate',
    icon: 'plane',
    description: 'Request for migration certificate',
  },
  {
    id: '7',
    name: 'Conduct Certificate',
    icon: 'thumbs-up',
    description: 'Request for conduct certificate',
  },
  {
    id: '8',
    name: 'Other Document',
    icon: 'file',
    description: 'Request for other documents',
  },
];

// Sample requests data
const requestsData = [
  {
    id: '1',
    documentType: 'Transfer Certificate',
    reason: 'Transferring to another city',
    details: 'Need transfer certificate for admission in new school',
    urgency: 'High',
    status: 'Approved',
    submittedDate: '2024-01-20',
    processedDate: '2024-01-22',
    comments: 'Approved by principal. Will be ready in 2 days.',
  },
  {
    id: '2',
    documentType: 'ID Card',
    reason: 'Lost my ID card',
    details: 'Need replacement ID card for library access',
    urgency: 'Medium',
    status: 'Processing',
    submittedDate: '2024-01-23',
    processedDate: null,
    comments: 'Under verification process',
  },
  {
    id: '3',
    documentType: 'Bonafide Certificate',
    reason: 'Bank loan application',
    details: 'Need bonafide certificate for education loan',
    urgency: 'High',
    status: 'Pending',
    submittedDate: '2024-01-24',
    processedDate: null,
    comments: null,
  },
  {
    id: '4',
    documentType: 'Character Certificate',
    reason: 'Job application',
    details: 'Required for job application process',
    urgency: 'Medium',
    status: 'Completed',
    submittedDate: '2024-01-15',
    processedDate: '2024-01-18',
    comments: 'Document ready for collection',
  },
  {
    id: '5',
    documentType: 'Course Completion',
    reason: 'Higher studies',
    details: 'Need course completion certificate for university admission',
    urgency: 'High',
    status: 'Rejected',
    submittedDate: '2024-01-10',
    processedDate: '2024-01-12',
    comments: 'Please submit complete course records',
  },
];

const AdminRequestScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [urgency, setUrgency] = useState('Medium');

  // Get unique document types for filter options
  const documentTypes = useMemo(() => {
    const uniqueTypes = [
      'All',
      ...new Set(requestsData.map(r => r.documentType)),
    ];
    return uniqueTypes;
  }, []);

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    let filtered = requestsData;

    // Apply status filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(request => request.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        request =>
          request.documentType.toLowerCase().includes(query) ||
          request.reason.toLowerCase().includes(query) ||
          request.status.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedFilter, searchQuery]);

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FF9800'; // Orange
      case 'Processing':
        return '#2196F3'; // Blue
      case 'Approved':
        return '#4CAF50'; // Green
      case 'Completed':
        return '#4CAF50'; // Green
      case 'Rejected':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  // Get urgency color
  const getUrgencyColor = urgency => {
    switch (urgency) {
      case 'High':
        return '#F44336'; // Red
      case 'Medium':
        return '#FF9800'; // Orange
      case 'Low':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'Pending':
        return 'clock-o';
      case 'Processing':
        return 'cogs';
      case 'Approved':
        return 'check-circle';
      case 'Completed':
        return 'check-circle';
      case 'Rejected':
        return 'times-circle';
      default:
        return 'question-circle';
    }
  };

  // Handle view request details
  const handleViewDetails = request => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  // Handle new request
  const handleNewRequest = () => {
    setSelectedDocumentType('');
    setReason('');
    setDetails('');
    setUrgency('Medium');
    setRequestModalVisible(true);
  };

  // Handle submit request
  const handleConfirmSubmit = () => {
    if (!selectedDocumentType) {
      Alert.alert('Error', 'Please select a document type.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason for the request.');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setRequestModalVisible(false);
      Alert.alert('Success', 'Request submitted successfully!', [
        { text: 'OK', style: 'default' },
      ]);
    }, 1500);
  };

  // Handle cancel request
  const handleCancelRequest = () => {
    setRequestModalVisible(false);
  };

  // Render request card
  const renderRequestCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.requestTitle}>{item.documentType}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Icon name={getStatusIcon(item.status)} size={12} color="#fff" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon
              name="info-circle"
              size={14}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{item.reason}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>Submitted: {item.submittedDate}</Text>
          </View>

          {item.processedDate && (
            <View style={styles.infoRow}>
              <Icon
                name="calendar-check"
                size={14}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Processed: {item.processedDate}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Icon
              name="exclamation-triangle"
              size={14}
              color="#666"
              style={styles.icon}
            />
            <Text
              style={[
                styles.infoText,
                { color: getUrgencyColor(item.urgency) },
              ]}
            >
              Urgency: {item.urgency}
            </Text>
          </View>

          {item.comments && (
            <View style={styles.infoRow}>
              <Icon name="comment" size={14} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>{item.comments}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="eye" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Document Requests</Text>
        <TouchableOpacity
          style={styles.newRequestButton}
          onPress={handleNewRequest}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.newRequestButtonText}>New Request</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
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
        {[
          'All',
          'Pending',
          'Processing',
          'Approved',
          'Completed',
          'Rejected',
        ].map(renderFilterButton)}
      </ScrollView>

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' && !searchQuery
                ? 'Requests will appear here'
                : 'Try adjusting your filters'}
            </Text>
          </View>
        }
      />

      {/* Request Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedRequest && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedRequest.documentType}
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
                      <Text style={styles.sectionTitle}>Request Details</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Document Type:</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.documentType}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Reason:</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.reason}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedRequest.status,
                              ),
                            },
                          ]}
                        >
                          <Icon
                            name={getStatusIcon(selectedRequest.status)}
                            size={12}
                            color="#fff"
                          />
                          <Text style={styles.statusText}>
                            {selectedRequest.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Urgency:</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: getUrgencyColor(selectedRequest.urgency) },
                          ]}
                        >
                          {selectedRequest.urgency}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Submitted:</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.submittedDate}
                        </Text>
                      </View>
                      {selectedRequest.processedDate && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Processed:</Text>
                          <Text style={styles.detailValue}>
                            {selectedRequest.processedDate}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>
                        Additional Details
                      </Text>
                      <Text style={styles.modalDescription}>
                        {selectedRequest.details}
                      </Text>
                    </View>

                    {selectedRequest.comments && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Admin Comments</Text>
                        <Text style={styles.modalDescription}>
                          {selectedRequest.comments}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.modalActionButton,
                        styles.closeModalButton,
                      ]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Icon
                        name="times"
                        size={16}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* New Request Modal */}
      <Modal
        visible={requestModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Document Request</Text>
                <TouchableOpacity
                  onPress={() => setRequestModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Document Type</Text>
                  <Text style={styles.inputLabel}>Select document type:</Text>
                  <ScrollView style={styles.documentTypeList}>
                    {requestTypes.map(type => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.documentTypeItem,
                          selectedDocumentType === type.name &&
                            styles.documentTypeItemActive,
                        ]}
                        onPress={() => setSelectedDocumentType(type.name)}
                      >
                        <Icon name={type.icon} size={16} color="#666" />
                        <Text style={styles.documentTypeText}>{type.name}</Text>
                        {selectedDocumentType === type.name && (
                          <Icon name="check-circle" size={16} color="#4CAF50" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Request Details</Text>
                  <Text style={styles.inputLabel}>Reason for request:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Bank loan, Admission, Job application"
                    value={reason}
                    onChangeText={setReason}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.inputLabel}>
                    Additional details (optional):
                  </Text>
                  <TextInput
                    style={[styles.textInput, { height: 100 }]}
                    multiline
                    numberOfLines={4}
                    placeholder="Provide any additional information..."
                    value={details}
                    onChangeText={setDetails}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Urgency Level</Text>
                  <View style={styles.urgencyButtons}>
                    <TouchableOpacity
                      style={[
                        styles.urgencyButton,
                        urgency === 'High' && styles.urgencyButtonHigh,
                      ]}
                      onPress={() => setUrgency('High')}
                    >
                      <Text
                        style={[
                          styles.urgencyButtonText,
                          urgency === 'High' && styles.urgencyButtonTextActive,
                        ]}
                      >
                        High
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.urgencyButton,
                        urgency === 'Medium' && styles.urgencyButtonMedium,
                      ]}
                      onPress={() => setUrgency('Medium')}
                    >
                      <Text
                        style={[
                          styles.urgencyButtonText,
                          urgency === 'Medium' &&
                            styles.urgencyButtonTextActive,
                        ]}
                      >
                        Medium
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.urgencyButton,
                        urgency === 'Low' && styles.urgencyButtonLow,
                      ]}
                      onPress={() => setUrgency('Low')}
                    >
                      <Text
                        style={[
                          styles.urgencyButtonText,
                          urgency === 'Low' && styles.urgencyButtonTextActive,
                        ]}
                      >
                        Low
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.cancelButton]}
                  onPress={handleCancelRequest}
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
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
    backgroundColor: '#E91E63',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  newRequestButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
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
  requestCard: {
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
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    gap: 4,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  cancelButton: {
    backgroundColor: '#F44336',
  },
  closeModalButton: {
    backgroundColor: '#757575',
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
  documentTypeList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  documentTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  documentTypeItemActive: {
    backgroundColor: '#f0f8ff',
    borderBottomColor: '#2196F3',
  },
  documentTypeText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  urgencyButtonHigh: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  urgencyButtonMedium: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  urgencyButtonLow: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  urgencyButtonTextActive: {
    color: '#fff',
  },
});

export default AdminRequestScreen;
