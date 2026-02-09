import { request } from './api';

export const HolidayService = {
    /**
     * Fetch holidays for a given date range
     * @param {string} [startDate] - Optional start date (YYYY-MM-DD)
     * @param {string} [endDate] - Optional end date (YYYY-MM-DD)
     * @returns {Promise<Array>} - List of holidays
     */
    getHolidays: async (startDate, endDate) => {
        let endpoint = '/holidays';
        const params = new URLSearchParams();

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }

        const response = await request(endpoint, {
            method: 'GET',
        });
        console.log("Hssoliday Response", response);
        if (response.success) {
            console.log(response.data);
            return response.data;
        } else {
            throw new Error(response.error || 'Failed to fetch holidays');
        }
    },
};
