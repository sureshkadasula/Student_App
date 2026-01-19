import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeatureCatalogueScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feature Catalogue</Text>
      <Text>Explore available features here.</Text>
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

export default FeatureCatalogueScreen;
