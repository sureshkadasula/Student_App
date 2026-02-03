import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeStackNavigator from './HomeStackNavigator'; // Import HomeStack
import FeatureCatalogueScreen from '../screens/FeatureCatalogueScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MarkSheetsScreen from '../screens/MarkSheetsScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import CustomHeader from '../components/CustomHeader';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const BottomNavigator = ({ setIsLoggedIn }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        listeners: {
          tabPress: e => {
            if (route.name === 'MainHome') {
              // Optional: reset stack on tab press if desired
              // navigation.navigate('MainHome', { screen: 'HomeMain' });
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
      <Tab.Screen
        name="MainHome"
        component={HomeStackNavigator} // Use the specific stack
        options={{
          headerShown: false, // Let the stack handle the header
        }}
      />
      <Tab.Screen name="Profile" options={{ headerShown: false }}>
        {props => (
          <ProfileStackNavigator {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Feature Catalogue"
        component={FeatureCatalogueScreen}
        options={{
          headerShown: true,
          header: props => <CustomHeader {...props} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: true,
          header: props => <CustomHeader {...props} />,
        }}
      />
      <Tab.Screen
        name="MarkSheet"
        component={MarkSheetsScreen}
        options={{
          headerShown: true,
          header: props => <CustomHeader {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
