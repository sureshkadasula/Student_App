import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { request } from '../services/api';

const ClassesScreen = () => {
  const [token, setToken] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Day selection state
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() - 1] || 'Monday');

  useEffect(() => {
    const loadToken = async () => {
      const session = await AuthService.getSession();
      if (session?.token) {
        setToken(session.token);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!days.includes(selectedDay)) {
      setSelectedDay('Monday');
    }
    fetchTimetable();
  }, [token]);

  const fetchTimetable = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await request('/classes/my-timetable', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.success) {
        setTimetable(response.data);
      } else {
        if (response.status === 404) {
          setError('No timetable found for your class.');
        } else {
          setError(response.error || 'Failed to load timetable');
        }
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subjectName) => {
    const name = (subjectName || '').toLowerCase();
    if (name.includes('math')) return '#3b82f6'; // Blue
    if (name.includes('science') || name.includes('physics') || name.includes('chem')) return '#10b981'; // Green
    if (name.includes('history') || name.includes('geo')) return '#f59e0b'; // Amber
    if (name.includes('english') || name.includes('hindi')) return '#8b5cf6'; // Purple
    if (name.includes('break') || name.includes('lunch')) return '#94a3b8'; // Slate
    return '#FF751F'; // Default Orange
  };

  const renderTimeSlots = () => {
    if (!timetable || !timetable.timetable) return null;

    const daySchedule = timetable.timetable[selectedDay];

    if (!daySchedule || Object.keys(daySchedule).length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-blank-outline" size={64} color="#e2e8f0" />
          <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
          <Text style={styles.emptySubtext}>Enjoy your free time!</Text>
        </View>
      );
    }

    const sortedSlots = Object.keys(daySchedule).sort((a, b) => {
      const timeA = a.split('–')[0] || a.split('-')[0];
      const timeB = b.split('–')[0] || b.split('-')[0];
      return timeA.localeCompare(timeB);
    });

    return sortedSlots.map((slot, index) => {
      const slotData = daySchedule[slot];
      const isLast = index === sortedSlots.length - 1;

      if (!slotData) {
        // Empty Slot logic if needed, skipping for cleaner UI
        return null;
      }

      const { subject, faculty, room_no } = slotData;
      const isBreak = subject.toLowerCase().includes('break') || subject.toLowerCase().includes('lunch');
      const subjectColor = getSubjectColor(subject);

      return (
        <View key={index} style={styles.timeSlotRow}>
          {/* Timeline Column */}
          <View style={styles.timelineColumn}>
            <Text style={styles.startTime}>{slot.split('-')[0].trim()}</Text>
            <View style={[styles.timelineDot, { borderColor: isBreak ? '#cbd5e1' : subjectColor }]} />
            {!isLast && <View style={styles.timelineLine} />}
          </View>

          {/* Card Column */}
          <View style={[styles.cardContainer, isBreak && styles.breakCardContainer]}>
            <View style={[styles.cardContent, { borderLeftColor: isBreak ? '#cbd5e1' : subjectColor }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.subjectName, isBreak && styles.breakText]}>{subject}</Text>
                {isBreak ? (
                  <Icon name="coffee-outline" size={20} color="#94a3b8" />
                ) : (
                  <View style={[styles.iconCircle, { backgroundColor: `${subjectColor}20` }]}>
                    <Icon name="book-open-page-variant" size={16} color={subjectColor} />
                  </View>
                )}
              </View>

              {!isBreak && (
                <View style={styles.cardDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="account-tie" size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>{faculty || 'No Faculty'}</Text>
                  </View>
                  {room_no && (
                    <View style={styles.detailItem}>
                      <Icon name="door-open" size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <Text style={styles.detailText}>Room {room_no}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Icon name="clock-outline" size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>{slot}</Text>
                  </View>
                </View>
              )}
              {isBreak && (
                <Text style={styles.breakDurationText}>{slot}</Text>
              )}
            </View>
          </View>
        </View>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading Timetable...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Class Schedule</Text>
          <Text style={styles.headerSubtitle}>
            {timetable ? timetable.class_name : 'Your Classes'}
          </Text>
        </View>
        <TouchableOpacity onPress={fetchTimetable} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color="#FF751F" />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View style={styles.daysContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScrollContent}
        >
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === day && styles.activeDayButton
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day && styles.activeDayText
              ]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={60} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTimetable}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.scheduleContainer}>
            {renderTimeSlots()}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 0,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: -40, // Offset the refresh button width to true center
    paddingLeft: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  daysContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  daysScrollContent: {
    paddingHorizontal: 20,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeDayButton: {
    backgroundColor: '#FF751F',
    borderColor: '#FF751F',
    elevation: 2,
    shadowColor: '#FF751F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  activeDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleContainer: {
    flex: 1,
  },

  // Timeline Styles
  timeSlotRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  startTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 3,
    zIndex: 2,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#e2e8f0',
    marginRight: 5, // Center with dot (12 width / 2 - 1 width = 5 offset from right)
    marginVertical: -2, // Connect dots
  },
  cardContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  breakCardContainer: {
    paddingBottom: 15,
  },
  cardContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  breakText: {
    color: '#64748b',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  breakDurationText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  // Empty & Error States
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#94a3b8',
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF751F',
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ClassesScreen;
