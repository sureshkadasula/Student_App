import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RequestCertificateManagementScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request & Certificate Management</Text>
      <Text>Manage requests and certificates here.</Text>
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

export default RequestCertificateManagementScreen;
