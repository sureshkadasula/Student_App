import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';

const HostelScreen = () => {
  const [hostelData, setHostelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchHostelDetails();
  }, []);

  const fetchHostelDetails = async () => {
    try {
      const sessionStr = await AsyncStorage.getItem('auth_session');
      if (!sessionStr) {
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionStr);
      const { user, token } = session;

      if (!user || !user.userid) {
        console.error('User ID not found in session');
        setLoading(false);
        return;
      }

      const response = await request(`/student-hostel/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.success && response.data) {
        // Map API response to UI format
        const apiData = response.data;
        const mappedData = {
          id: apiData.allocation_id,
          studentName: user.name, // Display logged-in user's name
          blockName: apiData.block_name,
          floorName: `Floor ${apiData.floor_number}`,
          floorNumber: apiData.floor_number,
          roomNumber: apiData.room_number,
          sharingType: 2, // Default or fetch if available
          sharingTypeLabel: `${apiData.capacity} Sharing`, // Infer from capacity
          wing: apiData.hostel_name, // Using hostel name as wing/building identifier
          wardenName: apiData.warden_name,
          wardenContact: apiData.warden_contact,
          amenities: ['Bed', 'Study Table', 'Cupboard', apiData.mess_facility ? 'Mess' : null].filter(Boolean),
          status: 'Active',
          checkInDate: new Date(apiData.allocation_date).toISOString().split('T')[0],
          checkOutDate: 'N/A', // Not in current response
        };

        setHostelData([mappedData]);
      } else {
        console.log('No hostel data found:', response.error);
        setHostelData([]);
        // Optional: setError(response.error);
      }
    } catch (error) {
      console.error('Error fetching hostel details:', error);
      // Alert.alert('Error', 'Failed to fetch hostel details');
    } finally {
      setLoading(false);
    }
  };

  // Get sharing type color
  const getSharingTypeColor = sharingType => {
    switch (sharingType) {
      case 2:
        return '#4CAF50'; // Green
      case 3:
        return '#2196F3'; // Blue
      case 4:
        return '#FF9800'; // Orange
      case 5:
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return '#4CAF50'; // Green
      case 'Inactive':
        return '#F44336'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  // Handle view hostel details
  const handleViewDetails = hostel => {
    setSelectedHostel(hostel);
    setModalVisible(true);
  };

  // Render hostel card
  const renderHostelCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.hostelCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.blockContainer}>
            <Icon name="building" size={16} color="#666" />
            <Text style={styles.blockName}>{item.blockName}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="user" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.studentName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              name="map-marker"
              size={14}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{item.floorName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="door-open" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>Room {item.roomNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="users" size={14} color="#666" style={styles.icon} />
            <Text
              style={[
                styles.infoText,
                { color: getSharingTypeColor(item.sharingType) },
              ]}
            >
              {item.sharingTypeLabel}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-pin" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.wing}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>Check-in: {item.checkInDate}</Text>
          </View>

          {item.amenities && item.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
          >
            <Icon name="eye" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hostel Details</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading hostel details...</Text>
        </View>
      ) : (
        <FlatList
          data={hostelData}
          renderItem={renderHostelCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="building" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No hostel details found</Text>
              <Text style={styles.emptySubtext}>
                Hostel information will appear here
              </Text>
            </View>
          }
        />
      )}

      {/* Hostel Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedHostel && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedHostel.blockName} - {selectedHostel.roomNumber}
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
                      <Text style={styles.sectionTitle}>
                        Student Information
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.studentName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedHostel.status,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {selectedHostel.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Hostel Details</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Block:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.blockName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Floor:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.floorName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Room:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.roomNumber}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Sharing Type:</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            {
                              color: getSharingTypeColor(
                                selectedHostel.sharingType,
                              ),
                            },
                          ]}
                        >
                          {selectedHostel.sharingTypeLabel}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Wing:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.wing}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>
                        Warden Information
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Warden:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.wardenName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Contact:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.wardenContact}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Duration</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check-in:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.checkInDate}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check-out:</Text>
                        <Text style={styles.detailValue}>
                          {selectedHostel.checkOutDate}
                        </Text>
                      </View>
                    </View>

                    {selectedHostel.amenities &&
                      selectedHostel.amenities.length > 0 && (
                        <View style={styles.modalSection}>
                          <Text style={styles.sectionTitle}>Amenities</Text>
                          <View style={styles.amenitiesList}>
                            {selectedHostel.amenities.map((amenity, index) => (
                              <View key={index} style={styles.amenityItem}>
                                <Icon name="check" size={12} color="#4CAF50" />
                                <Text style={styles.amenityItemText}>
                                  {amenity}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[
                        styles.modalActionButton,
                        styles.closeModalButton,
                      ]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Icon
                        name="times"
                        size={16}
                        color="#fff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
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
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  hostelCard: {
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
    marginBottom: 8,
  },
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
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
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  amenityTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
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
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeModalButton: {
    backgroundColor: '#757575',
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  amenityItemText: {
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});

export default HostelScreen;
