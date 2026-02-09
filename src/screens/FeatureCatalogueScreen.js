import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

const features = [
  { id: '1', name: 'Classes', icon: 'book', screen: 'Classes', color: '#3498db' }, // Blue
  { id: '2', name: 'Assignments', icon: 'clipboard', screen: 'Assignments', color: '#e74c3c' }, // Red
  { id: '3', name: 'Attendance', icon: 'check-circle', screen: 'Attendance', color: '#2ecc71' }, // Green
  { id: '4', name: 'Event', icon: 'calendar', screen: 'Event', color: '#f39c12' }, // Orange
  { id: '5', name: 'Admin Request', icon: 'cogs', screen: 'Admin Request', color: '#9b59b6' }, // Purple
  { id: '6', name: 'Fee Payment', icon: 'credit-card', screen: 'Fee Payment', color: '#1abc9c' }, // Teal
  { id: '7', name: 'Hostel', icon: 'home', screen: 'Hostel', color: '#34495e' }, // Dark Blue
  { id: '8', name: 'Library', icon: 'book', screen: 'Library', color: '#e67e22' }, // Pumpkin
  { id: '9', name: 'Mark Sheets', icon: 'file-text', screen: 'Mark Sheets', color: '#e84393' }, // Pink
  { id: '10', name: 'Notice Board', icon: 'bullhorn', screen: 'Notice Board', color: '#f1c40f' }, // Yellow
  { id: '11', name: 'Profile', icon: 'user', screen: 'Profile', color: '#7f8c8d' }, // Grey
  { id: '12', name: 'Transport', icon: 'bus', screen: 'Transport', color: '#16a085' }, // Greenish
  { id: '13', name: 'Analytics', icon: 'bar-chart', screen: 'Analytics', color: '#2980b9' }, // Blue
];

const FeatureCatalogueScreen = () => {
  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Features</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        {features.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => handlePress(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
              <Icon name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF751F',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'flex-start',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 24,
    marginHorizontal: 2.5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default FeatureCatalogueScreen;
