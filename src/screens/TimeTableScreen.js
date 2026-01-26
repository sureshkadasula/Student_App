import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
      <Text style={styles.title}>Time Table</Text>
      <Text style={styles.weekTitle}>Current week</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Header Row - Time Slots */}
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, styles.dayHeader]}>
              <Text style={styles.headerText}>Days</Text>
            </View>
            {timeSlots.map((slot, index) => (
              <View key={index} style={styles.timeHeaderCell}>
                <Text style={styles.headerText}>{slot}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows - Days with subjects */}
          {days.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dataRow}>
              <View style={[styles.dayCell, styles.dayHeader]}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
              {timeSlots.map((slot, slotIndex) => (
                <View key={slotIndex} style={styles.subjectCell}>
                  <Text style={styles.subjectText}>
                    {timetableData[day][slot] || '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'left',
    color: '#666',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  timeHeaderCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  dayHeader: {
    backgroundColor: '#2E7D32',
    width: 100,
  },
  dayCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  subjectCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  subjectText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default TimeTableScreen;
