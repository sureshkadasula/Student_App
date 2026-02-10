import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="bars" size={24} color="#000" />
            </TouchableOpacity>

            <Image
                source={require('../assets/images/360-big.png')}
                style={styles.logo}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Icon name="bell" size={21} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#fff', // Ensure background is white
        elevation: 2, // Optional: add shadow for better visibility on other screens
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginTop: 0, // Ensure no margin at top
    },
    logo: {
        width: 140,
        height: 120,
        resizeMode: 'contain',
    },
});

export default CustomHeader;
