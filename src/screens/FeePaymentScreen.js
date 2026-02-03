import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { request } from '../services/api';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/FontAwesome';

const FeePaymentScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [showStructure, setShowStructure] = useState(false);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await AuthService.getSession();
      console.log('🚀 [FeePaymentScreen] Session:', session.token);
      if (!session || !session.user) {
        throw new Error('User session not found');
      }

      const userid = session.user.userid;

      const response = await request(`/student-fees/by-userid-standard/${userid}`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        },
      });

      if (response.success) {
        setFeeData(response.data);
      } else {
        setError(response.error || 'Failed to fetch fee details');
      }
    } catch (err) {
      console.error('Error fetching fee data:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeeData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF751F" />
        <Text style={styles.loadingText}>Loading fee details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFeeData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!feeData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No fee data available.</Text>
      </View>
    );
  }

  const { student, fee_template, balance, payments_summary } = feeData;
  const paymentPercentage = balance.payment_percentage || 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Payment</Text>
        <View style={styles.studentInfoCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
            </View>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetail}>
              Class: {student.class_name} | Std: {student.standard}
            </Text>
            <Text style={styles.studentDetail}>ID: {student.userid}</Text>
            <Text style={styles.academicYear}>{student.academic_year}</Text>
          </View>
        </View>
      </View>

      {/* Balance Overview Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Overview</Text>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Total Fees</Text>
              <Text style={styles.balanceValue}>{formatCurrency(balance.total_fee)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.balanceLabel}>Net Payable</Text>
              <Text style={styles.balanceValue}>{formatCurrency(balance.net_payable)}</Text>
            </View>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(paymentPercentage, 100)}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>{paymentPercentage}% Paid</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Paid Amount</Text>
              <Text style={[styles.balanceValue, { color: '#4CAF50' }]}>{formatCurrency(balance.total_paid)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.balanceLabel}>Outstanding</Text>
              <Text style={[styles.balanceValue, { color: '#F44336' }]}>{formatCurrency(balance.outstanding)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Fee Structure Card (Collapsible) */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeaderActive}
          onPress={() => setShowStructure(!showStructure)}
        >
          <Text style={styles.cardTitle}>Fee Structure</Text>
          <Icon name={showStructure ? "chevron-up" : "chevron-down"} size={16} color="#666" />
        </TouchableOpacity>

        {showStructure && (
          <View style={styles.structureList}>
            {Object.entries(fee_template.structure).map(([key, value]) => {
              if (value > 0) {
                return (
                  <View key={key} style={styles.structureRow}>
                    <Text style={styles.structureLabel}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={styles.structureValue}>{formatCurrency(value)}</Text>
                  </View>
                );
              }
              return null;
            })}
            <View style={[styles.structureRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Annual Fee</Text>
              <Text style={styles.totalValue}>{formatCurrency(fee_template.total_annual_fee)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Transaction History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transaction History</Text>
        {payments_summary.transaction_history.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found.</Text>
        ) : (
          payments_summary.transaction_history.map((txn, index) => (
            <View key={index} style={styles.txnRow}>
              <View style={styles.txnIcon}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnMethod}>{txn.payment_method}</Text>
                <Text style={styles.txnDate}>{new Date(txn.payment_date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.txnAmountContainer}>
                <Text style={styles.txnAmount}>{formatCurrency(txn.paid_amount)}</Text>
                <Text style={styles.txnStatus}>{txn.status}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#FF751F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#FF751F',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  studentInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    borderRadius: 12,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF751F',
  },
  infoContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentDetail: {
    fontSize: 13,
    color: '#f0f0f0',
    marginTop: 2,
  },
  academicYear: {
    fontSize: 12,
    color: '#ffebb3',
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardHeaderActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  balanceContainer: {},
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressLabels: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  structureList: {
    marginTop: 15,
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  structureLabel: {
    fontSize: 14,
    color: '#555',
  },
  structureValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#FF751F',
    fontSize: 16,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  txnIcon: {
    marginRight: 15,
  },
  txnInfo: {
    flex: 1,
  },
  txnMethod: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  txnDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  txnAmountContainer: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  txnStatus: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default FeePaymentScreen;
