import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { request } from '../services/api';

const EventScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionStr = await AsyncStorage.getItem('auth_session');
      let token = null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        token = session.token;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await request('/events', {
        method: 'GET',
        headers: headers,
      });

      if (response.success) {
        setEvents(response.data);
      } else {
        setError(response.error || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('❌ [EventScreen] Error fetching events:', err);
      setError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = type => {
    const safeType = (type || '').toLowerCase();
    if (safeType.includes('cultural')) return '#ec4899'; // Pink-500
    if (safeType.includes('academic')) return '#3b82f6'; // Blue-500
    if (safeType.includes('sport')) return '#f97316'; // Orange-500
    if (safeType.includes('fest')) return '#a855f7'; // Purple-500
    if (safeType.includes('workshop')) return '#10b981'; // Emerald-500
    return '#6b7280'; // Gray-500
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Upcoming': return '#10b981';
      case 'Live': return '#f59e0b';
      case 'Completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleViewDetails = event => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <View style={[styles.categoryDot, { backgroundColor: getEventColor(item.category) }]} />
          <Text style={styles.categoryText}>{item.category || 'Event'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>

      <View style={styles.divider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Icon name="calendar-clock" size={16} color="#9ca3af" style={{ marginRight: 6 }} />
          <Text style={styles.detailText}>
            {formatDate(item.event_date)} • {formatTime(item.start_time)}
          </Text>
        </View>

        {item.venue && (
          <View style={styles.detailItem}>
            <Icon name="map-marker-outline" size={16} color="#9ca3af" style={{ marginRight: 6 }} />
            <Text style={styles.detailText} numberOfLines={1}>{item.venue}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading Events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Modern Header - White Background */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Events</Text>
          <Text style={styles.headerSubtitle}>Upcoming school activities</Text>
        </View>
      </View>

      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank-outline" size={64} color="#e5e7eb" />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubtext}>Check back later for new events</Text>
            {error && (
              <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Modern Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle} numberOfLines={1}>{selectedEvent?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  <View style={styles.modalSection}>
                    <View style={[styles.categoryBadge, { alignSelf: 'flex-start', marginBottom: 16 }]}>
                      <View style={[styles.categoryDot, { backgroundColor: getEventColor(selectedEvent.category) }]} />
                      <Text style={styles.categoryText}>{selectedEvent.category || 'Event'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Icon name="calendar" size={20} color="#FF751F" style={styles.infoIcon} />
                      <View>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>{formatDate(selectedEvent.event_date)}</Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Icon name="clock-outline" size={20} color="#FF751F" style={styles.infoIcon} />
                      <View>
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>
                          {formatTime(selectedEvent.start_time)}
                          {selectedEvent.end_time ? ` - ${formatTime(selectedEvent.end_time)}` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Icon name="map-marker-outline" size={20} color="#FF751F" style={styles.infoIcon} />
                      <View>
                        <Text style={styles.infoLabel}>Venue</Text>
                        <Text style={styles.infoValue}>{selectedEvent.venue || 'TBA'}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>About Event</Text>
                    <Text style={styles.description}>{selectedEvent.description || 'No description available.'}</Text>
                  </View>

                  {(selectedEvent.organizer || selectedEvent.target_audience) && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Additional Info</Text>
                      {selectedEvent.organizer && (
                        <Text style={styles.metaText}>• Organizer: {selectedEvent.organizer}</Text>
                      )}
                      {selectedEvent.target_audience && (
                        <Text style={styles.metaText}>• Audience: {selectedEvent.target_audience}</Text>
                      )}
                    </View>
                  )}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 60,
    paddingBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 15,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 12,
  },
  cardDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#FF751F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,
    width: 24, // Align centers
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
});

export default EventScreen;
