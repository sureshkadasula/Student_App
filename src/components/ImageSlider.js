import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const DEFAULT_SLIDER_DATA = [
    {
        id: '1',
        title: 'Welcome to Student App',
        description: 'Latest Updates and Announcements Here',
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'School Campus',
        description: 'Explore our features and stay updated.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
];

const ImageSlider = ({ data = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // Use provided data or fallback to defaults
    const displayData = data && data.length > 0 ? data.map(item => ({
        id: item.id.toString(),
        title: item.title,
        subtitle: item.description || 'Campus 360 Update',
        image: getDirectDriveLink(item.drive_link)
    })) : DEFAULT_SLIDER_DATA;

    // Helper function to convert Google Drive share links to direct image links
    function getDirectDriveLink(url) {
        if (!url) return '';
        if (!url.includes('drive.google.com')) return url;

        try {
            // Extract file ID from various Drive URL formats
            let fileId = '';
            if (url.includes('/d/')) {
                fileId = url.split('/d/')[1].split('/')[0];
            } else if (url.includes('id=')) {
                fileId = url.split('id=')[1].split('&')[0];
            }

            return fileId ? `https://lh3.googleusercontent.com/u/0/d/${fileId}=w1000?authuser=0` : url;
        } catch (e) {
            console.warn('Error parsing Drive URL:', e);
            return url;
        }
    }

    // Auto-scrolling logic
    useEffect(() => {
        if (displayData.length <= 1) return;

        const timer = setInterval(() => {
            if (activeIndex >= displayData.length - 1) {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
                setActiveIndex(0);
            } else {
                flatListRef.current?.scrollToIndex({
                    index: activeIndex + 1,
                    animated: true,
                });
                setActiveIndex(activeIndex + 1);
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [activeIndex, displayData.length]);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.overlay}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={displayData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                keyExtractor={(item) => item.id}
            />

            {/* Pagination Dots */}
            {displayData.length > 1 && (
                <View style={styles.pagination}>
                    {displayData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === activeIndex ? '#FF751F' : '#E5E7EB',
                                    width: index === activeIndex ? 20 : 8
                                }
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        height: 200,
    },
    cardContainer: {
        width: screenWidth,
        height: 200,
        paddingHorizontal: 20,
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#E5E7EB',
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        width: '100%',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
});

export default ImageSlider;
