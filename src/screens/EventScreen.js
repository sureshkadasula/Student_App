import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample events data
const eventsData = [
  {
    id: '1',
    title: 'Annual Cultural Fest 2024',
    type: 'Cultural',
    category: 'Annual',
    date: '2024-02-15',
    time: '10:00 AM - 8:00 PM',
    venue: 'College Auditorium',
    description:
      'Join us for our grand annual cultural fest featuring dance performances, music concerts, drama, and food stalls. This is the biggest event of the year!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    highlights: [
      'Dance Competition',
      'Music Concert',
      'Food Festival',
      'Art Exhibition',
    ],
  },
  {
    id: '2',
    title: 'Flash Mob - Independence Day',
    type: 'Flash Mob',
    category: 'Special',
    date: '2024-01-26',
    time: '9:00 AM',
    venue: 'College Ground',
    description:
      'A surprise flash mob performance to celebrate Independence Day. All students are invited to participate or watch this exciting event!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    highlights: ['Patriotic Dance', 'Group Performance', 'Surprise Element'],
  },
  {
    id: '3',
    title: 'Tech Fest 2024',
    type: 'Fest',
    category: 'Technical',
    date: '2024-03-10',
    time: '9:00 AM - 6:00 PM',
    venue: 'Computer Science Block',
    description:
      'Annual technical fest featuring coding competitions, robotics workshops, hackathons, and tech exhibitions. Prizes worth ₹50,000 to be won!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    highlights: [
      'Hackathon',
      'Robotics Workshop',
      'Coding Contest',
      'Tech Exhibition',
    ],
  },
  {
    id: '4',
    title: 'Freshers Party 2024',
    type: 'Cultural',
    category: 'Social',
    date: '2024-01-20',
    time: '6:00 PM - 10:00 PM',
    venue: 'College Lawn',
    description:
      'Welcome party for new students. Fun games, music, dance, and dinner. A great opportunity to make new friends!',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
    highlights: ['Welcome Speech', 'Ice Breaker Games', 'Dinner', 'Music'],
  },
  {
    id: '5',
    title: 'Annual Sports Meet',
    type: 'Annual',
    category: 'Sports',
    date: '2024-02-28',
    time: '8:00 AM - 5:00 PM',
    venue: 'Sports Complex',
    description:
      'Annual sports meet with track and field events, team sports, and fun activities. Prizes for winners and participation certificates!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1461896836934- voices-3?w=400',
    highlights: ['Track Events', 'Team Sports', 'Fun Activities', 'Prizes'],
  },
  {
    id: '6',
    title: 'Music Night',
    type: 'Cultural',
    category: 'Entertainment',
    date: '2024-01-25',
    time: '7:00 PM - 11:00 PM',
    venue: 'Open Air Theatre',
    description:
      'A night of live music performances by student bands and special guests. Enjoy rock, pop, and classical music!',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    highlights: ['Live Bands', 'Student Performances', 'Special Guests'],
  },
  {
    id: '7',
    title: 'Workshop on AI & ML',
    type: 'Workshop',
    category: 'Educational',
    date: '2024-03-05',
    time: '2:00 PM - 5:00 PM',
    venue: 'Seminar Hall',
    description:
      'Hands-on workshop on Artificial Intelligence and Machine Learning. Learn from industry experts and work on real projects!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    highlights: ['Expert Speakers', 'Hands-on Projects', 'Certificate'],
  },
  {
    id: '8',
    title: 'Farewell Party',
    type: 'Cultural',
    category: 'Social',
    date: '2024-04-15',
    time: '6:00 PM - 11:00 PM',
    venue: 'College Lawn',
    description:
      'Farewell party for graduating students. A memorable evening with performances, speeches, and dinner!',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400',
    highlights: ['Performances', 'Speeches', 'Dinner', 'Memories'],
  },
];

const EventScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get unique event types for color coding
  const getEventColor = type => {
    switch (type) {
      case 'Cultural':
        return '#E91E63'; // Pink
      case 'Annual':
        return '#FF9800'; // Orange
      case 'Fest':
        return '#9C27B0'; // Purple
      case 'Flash Mob':
        return '#00BCD4'; // Cyan
      case 'Workshop':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'Upcoming':
        return '#4CAF50'; // Green
      case 'Live':
        return '#FF9800'; // Orange
      case 'Completed':
        return '#757575'; // Gray
      default:
        return '#757575'; // Gray
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'Upcoming':
        return 'calendar';
      case 'Live':
        return 'play-circle';
      case 'Completed':
        return 'check-circle';
      default:
        return 'question-circle';
    }
  };

  // Handle view event details
  const handleViewDetails = event => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Render event card
  const renderEventCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.eventTypeContainer}>
            <View
              style={[
                styles.eventTypeDot,
                { backgroundColor: getEventColor(item.type) },
              ]}
            />
            <Text style={styles.eventType}>{item.type}</Text>
          </View>
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

        <Text style={styles.eventTitle}>{item.title}</Text>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock-o" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              name="map-marker"
              size={14}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{item.venue}</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {item.highlights && item.highlights.length > 0 && (
            <View style={styles.highlightsContainer}>
              {item.highlights.slice(0, 2).map((highlight, index) => (
                <View key={index} style={styles.highlightTag}>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      {/* Events List */}
      <FlatList
        data={eventsData}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>Events will appear here</Text>
          </View>
        }
      />

      {/* Event Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Icon name="times" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Event Details</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type:</Text>
                        <View style={styles.detailValueContainer}>
                          <View
                            style={[
                              styles.eventTypeDot,
                              {
                                backgroundColor: getEventColor(
                                  selectedEvent.type,
                                ),
                              },
                            ]}
                          />
                          <Text style={styles.detailValue}>
                            {selectedEvent.type}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Category:</Text>
                        <Text style={styles.detailValue}>
                          {selectedEvent.category}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                          {selectedEvent.date}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time:</Text>
                        <Text style={styles.detailValue}>
                          {selectedEvent.time}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Venue:</Text>
                        <Text style={styles.detailValue}>
                          {selectedEvent.venue}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedEvent.status,
                              ),
                            },
                          ]}
                        >
                          <Icon
                            name={getStatusIcon(selectedEvent.status)}
                            size={12}
                            color="#fff"
                          />
                          <Text style={styles.statusText}>
                            {selectedEvent.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.modalDescription}>
                        {selectedEvent.description}
                      </Text>
                    </View>

                    {selectedEvent.highlights &&
                      selectedEvent.highlights.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Highlights</Text>
                          <View style={styles.highlightsList}>
                            {selectedEvent.highlights.map(
                              (highlight, index) => (
                                <View key={index} style={styles.highlightItem}>
                                  <Icon name="star" size={12} color="#FFC107" />
                                  <Text style={styles.highlightItemText}>
                                    {highlight}
                                  </Text>
                                </View>
                              ),
                            )}
                          </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#673AB7',
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
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  eventCard: {
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
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
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
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
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
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  highlightTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highlightText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
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
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  highlightsList: {
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  highlightItemText: {
    fontSize: 14,
    color: '#333',
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
  closeModalButton: {
    backgroundColor: '#757575',
  },
});

export default EventScreen;
