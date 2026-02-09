
import { request } from './api';
import AuthService from './AuthService';

const getHeaders = async () => {
    const session = await AuthService.getSession();
    if (session && session.token) {
        return { 'Authorization': `Bearer ${session.token}` };
    }
    return {};
};

const AdminRequestService = {
    // Get requests for a specific student
    getMyRequests: async (studentId) => {
        // Current backend endpoint supports filtering by requester_id
        // GET /api/admin-service/admin-requests?requester_id=...
        const headers = await getHeaders();
        return await request(`/admin-service/admin-requests?requester_id=${studentId}`, { headers });
    },

    // Create a new request
    createRequest: async (requestData) => {
        // POST /api/admin-service/admin-requests
        const headers = await getHeaders();
        return await request('/admin-service/admin-requests', {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData),
        });
    },
};

export default AdminRequestService;
