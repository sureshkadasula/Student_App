import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { request } from './api';

const AUTH_SESSION_KEY = 'auth_session';

const AuthService = {
    // Login and save session
    login: async (email, password) => {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success) {
            console.log(response.data);
            await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(response.data));
            return response.data;
        } else {
            throw new Error(response.error || 'Login failed');
        }
    },

    // Get stored session
    getSession: async () => {
        try {
            const session = await AsyncStorage.getItem(AUTH_SESSION_KEY);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.log('Error reading session:', error);
            return null;
        }
    },

    // Verify token
    verifyToken: async (token) => {
        console.log(' Verifying token...');
        const response = await request('/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.success) {
            // Only update session if we got a valid token back, or merge with existing
            if (response.data && response.data.token) {
                await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(response.data));
            }

            // Fetch student profile details
            if (response.data.user && response.data.user.id) {
                const profileResponse = await request(`/users/students/${response.data.user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (profileResponse.success) {
                    await AsyncStorage.setItem('student_profile', JSON.stringify(profileResponse.data));
                }
            }

            return response.data;
        } else {
            // Explicit auth failure (401/403) or network error handled by request returning success:false
            console.log('❌ Token verification failed:', response.error);

            // If it's a network error (status 0), we might want to throw to keep the user on the current screen instead of logging out?
            // The original code threw 'Network request failed' to avoid logout on network error.
            if (response.status === 0) {
                throw new Error('Network request failed');
            }
            return null;
        }
    },

    // Logout
    logout: async () => {
        try {
            await AsyncStorage.removeItem(AUTH_SESSION_KEY);
        } catch (error) {
            console.log('Error logging out:', error);
        }
    },
};

export default AuthService;
