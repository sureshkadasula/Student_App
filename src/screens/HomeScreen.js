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
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const navigation = useNavigation();

  // 🔹 marquee animation
  // 🔹 marquee animation
  const [scrollAnim] = useState(() => new Animated.Value(0));
  const [textWidth, setTextWidth] = useState(0);

  const scrollViewRef = useRef(null);

  const marqueeText =
    'Welcome to Student App - Latest Updates and Announcements Here   ';

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

  // ✅ TRUE INFINITE MARQUEE (width-aware)
  useEffect(() => {
    if (!textWidth) return;

    scrollAnim.setValue(0);

    const animation = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -textWidth,
        duration: textWidth * 20, // smooth constant speed
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [textWidth, scrollAnim]);

  // slider auto-scroll
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
        {/* HEADER */}
        {/* ✅ MARQUEE */}
        <View style={styles.marqueeContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
          >
            <Animated.View
              style={[
                styles.marqueeRow,
                { transform: [{ translateX: scrollAnim }] },
              ]}
            >
              <Text
                allowFontScaling={false}
                onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
                style={styles.marqueeText}
              >
                {marqueeText}
              </Text>
              <Text allowFontScaling={false} style={styles.marqueeText}>
                {marqueeText}
              </Text>
            </Animated.View>
          </ScrollView>
        </View>

        {/* SLIDER */}
        <View style={{ position: 'relative' }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            snapToInterval={Dimensions.get('window').width - 20}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {slides.map((slide, index) => (
              <View key={index} style={styles.slide}>
                <Image source={slide} style={styles.slideImage} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: activeSlide === index ? '#FF751F' : '#ccc' },
                ]}
              />
            ))}
          </View>
        </View>

        {/* CATEGORIES */}
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
  marqueeContainer: {
    height: 40,
    backgroundColor: '#FF751F',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  marqueeRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  marqueeText: {
    color: '#fff',
    fontSize: 16,
  },
  slide: {
    width: Dimensions.get('window').width - 20,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  container: {
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (Dimensions.get('window').width - 40) / 4 - 4,
    margin: 4,
    paddingBottom: 8,
  },
  categoryCircle: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#8f8e8dff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
    color: '#FF751F',
  },
});

export default HomeScreen;
