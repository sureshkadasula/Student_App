import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../theme/colors';

const CustomDrawerContent = (props) => {
    const { navigation } = props;

    const navigateToScreen = (screenName) => {
        // Navigate to the MainHome tab, which holds the HomeStack, 
        // and then to the specific screen within that stack.
        navigation.navigate('MainHome', { screen: screenName });
    };

    const navigateToTab = (tabName) => {
        navigation.navigate(tabName);
    }

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/images/app-logo.png')} // Make sure this path is correct based on other files
                    style={styles.logo}
                />
            </View>

            <DrawerItem
                label="Home"
                icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
                onPress={() => navigateToScreen('HomeMain')} // Navigate to the root of HomeStack
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Classes"
                icon={({ color, size }) => <Icon name="book" size={size} color={color} />}
                onPress={() => navigateToScreen('Classes')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Mark Sheets"
                icon={({ color, size }) => <Icon name="file-text" size={size} color={color} />}
                onPress={() => navigateToTab('MarkSheet')} // Verify if this should be a tab or screen
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Assignments"
                icon={({ color, size }) => <Icon name="clipboard" size={size} color={color} />}
                onPress={() => navigateToScreen('Assignments')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Time Table"
                icon={({ color, size }) => <Icon name="clock-o" size={size} color={color} />}
                onPress={() => navigateToScreen('Time Table')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Notice Board"
                icon={({ color, size }) => <Icon name="bullhorn" size={size} color={color} />}
                onPress={() => navigateToScreen('Notice Board')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Library"
                icon={({ color, size }) => <Icon name="book" size={size} color={color} />}
                onPress={() => navigateToScreen('Library')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Attendance"
                icon={({ color, size }) => <Icon name="check-circle" size={size} color={color} />}
                onPress={() => navigateToScreen('Attendance')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Home Work"
                icon={({ color, size }) => <Icon name="pencil" size={size} color={color} />}
                onPress={() => navigateToScreen('Home Work')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Admin Request"
                icon={({ color, size }) => <Icon name="cogs" size={size} color={color} />}
                onPress={() => navigateToScreen('Admin Request')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Fee Payment"
                icon={({ color, size }) => <Icon name="credit-card" size={size} color={color} />}
                onPress={() => navigateToScreen('Fee Payment')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Event"
                icon={({ color, size }) => <Icon name="calendar" size={size} color={color} />}
                onPress={() => navigateToScreen('Event')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Transport"
                icon={({ color, size }) => <Icon name="bus" size={size} color={color} />}
                onPress={() => navigateToScreen('Transport')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Hostel"
                icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
                onPress={() => navigateToScreen('Hostel')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Analytics"
                icon={({ color, size }) => <Icon name="bar-chart" size={size} color={color} />}
                onPress={() => navigateToScreen('Analytics')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
            <DrawerItem
                label="Request & Certificate"
                icon={({ color, size }) => <Icon name="file-o" size={size} color={color} />}
                onPress={() => navigateToScreen('Request & Certificate Management')}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.textPrimary}
            />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: 10,
    },
    logo: {
        width: 150,
        height: 80,
        resizeMode: 'contain',
    },
});

export default CustomDrawerContent;
