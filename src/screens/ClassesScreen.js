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
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';

const ClassesScreen = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const session = await AuthService.getSession();
      console.log('🚀 [ClassesScreen] Session:', session.token);
      if (session?.token) {
        setToken(session.token);
      }
    };
    loadToken();
  }, []);
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Day selection state
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() - 1] || 'Monday');

  useEffect(() => {
    // If it's Sunday (0) or invalid, default to Monday
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

      console.log('🚀 [ClassesScreen] Requesting timetable...');

      const response = await request('/classes/my-timetable', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('📡 [ClassesScreen] Response Status:', response.status);

      if (response.success) {
        setTimetable(response.data);
      } else {
        console.warn('⚠️ [ClassesScreen] Fetch failed:', response.error);
        if (response.status === 404) {
          setError('No timetable found for your class.');
        } else {
          setError(response.error || 'Failed to load timetable');
        }
      }
    } catch (err) {
      // Should not happen as request handles it, but good safety
      console.error('❌ [ClassesScreen] Error fetching timetable:', err);
      setError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const renderTimeSlots = () => {
    if (!timetable || !timetable.timetable) return null;

    const daySchedule = timetable.timetable[selectedDay];

    if (!daySchedule || Object.keys(daySchedule).length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-o" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
        </View>
      );
    }

    // Sort time slots based on start time (e.g., "09:10–10:10")
    const sortedSlots = Object.keys(daySchedule).sort((a, b) => {
      const timeA = a.split('–')[0] || a.split('-')[0];
      const timeB = b.split('–')[0] || b.split('-')[0];
      return timeA.localeCompare(timeB);
    });

    return sortedSlots.map((slot, index) => {
      const slotData = daySchedule[slot];

      // Handle null/empty slots or break times
      if (!slotData) {
        return (
          <View key={index} style={styles.timeSlotCard}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{slot}</Text>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
            </View>
            <View style={[styles.subjectCard, styles.breakCard]}>
              <View style={styles.subjectHeader}>
                <Text style={[styles.subjectName, styles.breakText]}>
                  Free Period
                </Text>
              </View>
            </View>
          </View>
        );
      }

      const { subject, faculty } = slotData;
      const isBreak = subject.toLowerCase().includes('break') || subject.toLowerCase().includes('lunch');

      return (
        <View key={index} style={styles.timeSlotCard}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{slot}</Text>
            <View style={styles.timelineDot} />
            <View style={styles.timelineLine} />
          </View>

          <View style={[styles.subjectCard, isBreak && styles.breakCard]}>
            <View style={styles.subjectHeader}>
              <Text style={[styles.subjectName, isBreak && styles.breakText]}>
                {subject}
              </Text>
              {!isBreak && <Icon name="book" size={16} color="#FF751F" />}
            </View>
            {!isBreak && faculty && (
              <Text style={styles.teacherName}>
                {faculty}
              </Text>
            )}
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
        <View>
          <Text style={styles.headerTitle}>My Timetable</Text>
          <Text style={styles.headerSubtitle}>
            {timetable ? timetable.class_name : 'Class Schedule'}
          </Text>
        </View>
        <TouchableOpacity onPress={fetchTimetable} style={styles.refreshButton}>
          <Icon name="refresh" size={18} color="#FF751F" />
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-circle" size={40} color="#FF751F" />
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#FFF0E0',
    borderRadius: 50,
  },
  daysContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  daysScrollContent: {
    paddingHorizontal: 15,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeDayButton: {
    backgroundColor: '#FF751F',
    borderColor: '#FF751F',
    elevation: 3,
  },
  dayText: {
    color: '#666',
    fontWeight: '600',
  },
  activeDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleContainer: {
    flex: 1,
  },
  timeSlotCard: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 100,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
    paddingTop: 10,
  },
  timeText: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF751F',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 25,
    bottom: -15, // Extend to next dot
    width: 2,
    backgroundColor: '#f0f0f0',
    left: '50%',
    marginLeft: -1,
    zIndex: 0,
  },
  subjectCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF751F',
  },
  breakCard: {
    backgroundColor: '#f9f9f9',
    borderLeftColor: '#ccc',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#eee',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  breakText: {
    color: '#888',
    fontStyle: 'italic',
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 10,
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF751F',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClassesScreen;
