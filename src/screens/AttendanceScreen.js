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
  StatusBar,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../services/api';

const { width } = Dimensions.get('window');

const AttendanceScreen = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly'); // Default to Monthly

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionStr = await AsyncStorage.getItem('auth_session');
      if (!sessionStr) throw new Error('No session found.');
      const session = JSON.parse(sessionStr);
      const token = session.token;

      const storedProfile = await AsyncStorage.getItem('student_profile');
      if (!storedProfile) throw new Error('Student profile not found.');
      const profile = JSON.parse(storedProfile);
      const classId = profile.class_id;
      const studentId = profile.id;

      if (!classId || !studentId) throw new Error('ID missing in profile.');

      const url = `/classes/${classId}/students/${studentId}/attendance?limit=100`;
      const response = await request(url, { headers: { 'Authorization': `Bearer ${token}` } });

      if (response.success) {
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
      console.log('❌ [AttendanceScreen] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subjects = useMemo(() => ['All', ...new Set(attendanceData.map(a => a.subject))], [attendanceData]);

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

    const periodRecords = attendanceData.filter(record => new Date(record.date) >= startDate);
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

  const getSubjectAttendance = subject => {
    const subjectRecords = attendanceData.filter(a => a.subject === subject);
    const totalPresent = subjectRecords.filter(a => ['Present', 'Late', 'Excused'].includes(a.status)).length;
    return subjectRecords.length > 0 ? Math.round((totalPresent / subjectRecords.length) * 100) : 0;
  };

  const filteredAttendance = useMemo(() => {
    let filtered = attendanceData;

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
      (type === 'dateRange' && selectedDateRange === filter) ||
      (type === 'status' && selectedStatus === filter);
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterChip, isActive && styles.filterChipActive]}
        onPress={() => {
          if (type === 'subject') setSelectedSubject(filter);
          else if (type === 'dateRange') setSelectedDateRange(filter);
          else if (type === 'status') setSelectedStatus(filter);
        }}
      >
        <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
      </TouchableOpacity>
    );
  };

  // Header Component
  const ListHeader = () => {
    const periodData = getPeriodAttendance(selectedPeriod);

    return (
      <View style={styles.listHeaderContainer}>
        {/* Modern Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>Overview</Text>
              <Text style={styles.summarySubtitle}>Your attendance stats</Text>
            </View>
            {/* Period Selector inside Card */}
            <View style={styles.periodSelector}>
              {['Weekly', 'Monthly'].map(period => (
                <TouchableOpacity
                  key={period}
                  style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[styles.periodBtnText, selectedPeriod === period && styles.periodBtnTextActive]}>
                    {period === 'Weekly' ? 'Week' : 'Month'}
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
            </View>
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
    color: '#0f172a',
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
});

export default AttendanceScreen;
