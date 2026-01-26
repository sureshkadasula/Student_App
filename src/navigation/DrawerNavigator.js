import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ClassesScreen from '../screens/ClassesScreen';
import MarkSheetsScreen from '../screens/MarkSheetsScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import TimeTableScreen from '../screens/TimeTableScreen';
import NoticeBoardScreen from '../screens/NoticeBoardScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import HomeWorkScreen from '../screens/HomeWorkScreen';
import AdminRequestScreen from '../screens/AdminRequestScreen';
import FeePaymentScreen from '../screens/FeePaymentScreen';
import EventScreen from '../screens/EventScreen';
import TransportScreen from '../screens/TransportScreen';
import HostelScreen from '../screens/HostelScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import RequestCertificateManagementScreen from '../screens/RequestCertificateManagementScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MainHome"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Drawer.Screen
        name="MainHome"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Classes" component={ClassesScreen} />
      <Drawer.Screen name="Mark Sheets" component={MarkSheetsScreen} />
      <Drawer.Screen name="Assignments" component={AssignmentsScreen} />
      <Drawer.Screen name="Time Table" component={TimeTableScreen} />
      <Drawer.Screen name="Notice Board" component={NoticeBoardScreen} />
      <Drawer.Screen name="Library" component={LibraryScreen} />
      <Drawer.Screen name="Attendance" component={AttendanceScreen} />
      <Drawer.Screen name="Home Work" component={HomeWorkScreen} />
      <Drawer.Screen name="Admin Request" component={AdminRequestScreen} />
      <Drawer.Screen name="Fee Payment" component={FeePaymentScreen} />
      <Drawer.Screen name="Event" component={EventScreen} />
      <Drawer.Screen name="Transport" component={TransportScreen} />
      <Drawer.Screen name="Hostel" component={HostelScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen
        name="Request & Certificate Management"
        component={RequestCertificateManagementScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
