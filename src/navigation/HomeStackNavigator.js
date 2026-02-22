import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import NotificationsScreen from '../screens/NotificationsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import CustomHeader from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerBackButtonMenuEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Classes" component={ClassesScreen} />
      <Stack.Screen name="Mark Sheets" component={MarkSheetsScreen} />
      <Stack.Screen name="Assignments" component={AssignmentsScreen} />
      <Stack.Screen name="Time Table" component={TimeTableScreen} />
      <Stack.Screen name="Notice Board" component={NoticeBoardScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Home Work" component={HomeWorkScreen} />
      <Stack.Screen name="Admin Request" component={AdminRequestScreen} />
      <Stack.Screen name="Fee Payment" component={FeePaymentScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Transport" component={TransportScreen} />
      <Stack.Screen name="Hostel" component={HostelScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen
        name="Request & Certificate Management"
        component={RequestCertificateManagementScreen}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
