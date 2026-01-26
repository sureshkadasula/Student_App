import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const slides = [
    require('../assets/sliderImages/Dell.jpg'),
    require('../assets/sliderImages/Montmorenci_School.png'),
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = [
    { name: 'Classes', icon: 'book', screen: 'Classes' },
    { name: 'Assignments', icon: 'clipboard', screen: 'Assignments' },
    { name: 'Attendance', icon: 'check-circle', screen: 'Attendance' },
    { name: 'Event', icon: 'calendar', screen: 'Event' },
    { name: 'Admin Request', icon: 'cogs', screen: 'Admin Request' },
    { name: 'Fee Payment', icon: 'credit-card', screen: 'Fee Payment' },
    { name: 'Home Work', icon: 'pencil', screen: 'Home Work' },
    { name: 'Hostel', icon: 'home', screen: 'Hostel' },
    { name: 'Library', icon: 'book', screen: 'Library' },
    { name: 'Mark Sheets', icon: 'file-text', screen: 'Mark Sheets' },
    { name: 'Notice Board', icon: 'bullhorn', screen: 'Notice Board' },
    { name: 'Profile', icon: 'user', screen: 'Profile' },
    { name: 'Time Table', icon: 'clock-o', screen: 'Time Table' },
    { name: 'Transport', icon: 'bus', screen: 'Transport' },
    { name: 'Analytics', icon: 'bar-chart', screen: 'Analytics' },
    {
      name: 'Request & Certificate Management',
      icon: 'file-o',
      screen: 'Request & Certificate Management',
    },
  ];

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: -600,
            duration: 15000,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    startAnimation();
  }, [scrollAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % slides.length;
        scrollViewRef.current?.scrollTo({
          x: next * Dimensions.get('window').width,
          animated: true,
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            height: 60,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
          }}
        >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <Icon
              name="bars"
              size={20}
              color="#000"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 0 }}
            />
          </View>
          <Image
            source={require('../assets/images/app-logo.png')}
            style={{ width: 150, height: 150, resizeMode: 'contain' }}
          />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Icon name="bell" size={20} color="#000" />
          </View>
        </View>
        <View
          style={{
            height: 50,
            backgroundColor: '#FF751F',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Animated.Text
            style={{
              color: '#fff',
              fontSize: 16,
              transform: [{ translateX: scrollAnim }],
            }}
            numberOfLines={1}
          >
            Welcome to Student App - Latest Updates and Announcements Here
            Welcome to Student App - Latest Updates and Announcements Here
          </Animated.Text>
        </View>
        <View style={{ position: 'relative' }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            snapToInterval={Dimensions.get('window').width - 20}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            onMomentumScrollEnd={event => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x /
                  (Dimensions.get('window').width - 20),
              );
              setActiveSlide(slideIndex);
            }}
          >
            {slides.map((slide, index) => (
              <View
                key={index}
                style={{
                  width: Dimensions.get('window').width - 20,
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={slide}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            {slides.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: activeSlide === index ? '#FF751F' : '#ccc',
                  marginHorizontal: 5,
                }}
              />
            ))}
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Explore Our Feature</Text>
          <View style={styles.card}>
            <View style={styles.categoriesContainer}>
              {categories.map((cat, index) => (
                <View key={index} style={styles.categoryItem}>
                  <TouchableOpacity
                    style={styles.categoryCircle}
                    onPress={() => navigation.navigate(cat.screen)}
                  >
                    <Icon name={cat.icon} size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: (Dimensions.get('window').width - 40) / 4 - 4,
    margin: 1,
  },
  categoryCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FF751F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    // color: '#FF751F',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
