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
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF751F',
        tabBarInactiveTintColor: 'gray',
        listeners: {
          tabPress: e => {
            if (route.name === 'MainHome') {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'MainHome',
                    state: {
                      routes: [{ name: 'MainHome' }],
                      index: 0,
                    },
                  },
                ],
              });
            }
          },
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'MainHome') {
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

          return <Icon name={iconName} size={18} color={color} />;
        },
      })}
    >
      <Tab.Screen name="MainHome" component={DrawerNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Feature Catalogue" component={FeatureCatalogueScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="MarkSheet" component={MarkSheetsScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
