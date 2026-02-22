import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
    Linking,
    Alert,
    StatusBar,
} from 'react-native';
import GalleryService from '../services/GalleryService';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const IMAGE_SIZE = (width - 60) / COLUMN_COUNT;

const DEFAULT_FOLDER_IMAGE = 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const getDriveThumbnail = (url) => {
    if (!url) return DEFAULT_FOLDER_IMAGE;
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        return `https://lh3.googleusercontent.com/u/0/d/${fileId}=w400-h400-p`;
    }
    return DEFAULT_FOLDER_IMAGE;
};

export default function GalleryScreen({ navigation }) {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const data = await GalleryService.fetchGalleries();
            setGalleries(data || []);
        } catch (error) {
            console.error('Error loading galleries:', error);
            Alert.alert('Error', 'Could not load galleries. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGalleries();
    }, []);

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

    const renderImageItem = item => {
        const thumbnailUrl = getDriveThumbnail(item.drive_link);

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.imageContainer}
                onPress={() => handleOpenGallery(item)}
            >
                <Image
                    source={{ uri: thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                    <Text style={styles.imageTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.imageDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={styles.linkIconContainer}>
                    <Text style={styles.linkIconText}>Open Drive ↗</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF751F" />
                <Text style={styles.loadingText}>Loading galleries...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>School Gallery</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.galleryGrid}
                showsVerticalScrollIndicator={false}
            >
                {galleries.length > 0 ? (
                    galleries.map(renderImageItem)
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No gallery items found.</Text>
                        <TouchableOpacity style={styles.refreshButton} onPress={fetchGalleries}>
                            <Text style={styles.refreshButtonText}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ff751f',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#6b7280',
    },
    noDataContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 100,
    },
    noDataText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: '#FF751F',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    galleryGrid: {
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE + 60,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    thumbnail: {
        width: '100%',
        height: IMAGE_SIZE,
    },
    imageOverlay: {
        padding: 10,
    },
    imageTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1f2937',
    },
    imageDate: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 3,
    },
    linkIconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    linkIconText: {
        fontSize: 10,
        color: '#FF751F',
        fontWeight: '700',
    },
});
