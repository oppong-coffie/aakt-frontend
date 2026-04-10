import apiClient from './apiClient';

export interface BizInfraItem {
    _id: string;
    category: 'skillset' | 'network' | 'intel' | 'capital' | 'reach';
    name: string;
    description?: string;
    imageUrl?: string;
}

export const bizInfraService = {
    getItems: async (category: string): Promise<BizInfraItem[]> => {
        const response = await apiClient.get(`/bizinfra/${category}`);
        return response.data;
    },

    createItem: async (category: string, data: Partial<BizInfraItem>): Promise<BizInfraItem> => {
        const response = await apiClient.post(`/bizinfra/${category}`, data);
        return response.data;
    },

    updateItem: async (id: string, data: Partial<BizInfraItem>): Promise<BizInfraItem> => {
        const response = await apiClient.put(`/bizinfra/${id}`, data);
        return response.data;
    },

    deleteItem: async (id: string): Promise<void> => {
        await apiClient.delete(`/bizinfra/${id}`);
    }
};
