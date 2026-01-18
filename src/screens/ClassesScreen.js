import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClassesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classes Screen</Text>
      <Text>View your classes here.</Text>
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

export default ClassesScreen;
