import apiClient from './apiClient';

export interface CapitalItem {
    _id: string;
    source: string;
    amount: number;
    status: string;
    geography?: string;
    thesis?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const capitalService = {
    getCapitalItems: async (): Promise<CapitalItem[]> => {
        const response = await apiClient.get('/capital');
        return response.data;
    },

    createCapitalItem: async (data: Omit<CapitalItem, '_id'>): Promise<CapitalItem> => {
        const response = await apiClient.post('/capital', data);
        return response.data;
    },

    updateCapitalItem: async (id: string, data: Partial<CapitalItem>): Promise<CapitalItem> => {
        const response = await apiClient.put(`/capital/${id}`, data);
        return response.data;
    },

    updateCapitalStatus: async (id: string, status: string): Promise<CapitalItem> => {
        const response = await apiClient.patch(`/capital/${id}/status`, { status });
        return response.data;
    },

    deleteCapitalItem: async (id: string): Promise<void> => {
        await apiClient.delete(`/capital/${id}`);
    }
};
