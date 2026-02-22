import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { request } from '../services/api';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// --- Local Icons (replacing MaterialCommunityIcons) ---
const Icon = ({ name, size = 24, color = '#000', style }) => {
  let content;
  switch (name) {
    case 'check-circle':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Path d="M22 4L12 14.01l-3-3" />
        </Svg>
      );
      break;
    case 'close-circle':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="15" y1="9" x2="9" y2="15" />
          <Line x1="9" y1="9" x2="15" y2="15" />
        </Svg>
      );
      break;
    case 'clock-alert':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 6v6l4 2" />
        </Svg>
      );
      break;
    case 'information':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="16" x2="12" y2="12" />
          <Line x1="12" y1="8" x2="12.01" y2="8" />
        </Svg>
      );
      break;
    case 'help-circle':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10"></Circle>
          <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></Path>
          <Line x1="12" y1="17" x2="12.01" y2="17"></Line>
        </Svg>
      );
      break;
    case 'chevron-right':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      );
      break;
    case 'magnify':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="11" cy="11" r="8"></Circle>
          <Line x1="21" y1="21" x2="16.65" y2="16.65"></Line>
        </Svg>
      );
      break;
    case 'calendar-blank-outline':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
        </Svg>
      );
      break;
    case 'close':
      content = (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Line x1="18" y1="6" x2="6" y2="18" />
          <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
      );
      break;
    default:
      content = null;
  }
  return <View style={style}>{content}</View>;
};

const AttendanceScreen = () => {
  const [profile, setProfile] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [backendSummary, setBackendSummary] = useState(null);
  const [customDateModalVisible, setCustomDateModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [customDates, setCustomDates] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const onDateChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setCustomDates(prev => ({ ...prev, startDate: selectedDate.toISOString().split('T')[0] }));
      }
    } else {
      setShowEndDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setCustomDates(prev => ({ ...prev, endDate: selectedDate.toISOString().split('T')[0] }));
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [selectedPeriod])
  );

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await AuthService.getSession();
      if (!session || !session.token) throw new Error('No session found. Please login again.');

      const storedProfile = await AsyncStorage.getItem('student_profile');
      if (!storedProfile) throw new Error('Student profile not found.');
      const studentProfile = JSON.parse(storedProfile);
      setProfile(studentProfile);

      const classId = studentProfile.class_id;
      const studentId = studentProfile.id;

      if (!classId || !studentId) {
        console.log("Missing profile info:", studentProfile);
        throw new Error('Student class info missing.');
      }

      // Calculate date range based on selectedPeriod
      const today = new Date();
      let startDate, endDate;
      endDate = today.toISOString().split('T')[0];

      if (selectedPeriod === 'Weekly') {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(today.setDate(diff)).toISOString().split('T')[0];
      } else if (selectedPeriod === 'Monthly') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      } else if (selectedPeriod === 'Custom') {
        startDate = customDates.startDate;
        endDate = customDates.endDate;
      }

      const url = `/classes/${classId}/students/${studentId}/attendance-summary?startDate=${startDate}&endDate=${endDate}`;
      console.log('🔗 [AttendanceScreen] Fetching from summary endpoint:', url);

      const response = await request(url, { headers: { 'Authorization': `Bearer ${session.token}` } });

      if (response.success && response.data) {
        const { summary, attendance_records } = response.data;

        setBackendSummary(summary);

        const mappedData = (attendance_records || []).map(r => ({
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
      console.log('❌ [AttendanceScreen] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subjects = useMemo(() => ['All', ...new Set(attendanceData.map(a => a.subject))], [attendanceData]);

  const getPeriodAttendance = useCallback(() => {
    if (backendSummary) {
      return {
        present: backendSummary.present,
        absent: backendSummary.absent,
        late: backendSummary.late,
        excused: 0,
        total: backendSummary.total_days,
        percentage: Math.round(backendSummary.attendance_percentage || 0),
        workingDays: backendSummary.working_days,
        holidays: backendSummary.holidays
      };
    }

    return {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
      percentage: 0,
      workingDays: 0,
      holidays: 0
    };
  }, [backendSummary]);

  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData;

    if (selectedSubject !== 'All') filtered = filtered.filter(record => record.subject === selectedSubject);
    if (selectedStatus !== 'All') filtered = filtered.filter(record => record.status === selectedStatus);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        record.date.toLowerCase().includes(query) ||
        record.subject.toLowerCase().includes(query) ||
        record.status.toLowerCase().includes(query),
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedSubject, selectedStatus, searchQuery, attendanceData]);

  const getStatusInfo = status => {
    switch (status) {
      case 'Present': return { color: '#10b981', icon: 'check-circle' };
      case 'Absent': return { color: '#ef4444', icon: 'close-circle' };
      case 'Late': return { color: '#f59e0b', icon: 'clock-alert' };
      case 'Excused': return { color: '#3b82f6', icon: 'information' };
      default: return { color: '#9ca3af', icon: 'help-circle' };
    }
  };

  const formatDate = dateStr => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const renderAttendanceCard = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    return (
      <TouchableOpacity style={styles.recordCard} onPress={() => { setSelectedRecord(item); setModalVisible(true); }}>
        <View style={[styles.statusIndicator, { backgroundColor: statusInfo.color }]} />
        <View style={styles.recordContent}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordSubject}>{item.subject}</Text>
            <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.recordDetails}>
            <View style={[styles.statusChip, { backgroundColor: statusInfo.color + '15' }]}>
              <Icon name={statusInfo.icon} size={14} color={statusInfo.color} style={{ marginRight: 4 }} />
              <Text style={[styles.statusChipText, { color: statusInfo.color }]}>{item.status}</Text>
            </View>
            <Text style={styles.recordTime}>{item.timeIn}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#cbd5e1" />
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filter, type) => {
    const isActive = (type === 'subject' && selectedSubject === filter) ||
      (type === 'status' && selectedStatus === filter);
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => {
          if (type === 'subject') setSelectedSubject(filter);
          else if (type === 'status') setSelectedStatus(filter);
        }}
      >
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
      </TouchableOpacity>
    );
  };

  // Header Component
  const ListHeader = () => {
    const periodData = getPeriodAttendance();

    return (
      <View style={styles.listHeaderContainer}>
        {/* Header - Showing Profile Info */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance</Text>
          {profile && <Text style={styles.headerSubtitle}>{profile.first_name} {profile.last_name} • Class {profile.class_name || profile.class_id}</Text>}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>Overview</Text>
              <Text style={styles.summarySubtitle}>Attendance stats</Text>
            </View>
            {/* Period Selector inside Card */}
            <View style={styles.periodSelector}>
              {['Weekly', 'Monthly', 'Custom'].map(period => (
                <TouchableOpacity
                  key={period}
                  style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
                  onPress={() => {
                    if (period === 'Custom') {
                      setCustomDateModalVisible(true);
                    } else {
                      setSelectedPeriod(period);
                    }
                  }}
                >
                  <Text style={[styles.periodBtnText, selectedPeriod === period && styles.periodBtnTextActive]}>
                    {period === 'Weekly' ? 'Week' : period === 'Monthly' ? 'Month' : 'Custom'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.percentageCircle}>
              <Text style={styles.pCircleText}>{periodData.percentage}%</Text>
              <Text style={styles.pCircleLabel}>Present</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{periodData.present}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>{periodData.absent}</Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>{periodData.late}</Text>
                <Text style={styles.statLabel}>Late</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{periodData.holidays}</Text>
                <Text style={styles.statLabel}>Holidays</Text>
              </View>
            </View>
          </View>

          <View style={styles.workingDaysContainer}>
            <Text style={styles.workingDaysText}>
              Working Days: <Text style={styles.workingDaysValue}>{periodData.workingDays}</Text>
            </Text>
            <Text style={styles.workingDaysText}>
              Total Days: <Text style={styles.workingDaysValue}>{periodData.total}</Text>
            </Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.sectionTitleCont}>
          <Text style={styles.sectionTitle}>Logs</Text>
        </View>

        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#94a3b8" style={{ marginLeft: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
          {subjects.map(s => renderFilterButton(s, 'subject'))}
        </ScrollView>
      </View>
    );
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF751F" />
      <Text style={styles.loadingText}>Loading Log...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

      <FlatList
        data={filteredAttendance}
        renderItem={renderAttendanceCard}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No records found</Text>
          </View>
        }
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Attendance Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {selectedRecord && (
              <View style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedRecord.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Subject</Text>
                  <Text style={styles.detailValue}>{selectedRecord.subject}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, { color: getStatusInfo(selectedRecord.status).color, fontWeight: '700' }]}>{selectedRecord.status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time In</Text>
                  <Text style={styles.detailValue}>{selectedRecord.timeIn}</Text>
                </View>
                {selectedRecord.remarks && (
                  <View style={styles.remarksContainer}>
                    <Text style={styles.detailLabel}>Remarks</Text>
                    <Text style={styles.remarksText}>{selectedRecord.remarks}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Custom Date Range Modal */}
      <Modal animationType="fade" transparent={true} visible={customDateModalVisible} onRequestClose={() => setCustomDateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Custom Range</Text>
              <TouchableOpacity onPress={() => setCustomDateModalVisible(false)} style={styles.closeBtn}>
                <Icon name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputsRow}>
              <View style={styles.dateInputGroup}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateInputText}>{customDates.startDate}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateInputGroup}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateInputText}>{customDates.endDate}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartDatePicker && (
              <DateTimePicker
                value={new Date(customDates.startDate)}
                mode="date"
                display="default"
                onChange={(e, d) => onDateChange(e, d, 'start')}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={new Date(customDates.endDate)}
                mode="date"
                display="default"
                onChange={(e, d) => onDateChange(e, d, 'end')}
              />
            )}

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                setSelectedPeriod('Custom');
                setCustomDateModalVisible(false);
                fetchAttendance();
              }}
            >
              <Text style={styles.applyBtnText}>Apply Custom Range</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748b' },
  flatListContent: { paddingBottom: 20 },

  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff751f',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4
  },

  listHeaderContainer: { marginBottom: 10 },

  summaryCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  summarySubtitle: { fontSize: 13, color: '#64748b' },

  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  periodBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  periodBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  periodBtnText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  periodBtnTextActive: { color: '#0f172a' },

  chartContainer: { flexDirection: 'row', alignItems: 'center' },
  percentageCircle: {
    width: 90, height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#FF751F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  pCircleText: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  pCircleLabel: { fontSize: 11, color: '#64748b', marginTop: -2 },

  statsGrid: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#94a3b8' },

  workingDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  workingDaysText: {
    fontSize: 13,
    color: '#64748b',
  },
  workingDaysValue: {
    fontWeight: '700',
    color: '#1e293b',
  },

  sectionTitleCont: { paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#0f172a' },

  filtersScroll: { marginBottom: 16 },
  filtersContent: { paddingHorizontal: 20 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#FF751F', borderColor: '#FF751F' },
  filterChipText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  recordCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statusIndicator: { width: 4, height: 32, borderRadius: 2, marginRight: 16 },
  recordContent: { flex: 1 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  recordSubject: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  recordDate: { fontSize: 12, color: '#94a3b8' },
  recordDetails: { flexDirection: 'row', alignItems: 'center' },
  statusChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 10 },
  statusChipText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  recordTime: { fontSize: 12, color: '#64748b' },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 16, color: '#94a3b8' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  closeBtn: { padding: 4, backgroundColor: '#f1f5f9', borderRadius: 20 },
  modalBody: { gap: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12 },
  detailLabel: { color: '#64748b', fontSize: 14 },
  detailValue: { color: '#0f172a', fontSize: 14, fontWeight: '500' },
  remarksContainer: { marginTop: 8 },
  remarksText: { marginTop: 8, color: '#334155', backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 14, fontStyle: 'italic' },

  // Custom Date Picker Styles
  datePickerModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  dateInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '600',
  },
  dateInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateInputText: {
    color: '#0f172a',
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: '#FF751F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AttendanceScreen;
