// screens/NotificationsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../services/api';
import AuthService from '../services/AuthService';

export default function NotificationsScreen({ navigation }) {
    const [studentId, setStudentId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'unread'
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadMessagesData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadMessagesData();
        }, [])
    );

    const loadMessagesData = async () => {
        try {
            setLoading(true);
            const session = await AuthService.getSession();

            if (session?.user?.userid) {
                setStudentId(session.user.userid);

                // Fetch notifications from backend for this student
                const response = await api.get(`/classes/students/my-notifications`, {
                    params: {
                        limit: 50,
                        student_id: session.user.userid
                    }
                });

                if (response.success) {
                    const formattedMessages = response.data.map(msg => ({
                        id: msg.id.toString(),
                        title: msg.title || 'No Title',
                        message: msg.content || '',
                        sender: msg.sender || 'Teacher',
                        type: 'notification',
                        priority: msg.priority || 'Medium',
                        isRead: msg.read,
                        date: msg.date ? msg.date.split('T')[0] : new Date().toISOString().split('T')[0],
                        time: msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                        category: 'academic' // Default to academic for now
                    }));
                    setMessages(formattedMessages);
                }
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredMessages = () => {
        return selectedTab === 'unread' ? messages.filter(msg => !msg.isRead) : messages;
    };

    const getCategoryTheme = (category) => {
        switch (category) {
            case 'academic': return { icon: '📚', color: '#3B82F6', bg: '#EFF6FF' };
            case 'events': return { icon: '📅', color: '#8B5CF6', bg: '#F5F3FF' };
            case 'finance': return { icon: '💰', color: '#10B981', bg: '#ECFDF5' };
            default: return { icon: '📢', color: '#F59E0B', bg: '#FFFBEB' };
        }
    };

    const handleMarkAsRead = async (message) => {
        if (!message.isRead) {
            try {
                await api.put(`/classes/students/notifications/${message.id}/read`, {
                    student_id: studentId
                });

                // Update local state
                setMessages(prev => prev.map(msg =>
                    msg.id === message.id ? { ...msg, isRead: true } : msg
                ));
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        // Navigate to details if you have a details screen
        // navigation.navigate('MessageDetails', { message });
    };

    const renderMessageItem = ({ item }) => {
        const theme = getCategoryTheme(item.category);
        return (
            <TouchableOpacity
                style={[styles.messageItem, !item.isRead && styles.unreadItem]}
                onPress={() => handleMarkAsRead(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
                    <Text style={styles.categoryIconText}>{theme.icon}</Text>
                </View>

                <View style={styles.messageMain}>
                    <View style={styles.messageHeader}>
                        <Text style={[styles.messageTitle, !item.isRead && styles.boldText]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.messageTime}>{item.date.split('-').slice(1).join('/')}</Text>
                    </View>

                    <Text style={styles.messageSender} numberOfLines={1}>{item.sender}</Text>
                    <Text style={styles.messagePreview} numberOfLines={2}>{item.message}</Text>
                </View>

                {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    const unreadCount = messages.filter(msg => !msg.isRead).length;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            {/* Clean Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Inbox</Text>
                    <Text style={styles.headerSubtitle}>Your notifications</Text>
                </View>
            </View>

            {/* Modern Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
                    onPress={() => setSelectedTab('all')}
                >
                    <Text style={[styles.tabLabel, selectedTab === 'all' && styles.activeTabLabel]}>Recents</Text>
                    {messages.length > 0 && (
                        <View style={styles.countBadge}><Text style={styles.countText}>{messages.length}</Text></View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'unread' && styles.activeTab]}
                    onPress={() => setSelectedTab('unread')}
                >
                    <Text style={[styles.tabLabel, selectedTab === 'unread' && styles.activeTabLabel]}>Unread</Text>
                    {unreadCount > 0 && (
                        <View style={[styles.countBadge, { backgroundColor: '#FF6B35' }]}><Text style={styles.countText}>{unreadCount}</Text></View>
                    )}
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator color="#FF6B35" size="large" />
                </View>
            ) : (
                <FlatList
                    data={getFilteredMessages()}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyTitle}>All caught up!</Text>
                            <Text style={styles.emptyText}>No {selectedTab === 'unread' ? 'unread ' : ''}messages at the moment.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    backButton: {
        marginRight: 12,
        padding: 8,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FF751F',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
        fontWeight: '500',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    activeTab: {
        backgroundColor: '#FF751F',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabLabel: {
        color: '#FFF',
    },
    countBadge: {
        marginLeft: 6,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
        backgroundColor: '#9CA3AF',
        minWidth: 18,
        alignItems: 'center',
    },
    countText: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 40,
    },
    messageItem: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#FFF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIconText: {
        fontSize: 22,
    },
    messageMain: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    messageTitle: {
        fontSize: 15,
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    boldText: {
        fontWeight: '700',
    },
    messageTime: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    messageSender: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
        marginBottom: 4,
    },
    messagePreview: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF6B35',
        marginLeft: 12,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyBox: {
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
