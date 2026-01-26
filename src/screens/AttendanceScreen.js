import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample attendance data
const attendanceData = [
  {
    id: '1',
    date: '2024-01-24',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '2',
    date: '2024-01-24',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '3',
    date: '2024-01-24',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '4',
    date: '2024-01-23',
    subject: 'Mathematics',
    status: 'Absent',
    timeIn: null,
    timeOut: null,
    remarks: 'Sick leave',
  },
  {
    id: '5',
    date: '2024-01-23',
    subject: 'Science',
    status: 'Present',
    timeIn: '09:00 AM',
    timeOut: '02:30 PM',
    remarks: 'Late by 15 minutes',
  },
  {
    id: '6',
    date: '2024-01-23',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '7',
    date: '2024-01-22',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:40 AM',
    timeOut: '02:30 PM',
    remarks: 'Early',
  },
  {
    id: '8',
    date: '2024-01-22',
    subject: 'Science',
    status: 'Late',
    timeIn: '09:15 AM',
    timeOut: '02:30 PM',
    remarks: 'Traffic delay',
  },
  {
    id: '9',
    date: '2024-01-22',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '10',
    date: '2024-01-21',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '11',
    date: '2024-01-21',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '12',
    date: '2024-01-21',
    subject: 'English',
    status: 'Excused',
    timeIn: null,
    timeOut: null,
    remarks: 'Medical appointment',
  },
  {
    id: '13',
    date: '2024-01-20',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '14',
    date: '2024-01-20',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '15',
    date: '2024-01-20',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '16',
    date: '2024-01-19',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '17',
    date: '2024-01-19',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '18',
    date: '2024-01-19',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '19',
    date: '2024-01-18',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '20',
    date: '2024-01-18',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '21',
    date: '2024-01-18',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '22',
    date: '2024-01-17',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '23',
    date: '2024-01-17',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '24',
    date: '2024-01-17',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '25',
    date: '2024-01-16',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '26',
    date: '2024-01-16',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '27',
    date: '2024-01-16',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '28',
    date: '2024-01-15',
    subject: 'Mathematics',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '29',
    date: '2024-01-15',
    subject: 'Science',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
  {
    id: '30',
    date: '2024-01-15',
    subject: 'English',
    status: 'Present',
    timeIn: '08:45 AM',
    timeOut: '02:30 PM',
    remarks: 'On time',
  },
];

const AttendanceScreen = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  // Get unique subjects for filter options
  const subjects = useMemo(() => {
    const uniqueSubjects = [
      'All',
      ...new Set(attendanceData.map(a => a.subject)),
    ];
    return uniqueSubjects;
  }, []);

  // Calculate attendance for different periods
  const getPeriodAttendance = period => {
    const today = new Date();
    let startDate;

    if (period === 'Weekly') {
      // Get start of current week (Monday)
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff));
    } else if (period === 'Monthly') {
      // Get start of current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (period === 'Yearly') {
      // Get start of current year
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    const periodRecords = attendanceData.filter(
      record => new Date(record.date) >= startDate,
    );

    const presentRecords = periodRecords.filter(
      a => a.status === 'Present',
    ).length;
    const absentRecords = periodRecords.filter(
      a => a.status === 'Absent',
    ).length;
    const lateRecords = periodRecords.filter(a => a.status === 'Late').length;
    const excusedRecords = periodRecords.filter(
      a => a.status === 'Excused',
    ).length;

    const totalPresent = presentRecords + lateRecords + excusedRecords;
    const totalRecords = periodRecords.length;

    return {
      present: totalPresent,
      absent: absentRecords,
      late: lateRecords,
      excused: excusedRecords,
      total: totalRecords,
      percentage:
        totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0,
    };
  };

  // Calculate overall attendance percentage
  const overallAttendance = useMemo(() => {
    const totalRecords = attendanceData.length;
    const presentRecords = attendanceData.filter(
      a => a.status === 'Present',
    ).length;
    const lateRecords = attendanceData.filter(a => a.status === 'Late').length;
    const excusedRecords = attendanceData.filter(
      a => a.status === 'Excused',
    ).length;
    const totalPresent = presentRecords + lateRecords + excusedRecords;
    return totalRecords > 0
      ? Math.round((totalPresent / totalRecords) * 100)
      : 0;
  }, []);

  // Calculate subject-wise attendance percentage
  const getSubjectAttendance = subject => {
    const subjectRecords = attendanceData.filter(a => a.subject === subject);
    const presentRecords = subjectRecords.filter(
      a => a.status === 'Present',
    ).length;
    const lateRecords = subjectRecords.filter(a => a.status === 'Late').length;
    const excusedRecords = subjectRecords.filter(
      a => a.status === 'Excused',
    ).length;
    const totalPresent = presentRecords + lateRecords + excusedRecords;
    return subjectRecords.length > 0
      ? Math.round((totalPresent / subjectRecords.length) * 100)
      : 0;
  };

  // Filter and search attendance
  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData;

    // Apply subject filter
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(record => record.subject === selectedSubject);
    }

    // Apply status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    // Apply date range filter
    if (selectedDateRange !== 'All Time') {
      const today = new Date();
      let startDate;

      if (selectedDateRange === 'This Month') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (selectedDateRange === 'Last Month') {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      }

      filtered = filtered.filter(record => new Date(record.date) >= startDate);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        record =>
          record.date.toLowerCase().includes(query) ||
          record.subject.toLowerCase().includes(query) ||
          record.status.toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedSubject, selectedDateRange, selectedStatus, searchQuery]);

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'Present':
        return '#4CAF50'; // Green
      case 'Absent':
        return '#F44336'; // Red
      case 'Late':
        return '#FF9800'; // Orange
      case 'Excused':
        return '#2196F3'; // Blue
      default:
        return '#757575'; // Gray
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'Present':
        return 'check-circle';
      case 'Absent':
        return 'times-circle';
      case 'Late':
        return 'clock-o';
      case 'Excused':
        return 'info-circle';
      default:
        return 'question-circle';
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

  // Handle view record details
  const handleViewDetails = record => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  // Render attendance card
  const renderAttendanceCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.attendanceCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.attendanceDate}>{formatDate(item.date)}</Text>
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

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="book" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.subject}</Text>
          </View>

          {item.timeIn && (
            <View style={styles.infoRow}>
              <Icon name="clock-o" size={14} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>
                {item.timeIn} - {item.timeOut}
              </Text>
            </View>
          )}

          {item.remarks && (
            <View style={styles.infoRow}>
              <Icon name="comment" size={14} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>{item.remarks}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="eye" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter button
  const renderFilterButton = (filter, type) => {
    const isActive =
      (type === 'subject' && selectedSubject === filter) ||
      (type === 'dateRange' && selectedDateRange === filter) ||
      (type === 'status' && selectedStatus === filter);

    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => {
          if (type === 'subject') setSelectedSubject(filter);
          else if (type === 'dateRange') setSelectedDateRange(filter);
          else if (type === 'status') setSelectedStatus(filter);
        }}
      >
        <Text
          style={[
            styles.filterButtonText,
            isActive && styles.filterButtonTextActive,
          ]}
        >
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.attendanceSummary}>
          <Text style={styles.attendancePercentage}>{overallAttendance}%</Text>
          <Text style={styles.attendanceLabel}>Overall Attendance</Text>
        </View>
      </View>

      {/* Period Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodFilterContainer}
        contentContainerStyle={styles.periodFilterContent}
      >
        {['Weekly', 'Monthly', 'Yearly'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodFilterButton,
              selectedPeriod === period && styles.periodFilterButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodFilterButtonText,
                selectedPeriod === period &&
                  styles.periodFilterButtonTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Period Attendance Cards */}
      <View style={styles.periodCardsContainer}>
        <Text style={styles.periodCardsTitle}>Attendance Summary</Text>
        <View style={styles.periodCardsRow}>
          {['Weekly', 'Monthly', 'Yearly'].map(period => {
            const data = getPeriodAttendance(period);
            return (
              <View key={period} style={styles.periodCard}>
                <View style={styles.periodCardHeader}>
                  <Text style={styles.periodCardTitle}>{period}</Text>
                  <View style={styles.periodCardPercentageContainer}>
                    <Text style={styles.periodCardPercentage}>
                      {data.percentage}%
                    </Text>
                  </View>
                </View>

                <View style={styles.periodCardStats}>
                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View
                        style={[styles.statDot, { backgroundColor: '#4CAF50' }]}
                      />
                      <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <Text style={styles.statValue}>{data.present}</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View
                        style={[styles.statDot, { backgroundColor: '#F44336' }]}
                      />
                      <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <Text style={styles.statValue}>{data.absent}</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View
                        style={[styles.statDot, { backgroundColor: '#FF9800' }]}
                      />
                      <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <Text style={styles.statValue}>{data.late}</Text>
                  </View>
                </View>

                <View style={styles.periodCardFooter}>
                  <Text style={styles.periodCardTotal}>
                    Total: {data.total} days
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <Text
          style={styles.searchInput}
          placeholder="Search by date or subject..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Date Range Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {['This Month', 'Last Month', 'All Time'].map(filter =>
          renderFilterButton(filter, 'dateRange'),
        )}
      </ScrollView>

      {/* Subject Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {subjects.map(filter => renderFilterButton(filter, 'subject'))}
      </ScrollView>

      {/* Status Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {['All', 'Present', 'Absent', 'Late', 'Excused'].map(filter =>
          renderFilterButton(filter, 'status'),
        )}
      </ScrollView>

      {/* Subject-wise Attendance Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Subject-wise Attendance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.slice(1).map(subject => (
            <View key={subject} style={styles.subjectSummary}>
              <Text style={styles.subjectName}>{subject}</Text>
              <Text style={styles.subjectPercentage}>
                {getSubjectAttendance(subject)}%
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Attendance List */}
      <FlatList
        data={filteredAttendance}
        renderItem={renderAttendanceCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No attendance records found</Text>
            <Text style={styles.emptySubtext}>
              {selectedSubject === 'All' &&
              selectedDateRange === 'All Time' &&
              selectedStatus === 'All' &&
              !searchQuery
                ? 'Attendance records will appear here'
                : 'Try adjusting your filters'}
            </Text>
          </View>
        }
      />

      {/* Attendance Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedRecord && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedRecord.subject} - {selectedRecord.status}
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
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(selectedRecord.date)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Subject:</Text>
                        <Text style={styles.detailValue}>
                          {selectedRecord.subject}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedRecord.status,
                              ),
                            },
                          ]}
                        >
                          <Icon
                            name={getStatusIcon(selectedRecord.status)}
                            size={12}
                            color="#fff"
                          />
                          <Text style={styles.statusText}>
                            {selectedRecord.status}
                          </Text>
                        </View>
                      </View>
                      {selectedRecord.timeIn && (
                        <>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Time In:</Text>
                            <Text style={styles.detailValue}>
                              {selectedRecord.timeIn}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Time Out:</Text>
                            <Text style={styles.detailValue}>
                              {selectedRecord.timeOut}
                            </Text>
                          </View>
                        </>
                      )}
                      {selectedRecord.remarks && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Remarks:</Text>
                          <Text style={styles.detailValue}>
                            {selectedRecord.remarks}
                          </Text>
                        </View>
                      )}
                    </View>
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
    backgroundColor: '#2196F3',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  attendanceSummary: {
    alignItems: 'center',
    marginTop: 10,
  },
  attendancePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  attendanceLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    maxWidth: 150,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    flexShrink: 0,
    flexWrap: 'wrap',
    numberOfLines: 2,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subjectSummary: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  subjectPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  attendanceCard: {
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
    marginBottom: 12,
  },
  attendanceDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  periodCardsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  periodCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  periodCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  periodCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  periodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  periodCardPercentageContainer: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  periodCardPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodCardStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  periodCardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  periodCardTotal: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AttendanceScreen;
