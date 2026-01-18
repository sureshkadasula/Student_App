import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MarkSheetsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Sheets</Text>
      <Text>View your mark sheets here.</Text>
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

export default MarkSheetsScreen;
