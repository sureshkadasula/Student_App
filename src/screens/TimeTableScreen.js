import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample timetable data
export const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Sample timetable data for each day and time slot
export const timetableData = {
  Monday: {
    '9:00 AM - 10:00 AM': 'Mathematics',
    '10:00 AM - 11:00 AM': 'Science',
    '11:00 AM - 12:00 PM': 'English',
    '12:00 PM - 1:00 PM': 'Lunch Break',
    '1:00 PM - 2:00 PM': 'History',
    '2:00 PM - 3:00 PM': 'Physical Education',
    '3:00 PM - 4:00 PM': 'Art',
  },
  Tuesday: {
    '9:00 AM - 10:00 AM': 'Physics',
    '10:00 AM - 11:00 AM': 'Chemistry',
    '11:00 AM - 12:00 PM': 'Biology',
    '12:00 PM - 1:00 PM': 'Lunch Break',
    '1:00 PM - 2:00 PM': 'Computer Science',
    '2:00 PM - 3:00 PM': 'Mathematics',
    '3:00 PM - 4:00 PM': 'English',
  },
  Wednesday: {
    '9:00 AM - 10:00 AM': 'Geography',
    '10:00 AM - 11:00 AM': 'Economics',
    '11:00 AM - 12:00 PM': 'Civics',
    '12:00 PM - 1:00 PM': 'Lunch Break',
    '1:00 PM - 2:00 PM': 'Physical Education',
    '2:00 PM - 3:00 PM': 'Art & Craft',
    '3:00 PM - 4:00 PM': 'Music',
  },
  Thursday: {
    '9:00 AM - 10:00 AM': 'Mathematics',
    '10:00 AM - 11:00 AM': 'Science',
    '11:00 AM - 12:00 PM': 'English',
    '12:00 PM - 1:00 PM': 'Lunch Break',
    '1:00 PM - 2:00 PM': 'History',
    '2:00 PM - 3:00 PM': 'Computer Science',
    '3:00 PM - 4:00 PM': 'Library',
  },
  Friday: {
    '9:00 AM - 10:00 AM': 'Physics',
    '10:00 AM - 11:00 AM': 'Chemistry',
    '11:00 AM - 12:00 PM': 'Biology',
    '12:00 PM - 1:00 PM': 'Lunch Break',
    '1:00 PM - 2:00 PM': 'Physical Education',
    '2:00 PM - 3:00 PM': 'Art',
    '3:00 PM - 4:00 PM': 'Activity',
  },
};

const TimeTableScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF751F" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Time Table</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.weekHeader}>
            <Icon name="calendar-week" size={24} color="#FF751F" />
            <Text style={styles.weekTitle}>Weekly Schedule</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
            <View style={styles.tableCard}>
              {/* Header Row - Time Slots */}
              <View style={styles.headerRow}>
                <View style={[styles.headerCell, styles.dayHeaderCell]}>
                  <Text style={styles.headerText}>Day</Text>
                </View>
                {timeSlots.map((slot, index) => (
                  <View key={index} style={styles.timeHeaderCell}>
                    <Text style={styles.headerText}>{slot}</Text>
                  </View>
                ))}
              </View>

              {/* Data Rows - Days with subjects */}
              {days.map((day, dayIndex) => (
                <View key={dayIndex} style={[styles.dataRow, dayIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <View style={[styles.dayCell, styles.dayHeaderCell]}>
                    <Text style={styles.dayText}>{day.substring(0, 3)}</Text>
                  </View>
                  {timeSlots.map((slot, slotIndex) => {
                    const subject = timetableData[day][slot] || '-';
                    const isLunch = subject === 'Lunch Break';
                    return (
                      <View key={slotIndex} style={[styles.subjectCell, isLunch && styles.lunchCell]}>
                        <Text style={[styles.subjectText, isLunch && styles.lunchText]}>
                          {subject}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#e0f2fe' }]} />
              <Text style={styles.legendText}>Classes</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#fef3c7' }]} />
              <Text style={styles.legendText}>Lunch Break</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#FF751F',
    paddingVertical: 20,
    paddingHorizontal: 16,
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
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 10,
  },
  tableScrollContent: {
    paddingBottom: 10,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#FF751F',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8fafc',
  },
  headerCell: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  timeHeaderCell: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  dayHeaderCell: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    backgroundColor: '#fff7ed',
  },
  dayCell: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  subjectCell: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  lunchCell: {
    backgroundColor: '#fef3c7',
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  dayText: {
    color: '#FF751F',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subjectText: {
    color: '#334155',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  lunchText: {
    color: '#d97706',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendText: {
    fontSize: 13,
    color: '#64748b',
  },
});

export default TimeTableScreen;
