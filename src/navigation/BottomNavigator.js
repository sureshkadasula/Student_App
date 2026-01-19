import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import DrawerNavigator from './DrawerNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import FeatureCatalogueScreen from '../screens/FeatureCatalogueScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MarkSheetsScreen from '../screens/MarkSheetsScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF751F',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Feature Catalogue') {
            iconName = 'list';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'MarkSheet') {
            iconName = 'file-text-o';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DrawerNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Feature Catalogue" component={FeatureCatalogueScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="MarkSheet" component={MarkSheetsScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
