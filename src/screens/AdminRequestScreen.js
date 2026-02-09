import React, { useState, useEffect, useMemo } from 'react';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthService from '../services/AuthService';
import AdminRequestService from '../services/AdminRequestService';

// Request types mapping for the UI
const requestTypes = [
  { id: 'leave', name: 'Leave Request', icon: 'clock-o', description: 'Request for leave of absence' },
  { id: 'bonafide', name: 'Bonafide Certificate', icon: 'certificate', description: 'Request for bonafide certificate' },
  { id: 'transfer', name: 'Transfer Certificate', icon: 'file-text', description: 'Request for transfer certificate' },
  { id: 'idcard', name: 'ID Card Replacement', icon: 'id-card', description: 'Request for lost/damaged ID card' },
  { id: 'character', name: 'Character Certificate', icon: 'star', description: 'Request for character certificate' },
  { id: 'other', name: 'Other Request', icon: 'question-circle', description: 'Any other administrative request' },
];

const AdminRequestScreen = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // UI State
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedTypeObj, setSelectedTypeObj] = useState(null); // The selected type object from requestTypes
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [urgency, setUrgency] = useState('Medium');

  useEffect(() => {
    loadUserAndRequests();
  }, []);

  const loadUserAndRequests = async () => {
    try {
      setLoading(true);
      // Get user session
      const session = await AuthService.getSession();
      if (session && session.user) {
        setUser(session.user);
        await fetchRequests(session.user.userid || session.user.id);
      } else {
        // Handle unauthenticated state if necessary
        Alert.alert('Error', 'User session not found. Please login again.');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Safe fetch function
  const fetchRequests = async (studentId) => {
    try {
      if (!studentId) return;
      const response = await AdminRequestService.getMyRequests(studentId);
      if (response.success) {
        setRequests(response.data || []);
      } else {
        console.error('Failed to fetch requests:', response.error);
        // Don't alert on initial load if just empty/error, maybe quiet fail or retry
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (user) {
      fetchRequests(user.userid || user.id).then(() => setRefreshing(false));
    } else {
      loadUserAndRequests();
    }
  };

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    let filtered = requests || [];

    // Apply status filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(req =>
        req.status && req.status.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        (req.request_type && req.request_type.toLowerCase().includes(query)) ||
        (req.title && req.title.toLowerCase().includes(query)) ||
        (req.description && req.description.toLowerCase().includes(query))
      );
    }

    // Sort by date descending (newest first)
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [requests, selectedFilter, searchQuery]);

  // Helpers for UI
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'pending': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'check-circle';
      case 'rejected': return 'times-circle';
      case 'pending': return 'clock-o';
      default: return 'question-circle';
    }
  };

  const getUrgencyColor = (urgencyLvl) => {
    switch (urgencyLvl?.toLowerCase()) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  // Actions
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleNewRequest = () => {
    setSelectedTypeObj(null);
    setReason('');
    setDetails('');
    setUrgency('Medium');
    setRequestModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedTypeObj) {
      Alert.alert('Error', 'Please select a request type');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason/title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not identified');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        request_type: selectedTypeObj.name, // Sending readable name for now, or use ID
        title: reason,
        description: details,
        requester_id: user.userid || user.id,
        requester_name: user.name || 'Student',
        requester_role: 'student',
        metadata: {
          urgency: urgency,
          type_id: selectedTypeObj.id,
          // Add other student details if needed
        }
      };

      const response = await AdminRequestService.createRequest(payload);

      if (response.success) {
        Alert.alert('Success', 'Request submitted successfully');
        setRequestModalVisible(false);
        onRefresh(); // Reload list
      } else {
        Alert.alert('Error', response.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Items
  const renderRequestCard = ({ item }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.requestTitle}>{item.request_type || item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Icon name={getStatusIcon(item.status)} size={12} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText} numberOfLines={1}>{item.title}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={14} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        {item.metadata?.urgency && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: getUrgencyColor(item.metadata.urgency), fontWeight: 'bold' }]}>
              {item.metadata.urgency} Priority
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter}
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterButtonText, selectedFilter === filter && styles.filterButtonTextActive]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <TouchableOpacity style={styles.newRequestButton} onPress={handleNewRequest}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.newRequestButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search my requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filters */}
      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequestCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          }
        />
      )}

      {/* Detail Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRequest && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedRequest.request_type}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="times" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Status</Text>
                    <View style={[styles.statusBadge, { alignSelf: 'flex-start', backgroundColor: getStatusColor(selectedRequest.status) }]}>
                      <Text style={styles.statusText}>{selectedRequest.status}</Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Title/Reason</Text>
                    <Text style={styles.detailValue}>{selectedRequest.title}</Text>
                  </View>

                  {selectedRequest.description ? (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.detailValue}>{selectedRequest.description}</Text>
                    </View>
                  ) : null}

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Date</Text>
                    <Text style={styles.detailValue}>{new Date(selectedRequest.created_at).toLocaleString()}</Text>
                  </View>

                  {selectedRequest.rejection_reason && (
                    <View style={styles.modalSection}>
                      <Text style={[styles.sectionTitle, { color: '#F44336' }]}>Rejection Reason</Text>
                      <Text style={styles.detailValue}>{selectedRequest.rejection_reason}</Text>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* New Request Modal */}
      <Modal visible={requestModalVisible} animationType="slide" transparent onRequestClose={() => setRequestModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Request</Text>
              <TouchableOpacity onPress={() => setRequestModalVisible(false)}>
                <Icon name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Type Selection */}
              <Text style={styles.inputLabel}>Request Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {requestTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeCard, selectedTypeObj?.id === type.id && styles.typeCardActive]}
                    onPress={() => setSelectedTypeObj(type)}
                  >
                    <Icon name={type.icon} size={20} color={selectedTypeObj?.id === type.id ? '#fff' : '#666'} />
                    <Text style={[styles.typeCardText, selectedTypeObj?.id === type.id && styles.typeCardTextActive]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Title / Main Reason</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Short title for your request"
                value={reason}
                onChangeText={setReason}
              />

              <Text style={styles.inputLabel}>Detailed Description</Text>
              <TextInput
                style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Explain your request in detail..."
                multiline
                numberOfLines={4}
                value={details}
                onChangeText={setDetails}
              />

              <Text style={styles.inputLabel}>Urgency</Text>
              <View style={styles.urgencyRow}>
                {['Low', 'Medium', 'High'].map(lvl => (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.urgencyBtn, urgency === lvl && { backgroundColor: getUrgencyColor(lvl), borderColor: getUrgencyColor(lvl) }]}
                    onPress={() => setUrgency(lvl)}
                  >
                    <Text style={[styles.urgencyBtnText, urgency === lvl && { color: '#fff' }]}>{lvl}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                onPress={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FF751F' },
  newRequestButton: { flexDirection: 'row', backgroundColor: '#FF751F', padding: 8, borderRadius: 20, alignItems: 'center' },
  newRequestButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, padding: 10, borderRadius: 10, alignItems: 'center' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333' },
  filterContent: { paddingHorizontal: 15, alignItems: 'center' },
  filterButton: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 10, height: 32, justifyContent: 'center' },
  filterButtonActive: { backgroundColor: '#FF751F' },
  filterButtonText: { color: '#333' },
  filterButtonTextActive: { color: '#fff' },
  listContent: { padding: 15 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16 },

  // Card
  requestCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  requestTitle: { fontWeight: 'bold', fontSize: 16, color: '#333', flex: 1 },
  statusBadge: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  icon: { marginRight: 6, width: 14, textAlign: 'center' },
  infoText: { color: '#666', fontSize: 14 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 15, maxHeight: '80%', paddingBottom: 20 },
  modalHeader: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalBody: { padding: 15 },
  modalSection: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, color: '#999', marginBottom: 5 },
  detailValue: { fontSize: 16, color: '#333' },

  // Form
  inputLabel: { fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#f9f9f9', color: '#333' },
  typeScroll: { flexDirection: 'row', marginBottom: 10 },
  typeCard: { width: 100, height: 80, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10, padding: 5 },
  typeCardActive: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  typeCardText: { fontSize: 12, textAlign: 'center', marginTop: 5, color: '#666' },
  typeCardTextActive: { color: '#fff' },
  urgencyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  urgencyBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  urgencyBtnText: { fontWeight: 'bold', color: '#666' },
  submitButton: { backgroundColor: '#E91E63', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AdminRequestScreen;
