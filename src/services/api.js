import { API_BASE_URL } from '../config/api';

/**
 * Standardized API Request Wrapper
 * @param {string} endpoint - API endpoint (e.g., '/auth/login') or full URL
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise<{success: boolean, data: any, error: string, status: number}>}
 */
export const request = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const contentType = response.headers.get('content-type');
        let data = null;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Fallback for non-JSON responses (e.g., HTML error pages)
            data = await response.text();
        }

        if (!response.ok) {
            // Handle non-2xx responses without throwing
            return {
                success: false,
                data: null,
                error: (data && data.error) || data || 'Request failed',
                status: response.status
            };
        }

        // Success case
        // Some APIs return { success: true, data: ... }, others just return valid data
        // We normalize this to { success: true, data: ... }
        return {
            success: true,
            data: (data && data.data) ? data.data : data, // Unwrap 'data' if nested
            error: null,
            status: response.status
        };

    } catch (error) {
        // Handle Network Errors (offline, server crash, DNS)
        console.warn(`[API] Request failed for ${url}:`, error.message);
        return {
            success: false,
            data: null,
            error: 'Network error or server unreachable. Please check your connection.',
            status: 0
        };
    }
};
