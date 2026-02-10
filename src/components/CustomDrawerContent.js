import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDrawerContent = (props) => {
    const { navigation } = props;

    const navigateToScreen = (screenName) => {
        // Navigate to screens within HomeStackNavigator
        // Path: Drawer → MainHome (BottomNavigator) → MainHome tab (HomeStackNavigator) → Screen
        navigation.navigate('MainHome', {
            screen: 'MainHome',  // The tab name in BottomNavigator
            params: { screen: screenName }  // The screen name in HomeStackNavigator
        });
        // Close the drawer after navigation
        navigation.closeDrawer();
    };

    const navigateToTab = (tabName) => {
        // Navigate to tabs in BottomNavigator
        // Path: Drawer → MainHome (BottomNavigator) → Tab
        navigation.navigate('MainHome', {
            screen: tabName  // The tab name in BottomNavigator
        });
        // Close the drawer after navigation
        navigation.closeDrawer();
    }

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent} contentContainerStyle={styles.drawerContentContainer}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/360-big.png')}
                        style={styles.logo}
                    />
                </View>
            </View>

            <DrawerItem
                label="Home"
                icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
                onPress={() => navigateToScreen('HomeMain')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Classes"
                icon={({ color, size }) => <Icon name="book" size={size} color={color} />}
                onPress={() => navigateToScreen('Classes')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Mark Sheets"
                icon={({ color, size }) => <Icon name="file-text" size={size} color={color} />}
                onPress={() => navigateToTab('MarkSheet')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Assignments"
                icon={({ color, size }) => <Icon name="clipboard" size={size} color={color} />}
                onPress={() => navigateToScreen('Assignments')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Time Table"
                icon={({ color, size }) => <Icon name="clock-o" size={size} color={color} />}
                onPress={() => navigateToScreen('Time Table')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Notice Board"
                icon={({ color, size }) => <Icon name="bullhorn" size={size} color={color} />}
                onPress={() => navigateToScreen('Notice Board')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Library"
                icon={({ color, size }) => <Icon name="book" size={size} color={color} />}
                onPress={() => navigateToScreen('Library')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Attendance"
                icon={({ color, size }) => <Icon name="check-circle" size={size} color={color} />}
                onPress={() => navigateToScreen('Attendance')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            {/* <DrawerItem
                label="Home Work"
                icon={({ color, size }) => <Icon name="pencil" size={size} color={color} />}
                onPress={() => navigateToScreen('Home Work')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            /> */}
            <DrawerItem
                label="Admin Request"
                icon={({ color, size }) => <Icon name="cogs" size={size} color={color} />}
                onPress={() => navigateToScreen('Admin Request')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Fee Payment"
                icon={({ color, size }) => <Icon name="credit-card" size={size} color={color} />}
                onPress={() => navigateToScreen('Fee Payment')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Event"
                icon={({ color, size }) => <Icon name="calendar" size={size} color={color} />}
                onPress={() => navigateToScreen('Event')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Transport"
                icon={({ color, size }) => <Icon name="bus" size={size} color={color} />}
                onPress={() => navigateToScreen('Transport')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Hostel"
                icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
                onPress={() => navigateToScreen('Hostel')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            {/* <DrawerItem
                label="Request & Certificate"
                icon={({ color, size }) => <Icon name="file-o" size={size} color={color} />}
                onPress={() => navigateToScreen('Request & Certificate Management')}
                activeTintColor="#ffffff"
                inactiveTintColor="#bdc3c7"
                activeBackgroundColor="transparent"
                inactiveBackgroundColor="transparent"
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            /> */}
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        backgroundColor: '#545454',
    },
    drawerContentContainer: {
        backgroundColor: '#545454',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    logoContainer: {
        width: 120,
        height: 60,
        backgroundColor: '#ffffff',
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingBottom: 20,
    },
    logo: {
        width: 190,
        height: 140,
        resizeMode: 'contain',
    },
    drawerItem: {
        marginHorizontal: 8,
        marginBottom: 2,
        borderRadius: 0,
    },
    drawerLabel: {
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});

export default CustomDrawerContent;
