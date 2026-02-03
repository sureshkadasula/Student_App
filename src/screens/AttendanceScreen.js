import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';
// import useAuth from '../hooks/useAuth'; // We will read directly from storage

const AttendanceScreen = () => {
  // const { token } = useAuth(); // Removed to avoid race condition/double triggers
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  useEffect(() => {
    fetchAttendance();
  }, []); // Run once on mount

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get token from storage (auth_session)
      const sessionStr = await AsyncStorage.getItem('auth_session');
      if (!sessionStr) {
        throw new Error('No session found, please login again.');
      }
      const session = JSON.parse(sessionStr);
      const token = session.token;
      if (!token) {
        throw new Error('Token missing from session.');
      }

      // 2. Get profile from storage to get student IDs
      const storedProfile = await AsyncStorage.getItem('student_profile');
      if (!storedProfile) {
        throw new Error('Student profile not found. Please pull to refresh on Profile screen.');
      }

      const profile = JSON.parse(storedProfile);
      const classId = profile.class_id;
      // Prefer student_id (UUID), fallback to id (Postgres ID/UUID depending on schema)
      const studentId = profile.id;

      if (!classId || !studentId) {
        throw new Error('Class or Student ID missing in profile.');
      }

      // 3. Fetch attendance
      const limit = 100;
      const url = `/classes/${classId}/students/${studentId}/attendance?limit=${limit}`;

      console.log('🚀 [AttendanceScreen] Fetching:', url);

      const response = await request(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📦 [AttendanceScreen] Response Status:', response.status);

      if (response.success) {
        // Map API response to UI model
        const mappedData = response.data.attendance_records.map(r => ({
          id: r.id,
          date: r.attendance_date,
          subject: r.subject || 'General',
          status: r.status,
          remarks: r.remarks,
          timeIn: r.marked_at ? new Date(r.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
          timeOut: null,
        }));

        setAttendanceData(mappedData);
      } else {
        throw new Error(response.error || 'Failed to fetch attendance');
      }

    } catch (err) {
      console.error('❌ [AttendanceScreen] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects for filter options
  const subjects = useMemo(() => {
    const uniqueSubjects = [
      'All',
      ...new Set(attendanceData.map(a => a.subject)),
    ];
    return uniqueSubjects;
  }, [attendanceData]);

  // Calculate attendance for different periods
  const getPeriodAttendance = period => {
    const today = new Date();
    let startDate;

    if (period === 'Weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(today.setDate(diff));
    } else if (period === 'Monthly') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (period === 'Yearly') {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    const periodRecords = attendanceData.filter(
      record => new Date(record.date) >= startDate,
    );

    const presentRecords = periodRecords.filter(a => a.status === 'Present').length;
    const absentRecords = periodRecords.filter(a => a.status === 'Absent').length;
    const lateRecords = periodRecords.filter(a => a.status === 'Late').length;
    const excusedRecords = periodRecords.filter(a => a.status === 'Excused').length;

    const totalPresent = presentRecords + lateRecords + excusedRecords;
    const totalRecords = periodRecords.length;

    return {
      present: totalPresent,
      absent: absentRecords,
      late: lateRecords,
      excused: excusedRecords,
      total: totalRecords,
      percentage: totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0,
    };
  };

  // Calculate overall attendance percentage
  const overallAttendance = useMemo(() => {
    const totalRecords = attendanceData.length;
    const presentRecords = attendanceData.filter(a => a.status === 'Present').length;
    const lateRecords = attendanceData.filter(a => a.status === 'Late').length;
    const excusedRecords = attendanceData.filter(a => a.status === 'Excused').length;
    const totalPresent = presentRecords + lateRecords + excusedRecords;
    return totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
  }, [attendanceData]);

  // Calculate subject-wise attendance percentage
  const getSubjectAttendance = subject => {
    const subjectRecords = attendanceData.filter(a => a.subject === subject);
    const presentRecords = subjectRecords.filter(a => a.status === 'Present').length;
    const lateRecords = subjectRecords.filter(a => a.status === 'Late').length;
    const excusedRecords = subjectRecords.filter(a => a.status === 'Excused').length;
    const totalPresent = presentRecords + lateRecords + excusedRecords;
    return subjectRecords.length > 0 ? Math.round((totalPresent / subjectRecords.length) * 100) : 0;
  };

  // Filter and search attendance
  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData;

    // Apply filters
    if (selectedSubject !== 'All') filtered = filtered.filter(record => record.subject === selectedSubject);
    if (selectedStatus !== 'All') filtered = filtered.filter(record => record.status === selectedStatus);

    if (selectedDateRange !== 'All Time') {
      const today = new Date();
      let startDate;
      if (selectedDateRange === 'This Month') startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      else if (selectedDateRange === 'Last Month') startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      filtered = filtered.filter(record => new Date(record.date) >= startDate);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        record.date.toLowerCase().includes(query) ||
        record.subject.toLowerCase().includes(query) ||
        record.status.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedSubject, selectedDateRange, selectedStatus, searchQuery, attendanceData]);

  // UI Helpers
  const getStatusColor = status => {
    switch (status) {
      case 'Present': return '#4CAF50';
      case 'Absent': return '#F44336';
      case 'Late': return '#FF9800';
      case 'Excused': return '#2196F3';
      default: return '#757575';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'Present': return 'check-circle';
      case 'Absent': return 'times-circle';
      case 'Late': return 'clock-o';
      case 'Excused': return 'info-circle';
      default: return 'question-circle';
    }
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleViewDetails = record => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const renderAttendanceCard = ({ item }) => (
    <TouchableOpacity style={styles.attendanceCard} onPress={() => handleViewDetails(item)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.attendanceDate}>{formatDate(item.date)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Icon name={getStatusIcon(item.status)} size={12} color="#fff" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="book" size={14} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{item.subject}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-o" size={14} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{item.timeIn} {item.timeOut ? `- ${item.timeOut}` : ''}</Text>
        </View>
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
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>{filter}</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.attendanceSummary}>
          <Text style={styles.attendancePercentage}>{overallAttendance}%</Text>
          <Text style={styles.attendanceLabel}>Overall Attendance</Text>
        </View>
      </View>

      {/* Period Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodFilterContainer} contentContainerStyle={styles.periodFilterContent}>
        {['Weekly', 'Monthly', 'Yearly'].map(period => (
          <TouchableOpacity key={period} style={[styles.periodFilterButton, selectedPeriod === period && styles.periodFilterButtonActive]} onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.periodFilterButtonText, selectedPeriod === period && styles.periodFilterButtonTextActive]}>{period}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Period Attendance Cards */}
      <View style={styles.periodCardsContainer}>
        <Text style={styles.periodCardsTitle}>Attendance Summary</Text>
        <View style={styles.periodCardsRow}>
          {['Weekly', 'Monthly', 'Yearly'].map(period => {
            if (period !== selectedPeriod) return null;
            const data = getPeriodAttendance(period);
            return (
              <View key={period} style={styles.periodCard}>
                <View style={styles.periodCardHeader}>
                  <Text style={styles.periodCardTitle}>{period}</Text>
                  <View style={styles.periodCardPercentageContainer}>
                    <Text style={styles.periodCardPercentage}>{data.percentage}%</Text>
                  </View>
                </View>
                <View style={styles.periodCardStats}>
                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
                      <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <Text style={styles.statValue}>{data.present}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View style={[styles.statDot, { backgroundColor: '#F44336' }]} />
                      <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <Text style={styles.statValue}>{data.absent}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statDotContainer}>
                      <View style={[styles.statDot, { backgroundColor: '#FF9800' }]} />
                      <Text style={styles.statLabel}>Late</Text>
                    </View>
                    <Text style={styles.statValue}>{data.late}</Text>
                  </View>
                </View>
                <View style={styles.periodCardFooter}>
                  <Text style={styles.periodCardTotal}>Total: {data.total} days</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchInput} placeholder="Search by date or subject..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#999" />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
        {['This Month', 'Last Month', 'All Time'].map(filter => renderFilterButton(filter, 'dateRange'))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
        {subjects.map(filter => renderFilterButton(filter, 'subject'))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
        {['All', 'Present', 'Absent', 'Late', 'Excused'].map(filter => renderFilterButton(filter, 'status'))}
      </ScrollView>

      {/* Subject-wise Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Subject-wise Attendance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.slice(1).map(subject => (
            <View key={subject} style={styles.subjectSummary}>
              <Text style={styles.subjectName}>{subject}</Text>
              <Text style={styles.subjectPercentage}>{getSubjectAttendance(subject)}%</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FlatList with ListHeaderComponent for scrolling */}
      <FlatList
        data={filteredAttendance}
        renderItem={renderAttendanceCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF751F" />
            ) : (
              <>
                <Icon name="calendar" size={60} color="#ccc" />
                <Text style={styles.emptyText}>{error ? error : 'No attendance records found'}</Text>
                {error && (
                  <TouchableOpacity style={styles.retryButton} onPress={fetchAttendance}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        }
      />

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
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Time In:</Text>
                          <Text style={styles.detailValue}>
                            {selectedRecord.timeIn}
                          </Text>
                        </View>
                      )}
                      {selectedRecord.timeOut && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Time Out:</Text>
                          <Text style={styles.detailValue}>
                            {selectedRecord.timeOut}
                          </Text>
                        </View>
                      )}
                    </View>

                    {selectedRecord.remarks && (
                      <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Remarks</Text>
                        <Text style={styles.remarksText}>
                          {selectedRecord.remarks}
                        </Text>
                      </View>
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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  attendanceSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  attendancePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF751F',
    marginRight: 10,
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  periodFilterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  periodFilterContent: {
    paddingHorizontal: 15,
  },
  periodFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  periodFilterButtonActive: {
    backgroundColor: '#FF751F',
  },
  periodFilterButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  periodFilterButtonTextActive: {
    color: '#fff',
  },
  periodCardsContainer: {
    padding: 20,
  },
  periodCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  periodCardsRow: {
  },
  periodCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  periodCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  periodCardPercentageContainer: {
    backgroundColor: '#FFF0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  periodCardPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF751F',
  },
  periodCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  periodCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  periodCardTotal: {
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subjectSummary: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  subjectPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  attendanceDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#FF751F',
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#FF751F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  remarksText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
  },
});

export default AttendanceScreen;
