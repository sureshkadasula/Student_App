import api from './api';

const GalleryService = {
    /**
     * Fetch all galleries for the user's branch
     * @returns {Promise<Array>} List of galleries
     */
    fetchGalleries: async () => {
        try {
            const response = await api.get('/galleries');
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to fetch galleries');
            }
        } catch (error) {
            console.error('GalleryService error:', error);
            throw error;
        }
    },
};

export default GalleryService;
