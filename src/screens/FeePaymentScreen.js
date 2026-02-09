import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { request } from '../services/api';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      if (!session || !session.user) {
        throw new Error('User session not found');
      }

      const userid = session.user.userid;
      const response = await request(`/student-fees/by-userid-standard/${userid}`, {
        headers: { 'Authorization': `Bearer ${session.token}` },
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
        <Icon name="alert-circle-outline" size={48} color="#ef4444" />
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Payment</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF751F']} />}
      >
        {/* Student Info Card */}
        <View style={styles.studentInfoCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetail}>
              {student.class_name} • {student.standard}
            </Text>
            <Text style={styles.academicYear}>{student.academic_year}</Text>
          </View>
        </View>

        {/* Balance Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="wallet-outline" size={20} color="#FF751F" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Payment Overview</Text>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceGrid}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Total Fees</Text>
                <Text style={styles.balanceValue}>{formatCurrency(balance.total_fee)}</Text>
              </View>
              <View style={[styles.balanceItem, { alignItems: 'flex-end' }]}>
                <Text style={styles.balanceLabel}>Paid</Text>
                <Text style={[styles.balanceValue, { color: '#10b981' }]}>{formatCurrency(balance.total_paid)}</Text>
              </View>
            </View>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(paymentPercentage, 100)}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{paymentPercentage}% Paid</Text>
              <Text style={styles.progressText}>{100 - paymentPercentage}% Remaining</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.outstandingRow}>
              <Text style={styles.outstandingLabel}>Outstanding Amount</Text>
              <Text style={styles.outstandingValue}>{formatCurrency(balance.outstanding)}</Text>
            </View>
          </View>
        </View>

        {/* Fee Structure (Accordion) */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setShowStructure(!showStructure)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="file-document-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Fee Structure</Text>
            </View>
            <Icon name={showStructure ? "chevron-up" : "chevron-down"} size={24} color="#94a3b8" />
          </TouchableOpacity>

          {showStructure && (
            <View style={styles.structureList}>
              <View style={styles.structureDivider} />
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
          <View style={styles.cardHeader}>
            <Icon name="history" size={20} color="#64748b" style={{ marginRight: 8 }} />
            <Text style={styles.cardTitle}>Transaction History</Text>
          </View>

          {payments_summary.transaction_history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions recorded.</Text>
            </View>
          ) : (
            payments_summary.transaction_history.map((txn, index) => (
              <View key={index} style={styles.txnRow}>
                <View style={styles.txnIconContainer}>
                  <Icon name={txn.payment_method === 'online' ? 'credit-card-outline' : 'cash'} size={20} color="#64748b" />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnMethod}>{txn.payment_method || 'Payment'}</Text>
                  <Text style={styles.txnDate}>{new Date(txn.payment_date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.txnAmountContainer}>
                  <Text style={styles.txnAmount}>{formatCurrency(txn.paid_amount)}</Text>
                  <View style={styles.statusChip}>
                    <Text style={styles.txnStatus}>{txn.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* Pay Now Button (Floating) */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
          <Text style={styles.payButtonText}>Pay Fees</Text>
          <Icon name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 15,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  retryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Student Info Card
  studentInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff7ed', // Light orange bg
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF751F',
  },
  infoContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  studentDetail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  academicYear: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 4,
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  // Generic Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 1,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Balance Overview
  balanceContainer: {},
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  outstandingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outstandingLabel: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  outstandingValue: {
    fontSize: 20,
    color: '#ef4444',
    fontWeight: '800',
  },

  // Accordion
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  structureList: {
    marginTop: 8,
  },
  structureDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  structureLabel: {
    fontSize: 14,
    color: '#475569',
  },
  structureValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF751F',
  },

  // Transactions
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  txnIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txnInfo: {
    flex: 1,
  },
  txnMethod: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  txnDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  txnAmountContainer: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusChip: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  txnStatus: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  // Footer Button
  footerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  payButton: {
    backgroundColor: '#FF751F',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF751F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default FeePaymentScreen;
