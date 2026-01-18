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

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: -600,
            duration: 15000,
            useNativeDriver: true,
          }),
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
        >
          Welcome to Student App - Latest Updates and Announcements Here Welcome
          to Student App - Latest Updates and Announcements Here
        </Animated.Text>
      </View>
      <View style={{ position: 'relative' }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x /
                event.nativeEvent.layoutMeasurement.width,
            );
            setActiveSlide(slideIndex);
          }}
        >
          {slides.map((slide, index) => (
            <View
              key={index}
              style={{
                width: Dimensions.get('window').width,
                height: 250,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={slide}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
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
        <Text style={styles.title}>Home Screen</Text>
        <Text>Welcome to the Student App!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
