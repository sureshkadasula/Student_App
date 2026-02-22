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
import GalleryService from '../services/GalleryService';
import { Linking, Alert, ActivityIndicator } from 'react-native';

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
    { name: 'Attendance', icon: 'check-circle', screen: 'Attendance' },
    { name: 'Event', icon: 'calendar', screen: 'Event' },
    { name: 'Admin Request', icon: 'cogs', screen: 'Admin Request' },
    { name: 'Fee Payment', icon: 'credit-card', screen: 'Fee Payment' },
    { name: 'Hostel', icon: 'home', screen: 'Hostel' },
    { name: 'Library', icon: 'book', screen: 'Library' },
    { name: 'Mark Sheets', icon: 'file-text', screen: 'Mark Sheets' },
    { name: 'Notice Board', icon: 'bullhorn', screen: 'Notice Board' },
    { name: 'Profile', icon: 'user', screen: 'Profile' },
    { name: 'Transport', icon: 'bus', screen: 'Transport' },
    { name: 'Gallery', icon: 'image', screen: 'Gallery' },
  ];

  const [galleries, setGalleries] = useState([]);
  const [galleriesLoading, setGalleriesLoading] = useState(true);

  // Default gallery placeholder for folders or links without direct file IDs
  const DEFAULT_FOLDER_IMAGE = 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const getDriveThumbnail = (url) => {
    if (!url) return DEFAULT_FOLDER_IMAGE;
    // Regex to extract file ID from various Google Drive link formats
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}=w400-h400-p`;
    }
    return DEFAULT_FOLDER_IMAGE;
  };

  const fetchGalleries = async () => {
    try {
      setGalleriesLoading(true);
      const data = await GalleryService.fetchGalleries();
      setGalleries(data || []);
    } catch (error) {
      console.error('Error loading galleries:', error);
    } finally {
      setGalleriesLoading(false);
    }
  };

  const handleOpenGallery = (item) => {
    if (item.drive_link) {
      Linking.openURL(item.drive_link).catch((err) => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Could not open the gallery link.');
      });
    } else {
      Alert.alert('Note', 'No link available for this gallery.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // ✅ TRUE INFINITE MARQUEE (width-aware)
  useEffect(() => {
    fetchGalleries();
  }, []);

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
            snapToInterval={Dimensions.get('window').width - 40 + 20} // Width + Margin
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
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

            {/* INTEGRATED GALLERY PREVIEW */}
            {/* <View style={styles.integratedGallery}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Activity Gallery</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Gallery')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {galleriesLoading ? (
                <View style={styles.galleryLoadingContainer}>
                  <ActivityIndicator size="small" color="#FF751F" />
                </View>
              ) : galleries.length > 0 ? (
                <View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryHorizontalScroll}
                  >
                    {galleries.slice(0, 5).map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.galleryItem}
                        onPress={() => handleOpenGallery(item)}
                      >
                        <Image
                          source={{ uri: getDriveThumbnail(item.drive_link) }}
                          style={styles.galleryThumbnail}
                          resizeMode="cover"
                        />
                        <View style={styles.galleryInfo}>
                          <Text style={styles.galleryItemTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.galleryItemDate}>{formatDate(item.created_at)}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.emptyGallery}>
                  <Text style={styles.emptyGalleryText}>No gallery items available</Text>
                </View>
              )}
            </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  marqueeContainer: {
    height: 30, // Reduced from 40 to match dashboard.tsx
    backgroundColor: '#FF751F',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  marqueeRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  marqueeText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 20, // Added spacing like dashboard.tsx
  },
  slide: {
    width: Dimensions.get('window').width - 40, // Match dashboard.tsx (-40 instead of -20)
    height: 200,
    marginRight: 20, // Match dashboard.tsx margin
    borderRadius: 8, // Reduced from 15 to 8
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Changed from space-between
  },
  categoryItem: {
    alignItems: 'center',
    width: '25%', // Fixed width for 4 columns
    paddingBottom: 15,
  },
  categoryCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FF751F', // Orange backgound
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#636160ff', // Grey text
    maxWidth: '100%',
  },
  integratedGallery: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  viewAllText: {
    fontSize: 12,
    color: '#FF751F',
    fontWeight: '700',
  },
  galleryHorizontalScroll: {
    paddingBottom: 5,
  },
  galleryItem: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  galleryThumbnail: {
    width: '100%',
    height: 70,
  },
  galleryInfo: {
    padding: 6,
  },
  galleryItemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  galleryItemDate: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  galleryLoadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGallery: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGalleryText: {
    color: '#999',
    fontSize: 12,
  },
});

export default HomeScreen;
