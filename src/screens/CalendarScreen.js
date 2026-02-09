import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { HolidayService } from '../services/HolidayService';

const CalendarScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM格式

  // Helper to map holiday types to colors
  const getHolidayColor = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'national': return '#FF6B6B'; // Red
      case 'religious': return '#4ECDC4'; // Teal
      case 'school': return '#45B7D1'; // Blue
      case 'regional': return '#96CEB4'; // Green
      default: return '#FF9F43'; // Orange
    }
  };

  const fetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      const data = await HolidayService.getHolidays(); // Fetch all holidays
      setHolidays(data);

      // Process holidays for calendar marking
      const marks = {};
      data.forEach(holiday => {
        // Ensure date is in YYYY-MM-DD format strings from API might vary
        const date = new Date(holiday.date);
        const dateStr = !isNaN(date) ? date.toISOString().split('T')[0] : holiday.date;
        const color = getHolidayColor(holiday.type);

        marks[dateStr] = {
          customStyles: {
            container: {
              backgroundColor: color + '30', // Light opacity for background
              borderWidth: 1,
              borderColor: color,
              borderRadius: 8,
            },
            text: {
              color: '#333',
              fontWeight: '600'
            }
          }
        };
      });
      setMarkedDates(marks);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const getCombinedMarks = () => {
    const marks = { ...markedDates };
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        customStyles: {
          container: {
            backgroundColor: '#FF751F',
            borderRadius: 8,
            elevation: 2
          },
          text: {
            color: 'white',
            fontWeight: 'bold'
          }
        }
      };
    }
    return marks;
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const dateStr = day.dateString;

    // Find holidays on this date
    const holidaysOnDate = holidays.filter(h => {
      const hDate = new Date(h.date);
      const hDateStr = !isNaN(hDate) ? hDate.toISOString().split('T')[0] : h.date;
      return hDateStr === dateStr;
    });

    setSelectedHolidays(holidaysOnDate);
  };

  const onMonthChange = (month) => {
    setCurrentMonth(month.dateString.substring(0, 7));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchHolidays();
  }, [fetchHolidays]);

  // Calculate holidays in current month
  const holidaysInCurrentMonth = holidays.filter(h => {
    const hDate = new Date(h.date);
    const hDateStr = !isNaN(hDate) ? hDate.toISOString().split('T')[0] : h.date;
    return hDateStr.startsWith(currentMonth);
  }).length;

  const renderHolidayItem = ({ item }) => (
    <View style={[styles.holidayCard, { borderLeftColor: getHolidayColor(item.type) }]}>
      <Text style={styles.holidayName}>{item.name}</Text>
      <View style={styles.holidayTypeContainer}>
        <Text style={[styles.holidayType, { color: getHolidayColor(item.type) }]}>
          {(item.type || 'General').toUpperCase()} HOLIDAY
        </Text>
      </View>
      {item.reason ? <Text style={styles.holidayReason}>{item.reason}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          markingType={'custom'}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          markedDates={getCombinedMarks()}
          theme={{
            todayTextColor: '#FF751F',
            arrowColor: '#FF751F',
            monthTextColor: '#333',
            textMonthFontWeight: 'bold',
            dotColor: '#FF751F',
          }}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>
          {selectedDate ? `Holidays on ${selectedDate}` : 'Select a date to view details'}
        </Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#FF751F" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={selectedHolidays}
            renderItem={renderHolidayItem}
            keyExtractor={(item, index) => (item.id || index).toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              selectedDate && (
                <Text style={styles.emptyText}>No holidays on this date.</Text>
              )
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF751F']} />
            }
          />
        )}
      </View>

      <View style={styles.footerSummary}>
        <Text style={styles.footerCount}>{holidaysInCurrentMonth}</Text>
        <View>
          <Text style={styles.footerText}>Holidays in {new Date(currentMonth + '-01').toLocaleString('default', { month: 'long' })}</Text>
          <Text style={styles.footerSubtext}>Marked by Management</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  calendarContainer: {
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  holidayCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  holidayTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  holidayType: {
    fontSize: 12,
    fontWeight: '600',
  },
  holidayReason: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  footerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  footerCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF751F',
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default CalendarScreen;
