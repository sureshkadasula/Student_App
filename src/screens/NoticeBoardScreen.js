import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample notices data
const noticesData = [
  {
    id: '1',
    title: 'Final Exam Schedule Released',
    description:
      'The final examination schedule for the current academic year has been released. Please check the timetable carefully and prepare accordingly. All students must bring their ID cards and follow the examination guidelines.',
    category: 'Academic',
    date: '2024-01-20',
    postedBy: 'Principal Office',
    priority: 'high',
    attachment: 'exam_schedule.pdf',
  },
  {
    id: '2',
    title: 'Winter Vacation Announcement',
    description:
      'School will remain closed for winter vacation from December 25th to January 5th. Classes will resume on January 6th. We wish all students and staff a wonderful holiday season.',
    category: 'Holidays',
    date: '2024-01-15',
    postedBy: 'Administration',
    priority: 'medium',
    attachment: null,
  },
  {
    id: '3',
    title: 'Science Fair 2024',
    description:
      'Annual Science Fair will be held on February 15th in the school auditorium. Students from grades 6-12 are encouraged to participate. Registration deadline is January 30th. Prizes will be awarded for best projects.',
    category: 'Events',
    date: '2024-01-18',
    postedBy: 'Science Department',
    priority: 'high',
    attachment: 'science_fair_brochure.pdf',
  },
  {
    id: '4',
    title: 'Library Book Return Reminder',
    description:
      'All students are reminded to return borrowed library books by January 25th. Failure to return books may result in fines. Please check your library account for any pending items.',
    category: 'General',
    date: '2024-01-19',
    postedBy: 'Library Department',
    priority: 'low',
    attachment: null,
  },
  {
    id: '5',
    title: 'Sports Day Postponed',
    description:
      'Due to weather conditions, the annual Sports Day has been postponed to February 5th. All registered participants will be notified of the new schedule. Please keep your sports kits ready.',
    category: 'Events',
    date: '2024-01-21',
    postedBy: 'Sports Department',
    priority: 'medium',
    attachment: null,
  },
  {
    id: '6',
    title: 'Parent-Teacher Meeting',
    description:
      'The next Parent-Teacher Meeting is scheduled for January 28th from 3:00 PM to 5:00 PM. Parents are requested to bring their ID cards. Meeting slots can be booked through the school portal.',
    category: 'Academic',
    date: '2024-01-22',
    postedBy: 'Academic Office',
    priority: 'high',
    attachment: 'ptm_schedule.pdf',
  },
  {
    id: '7',
    title: 'New Computer Lab Equipment',
    description:
      'The school has installed new computers in the computer lab. Students will now have access to the latest software and hardware for their practical sessions. Lab hours remain the same.',
    category: 'General',
    date: '2024-01-17',
    postedBy: 'IT Department',
    priority: 'low',
    attachment: null,
  },
  {
    id: '8',
    title: 'Republic Day Celebration',
    description:
      'Republic Day will be celebrated on January 26th with a special assembly at 8:00 AM. All students must wear their formal uniform. Cultural program will follow the flag hoisting ceremony.',
    category: 'Events',
    date: '2024-01-23',
    postedBy: 'Cultural Committee',
    priority: 'medium',
    attachment: null,
  },
];

const NoticeBoardScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get unique categories for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [
      'All',
      ...new Set(noticesData.map(n => n.category)),
    ];
    return uniqueCategories;
  }, []);

  // Filter and search notices
  const filteredNotices = useMemo(() => {
    let filtered = noticesData;

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
          notice.category.toLowerCase().includes(query) ||
          notice.description.toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedFilter, searchQuery]);

  // Get priority color
  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#F44336'; // Red
      case 'medium':
        return '#FF9800'; // Orange
      case 'low':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Get category color
  const getCategoryColor = category => {
    switch (category) {
      case 'Academic':
        return '#2196F3'; // Blue
      case 'Events':
        return '#9C27B0'; // Purple
      case 'Holidays':
        return '#4CAF50'; // Green
      case 'General':
        return '#607D8B'; // Gray
      default:
        return '#757575';
    }
  };

  // Format date
  const formatDate = dateStr => {
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
    return (
      <TouchableOpacity
        style={styles.noticeCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.noticeTitle}>{item.title}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Icon name="exclamation" size={12} color="#fff" />
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="tag" size={14} color="#666" style={styles.icon} />
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="user" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.postedBy}</Text>
          </View>

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
        <Text style={styles.headerTitle}>Notice Board</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <Text
          style={styles.searchInput}
          placeholder="Search notices..."
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
        {categories.map(renderFilterButton)}
      </ScrollView>

      {/* Notices List */}
      <FlatList
        data={filteredNotices}
        renderItem={renderNoticeCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No notices found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'All' && !searchQuery
                ? 'Notices will appear here'
                : 'Try adjusting your filters'}
            </Text>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedNotice && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedNotice.title}
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
                        <Text style={styles.detailLabel}>Category:</Text>
                        <View
                          style={[
                            styles.categoryBadge,
                            {
                              backgroundColor: getCategoryColor(
                                selectedNotice.category,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.categoryText}>
                            {selectedNotice.category}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Posted By:</Text>
                        <Text style={styles.detailValue}>
                          {selectedNotice.postedBy}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(selectedNotice.date)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Priority:</Text>
                        <View
                          style={[
                            styles.priorityBadge,
                            {
                              backgroundColor: getPriorityColor(
                                selectedNotice.priority,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.priorityText}>
                            {selectedNotice.priority.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.modalDescription}>
                        {selectedNotice.description}
                      </Text>
                    </View>

                    {selectedNotice.attachment && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Attachment</Text>
                        <View style={styles.attachmentInfo}>
                          <Icon name="paperclip" size={16} color="#666" />
                          <Text style={styles.attachmentName}>
                            {selectedNotice.attachment}
                          </Text>
                          <TouchableOpacity
                            style={styles.downloadAttachmentButton}
                            onPress={() =>
                              handleDownloadAttachment(selectedNotice)
                            }
                          >
                            <Icon name="download" size={16} color="#2196F3" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalActions}>
                    {selectedNotice.attachment && (
                      <TouchableOpacity
                        style={[
                          styles.modalActionButton,
                          styles.downloadButton,
                        ]}
                        onPress={() => handleDownloadAttachment(selectedNotice)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
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
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
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
  noticeCard: {
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
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
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
  downloadButton: {
    backgroundColor: '#FF9800',
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
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
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
});

export default NoticeBoardScreen;
