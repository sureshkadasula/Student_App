import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import CustomHeader from '../components/CustomHeader';
import BottomNavigator from './BottomNavigator';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ setIsLoggedIn }) => {
  return (
    <Drawer.Navigator
      initialRouteName="MainHome"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // This header belongs to the Drawer (wrapping BottomTabs)
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Drawer.Screen
        name="MainHome"
        options={{ headerShown: false }} // Hide Drawer header for MainHome as BottomNav/Stack handles it
      >
        {props => <BottomNavigator {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
