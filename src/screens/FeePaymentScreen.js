import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeePaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fee Payment</Text>
      <Text>Manage your fee payments here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default FeePaymentScreen;
