import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { request } from '../services/api';

const NoticeBoardScreen = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve token
      const sessionStr = await AsyncStorage.getItem('auth_session');
      let token = null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        token = session.token;
      }

      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await request('/notices', {
        method: 'GET',
        headers: headers,
      });

      if (response.success) {
        setNotices(response.data);
        console.log(response.data)
      } else {
        setError(response.error || 'Failed to fetch notices');
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter options
  const categories = useMemo(() => {
    if (!notices) return ['All'];
    const uniqueCategories = [
      'All',
      ...new Set(notices.map(n => n.category).filter(Boolean)),
    ];
    return uniqueCategories;
  }, [notices]);

  // Filter and search notices
  const filteredNotices = useMemo(() => {
    if (!notices) return [];
    let filtered = notices;

    // Apply category filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(notice => notice.category === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        notice =>
          notice.title.toLowerCase().includes(query) ||
          (notice.category && notice.category.toLowerCase().includes(query)) ||
          (notice.description && notice.description.toLowerCase().includes(query)),
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedFilter, searchQuery, notices]);

  // Get priority details
  const getPriorityDetails = priority => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return { color: '#ef4444', icon: 'alert-circle-outline', bg: '#fee2e2' };
      case 'medium':
        return { color: '#f59e0b', icon: 'alert-outline', bg: '#fef3c7' };
      case 'low':
        return { color: '#10b981', icon: 'information-outline', bg: '#d1fae5' };
      default:
        return { color: '#64748b', icon: 'bullhorn-outline', bg: '#f1f5f9' };
    }
  };

  // Get category color
  const getCategoryColor = category => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('academic')) return { bg: '#e0f2fe', text: '#0284c7' };
    if (cat.includes('event')) return { bg: '#f3e8ff', text: '#9333ea' };
    if (cat.includes('holiday')) return { bg: '#dcfce7', text: '#16a34a' };
    if (cat.includes('general')) return { bg: '#f1f5f9', text: '#475569' };
    return { bg: '#fff7ed', text: '#FF751F' }; // Default to Brand Orange
  };

  // Format date
  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle view notice details
  const handleViewDetails = notice => {
    setSelectedNotice(notice);
    setModalVisible(true);
  };

  // Handle download attachment
  const handleDownloadAttachment = notice => {
    if (notice.attachment) {
      Alert.alert('Download', `Downloading ${notice.attachment}...`, [
        { text: 'OK', style: 'default' },
      ]);
    } else {
      Alert.alert('No Attachment', 'This notice has no attached files.');
    }
  };

  // Render notice card
  const renderNoticeCard = ({ item }) => {
    const priorityDetails = getPriorityDetails(item.priority);
    const categoryStyle = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={styles.noticeCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.bg }]}>
              <Text style={[styles.categoryText, { color: categoryStyle.text }]}>{item.category || 'General'}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.created_at || item.date)}</Text>
          </View>
          <Text style={styles.noticeTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.noticecontent} numberOfLines={2}>{item.content}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.authorContainer}>
              <Icon name="account-circle-outline" size={16} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.authorText}>{item.postedBy || 'Admin'}</Text>
            </View>

            {item.attachment && (
              <Icon name="paperclip" size={16} color="#64748b" />
            )}
          </View>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading Notices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF751F" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notice Board</Text>
      </View>

      <FlatList
        data={filteredNotices}
        renderItem={renderNoticeCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search notices..."
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
                {categories.map(renderFilterButton)}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name={error ? "alert-circle-outline" : "inbox-outline"} size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>{error ? 'Failed to fetch notices' : 'No notices found'}</Text>
            <Text style={styles.emptySubtext}>
              {error ? 'Please check your connection' : (selectedFilter === 'All' && !searchQuery ? 'Notices will appear here' : 'Try adjusting your filters')}
            </Text>
            {error && (
              <TouchableOpacity style={styles.retryButton} onPress={fetchNotices}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Notice Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notice Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedNotice && (
                <View style={styles.modalBody}>
                  <View style={styles.modalHeaderDetails}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(selectedNotice.category).bg, alignSelf: 'flex-start', marginBottom: 8 }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(selectedNotice.category).text }]}>{selectedNotice.category || 'General'}</Text>
                    </View>
                    <Text style={styles.modalNoticeTitle}>{selectedNotice.title}</Text>
                    <Text style={styles.modalDate}>{formatDate(selectedNotice.created_at || selectedNotice.date)}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <View style={styles.authorRow}>
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{(selectedNotice.postedBy || 'A').charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={styles.postedByLabel}>Posted By</Text>
                        <Text style={styles.postedByName}>{selectedNotice.postedBy || 'Admin'}</Text>
                      </View>
                      {selectedNotice.priority && (
                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityDetails(selectedNotice.priority).bg }]}>
                          <Icon name={getPriorityDetails(selectedNotice.priority).icon} size={14} color={getPriorityDetails(selectedNotice.priority).color} style={{ marginRight: 4 }} />
                          <Text style={[styles.priorityText, { color: getPriorityDetails(selectedNotice.priority).color }]}>{(selectedNotice.priority || 'NORMAL').toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.modalDescription}>
                      {selectedNotice.content}
                    </Text>
                  </View>

                  {selectedNotice.attachment && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Attachment</Text>
                      <TouchableOpacity style={styles.attachmentButton} onPress={() => handleDownloadAttachment(selectedNotice)}>
                        <Icon name="file-document-outline" size={20} color="#3b82f6" />
                        <Text style={styles.attachmentButtonText}>{selectedNotice.attachment}</Text>
                        <Icon name="download" size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF751F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF751F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
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
  noticeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 22,
  },
  noticecontent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: 22,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  cardBody: {

  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#1e293b',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FF751F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  modalHeaderDetails: {
    marginBottom: 24,
  },
  modalNoticeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 28,
  },
  modalDate: {
    fontSize: 14,
    color: '#64748b',
  },
  modalSection: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  postedByLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  postedByName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  priorityBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
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
});

export default NoticeBoardScreen;
