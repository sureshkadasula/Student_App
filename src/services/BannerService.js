import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from './api';

/**
 * Get all active banners for the branch
 * @returns {Promise<Array>} List of banner objects
 */
export const getBanners = async () => {
    try {
        const session = await AsyncStorage.getItem('auth_session');
        if (!session) return [];

        const { token } = JSON.parse(session);
        if (!token) return [];

        // Endpoint configured in Gateway: /api/banners
        const response = await request('/banners', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.success && response.data) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.log('Error fetching banners:', error);
        return [];
    }
};

const BannerService = {
    getBanners
};

export default BannerService;
