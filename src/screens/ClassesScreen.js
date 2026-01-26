import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { timetableData, timeSlots } from './TimeTableScreen';

const ClassesScreen = () => {
  // Get current day
  const getCurrentDay = () => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDayIndex = new Date().getDay();
    return days[currentDayIndex];
  };

  const currentDay = getCurrentDay();

  // Check if current day has timetable data
  const hasTimetableData = timetableData[currentDay] !== undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classes Screen</Text>
      <Text style={styles.dayTitle}>{currentDay} Timetable</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.tableContainer}>
          {timeSlots.map((slot, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.timeCell}>
                <Text style={styles.timeText}>{slot}</Text>
              </View>
              <View style={styles.subjectCell}>
                <Text style={styles.subjectText}>
                  {hasTimetableData
                    ? timetableData[currentDay][slot] || '-'
                    : 'No classes'}
                </Text>
              </View>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2E7D32',
  },
  scrollView: {
    flex: 1,
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
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  subjectCell: {
    flex: 2,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  timeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  subjectText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClassesScreen;
