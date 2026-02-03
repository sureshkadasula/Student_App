import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';

const TransportScreen = () => {
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTransportDetails();
  }, []);

  const fetchTransportDetails = async () => {
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

      const response = await request(`/student-transport/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('📦 [TransportScreen] Response:', response);

      if (response.success && response.data) {
        // Map API response to UI format
        const apiData = response.data;
        const mappedData = {
          id: apiData.assignment_id,
          routeName: apiData.route_name,
          vehicleType: apiData.vehicle_type || 'Bus',
          vehicleNumber: apiData.vehicle_number,
          driverName: apiData.driver_name,
          driverContact: apiData.driver_phone,
          pickupTime: apiData.stops?.find(s => s.stop_name === apiData.pickup_point)?.pickup_time || 'N/A',
          dropTime: apiData.stops?.find(s => s.stop_name === apiData.pickup_point)?.drop_time || 'N/A',
          stops: apiData.stops ? apiData.stops.map(s => s.stop_name) : [],
          status: 'Active',
          capacity: 40, // Default or fetch if available
          currentOccupancy: 20, // Default or fetch if available
          pickupPoint: apiData.pickup_point
        };

        setTransportData([mappedData]);
      } else {
        console.log('No transport data found:', response.error);
        setTransportData([]);
        // Optional: setError(response.error) if there was a state for it, but currently it just sets empty data
      }
    } catch (error) {
      console.error('Error fetching transport details:', error);
      // Fallback for unexpected errors
      setTransportData([]);
    } finally {
      setLoading(false);
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

  // Get vehicle type color
  const getVehicleTypeColor = vehicleType => {
    switch (vehicleType) {
      case 'Bus':
        return '#2196F3'; // Blue
      case 'Van':
        return '#FF9800'; // Orange
      case 'Car':
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Gray
    }
  };

  // Handle view transport details
  const handleViewDetails = transport => {
    setSelectedTransport(transport);
    setModalVisible(true);
  };

  // Render transport card
  const renderTransportCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.transportCard}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.routeContainer}>
            <Icon name="bus" size={16} color="#666" />
            <Text style={styles.routeName}>{item.routeName}</Text>
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
            <Icon name="truck" size={14} color="#666" style={styles.icon} />
            <Text
              style={[
                styles.infoText,
                { color: getVehicleTypeColor(item.vehicleType) },
              ]}
            >
              {item.vehicleType} - {item.vehicleNumber}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="user" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.driverName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>{item.driverContact}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock-o" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>
              Pickup: {item.pickupTime} | Drop: {item.dropTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="users" size={14} color="#666" style={styles.icon} />
            <Text style={styles.infoText}>
              Capacity: {item.currentOccupancy}/{item.capacity}
            </Text>
          </View>

          <View style={styles.stopsContainer}>
            <Text style={styles.stopsLabel}>Stops:</Text>
            <View style={styles.stopsList}>
              {item.stops.map((stop, index) => (
                <View key={index} style={styles.stopTag}>
                  <Text style={styles.stopText}>{stop}</Text>
                </View>
              ))}
            </View>
          </View>
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
        <Text style={styles.headerTitle}>Transport Details</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transport details...</Text>
        </View>
      ) : (
        <FlatList
          data={transportData}
          renderItem={renderTransportCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="bus" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No transport details found</Text>
              <Text style={styles.emptySubtext}>
                Transport information will appear here
              </Text>
            </View>
          }
        />
      )}

      {/* Transport Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedTransport && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedTransport.routeName}
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
                        Vehicle Information
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.vehicleType}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Number:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.vehicleNumber}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                selectedTransport.status,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {selectedTransport.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>
                        Driver Information
                      </Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.driverName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Contact:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.driverContact}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Schedule</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Pickup Time:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.pickupTime}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Drop Time:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.dropTime}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Capacity</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Capacity:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.capacity}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Current Occupancy:
                        </Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.currentOccupancy}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Available Seats:</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransport.capacity -
                            selectedTransport.currentOccupancy}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Route Stops</Text>
                      <View style={styles.stopsList}>
                        {selectedTransport.stops.map((stop, index) => (
                          <View key={index} style={styles.stopItem}>
                            <Icon name="map-marker" size={12} color="#4CAF50" />
                            <Text style={styles.stopItemText}>{stop}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
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
  transportCard: {
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
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeName: {
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
  stopsContainer: {
    marginTop: 8,
  },
  stopsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stopsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stopTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stopText: {
    fontSize: 11,
    color: '#1976D2',
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
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  stopItemText: {
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

export default TransportScreen;
