import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  ImageBackground,
  Linking,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { request } from '../services/api'; // Assuming this helper exists
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const HostelScreen = () => {
  const [hostelData, setHostelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHostelDetails();
  }, []);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionStr = await AsyncStorage.getItem('auth_session');
      if (!sessionStr) {
        throw new Error('No session found');
      }
      const session = JSON.parse(sessionStr);
      const { user, token } = session;

      if (!user || (!user.userid && !user.id)) {
        throw new Error('User ID not found');
      }

      // Use user.userid if available, otherwise fallback to check
      const queryId = user.userid || user.id;

      // Based on router analysis: GET /student-hostel/:userid
      const response = await request(`/student-hostel/${queryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.success && response.data) {
        setHostelData(response.data);
      } else {
        // If 404 or just no data
        setHostelData(null);
        if (response.error) setError(response.error);
      }
    } catch (err) {
      console.error('Error fetching hostel details:', err);
      setError(err.message || 'Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading Hostel Details...</Text>
      </View>
    );
  }

  // If no data found or error
  if (!hostelData || error) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hostel</Text>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="bunk-bed-outline" size={64} color="#FF751F" />
          </View>
          <Text style={styles.emptyTitle}>No Hostel Allocated</Text>
          <Text style={styles.emptySubtitle}>
            {error ? error : "You haven't been allocated a hostel room yet."}
          </Text>
          <Text style={styles.emptySubtitle}>
            Please contact the admin for allocation.
          </Text>
        </View>
      </View>
    );
  }

  const {
    block_name,
    room_number,
    floor_number,
    hostel_name,
    warden_name,
    warden_contact,
    mess_facility,
    allocation_status
  } = hostelData;

  const handleCallWarden = () => {
    if (warden_contact) {
      Linking.openURL(`tel:${warden_contact}`);
    }
  };

  const amenities = [
    { icon: 'bed', label: 'Bed' },
    { icon: 'desk', label: 'Study Table' },
    { icon: 'cupboard', label: 'Cupboard' },
    { icon: 'fan', label: 'Ceiling Fan' },
  ];

  if (mess_facility) {
    amenities.push({ icon: 'silverware-fork-knife', label: 'Mess Facility' });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Hostel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hostel Allocation Card */}
        <View style={styles.mainCard}>
          <ImageBackground
            source={{ uri: 'https://img.freepik.com/free-vector/flat-university-concept-background_23-2148192661.jpg' }} // Placeholder generic dorm pattern
            style={styles.cardBg}
            imageStyle={{ borderRadius: 20, opacity: 0.1 }}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.hostelName}>{hostel_name || 'School Hostel'}</Text>
                <Text style={styles.blockName}>{block_name || 'Block A'}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: allocation_status === 'active' ? '#dcfce7' : '#f1f5f9' }]}>
                <Text style={[styles.statusText, { color: allocation_status === 'active' ? '#166534' : '#64748b' }]}>
                  {allocation_status ? allocation_status.toUpperCase() : 'ACTIVE'}
                </Text>
              </View>
            </View>

            <View style={styles.roomContainer}>
              <View style={styles.roomHighlight}>
                <Text style={styles.roomLabel}>ROOM</Text>
                <Text style={styles.roomValue}>{room_number}</Text>
              </View>
              <View style={styles.dividerVertical} />
              <View style={styles.floorHighlight}>
                <Text style={styles.roomLabel}>FLOOR</Text>
                <Text style={styles.roomValue}>{floor_number}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>


        {/* Warden Section */}
        <Text style={styles.sectionTitle}>Warden Info</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Icon name="account-tie" size={24} color="#FF751F" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Warden Name</Text>
              <Text style={styles.infoValue}>{warden_name || 'Not Assigned'}</Text>
            </View>
          </View>

          {warden_contact && (
            <View style={[styles.infoRow, { marginTop: 16 }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Icon name="phone" size={24} color="#0284c7" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>{warden_contact}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={handleCallWarden}>
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Accessiblity / Facilities */}
        <Text style={styles.sectionTitle}>Room Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {amenities.map((item, index) => (
            <View key={index} style={styles.amenityCard}>
              <Icon name={item.icon} size={28} color="#64748b" />
              <Text style={styles.amenityLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Rules or Notices Placeholder */}
        <View style={styles.noticeContainer}>
          <Icon name="information-outline" size={20} color="#64748b" />
          <Text style={styles.noticeText}>
            For any maintenance issues or complaints, please visit the warden's office during working hours.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Main Card Styles
  mainCard: {
    backgroundColor: '#FF751F',
    borderRadius: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#FF751F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden', // for ImageBackground
  },
  cardBg: {
    padding: 24,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  hostelName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  blockName: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FF751F',
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)', // Works on some versions, ignored on others
  },
  roomHighlight: {
    alignItems: 'center',
    flex: 1,
  },
  floorHighlight: {
    alignItems: 'center',
    flex: 1,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  roomLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  roomValue: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },

  // Section Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#64748b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff7ed', // Light orange
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  callButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0284c7',
    borderRadius: 20,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  amenityCard: {
    width: (width - 40 - 12) / 2, // 2 column grid
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 1,
    shadowColor: '#64748b',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  amenityLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  // Notice
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: -40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff7ed',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HostelScreen;
