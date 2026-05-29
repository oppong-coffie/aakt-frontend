import apiClient from './apiClient';

export interface WhiteboardItem {
    _id: string;
    title: string;
    elements: any[];
    createdAt?: string;
    updatedAt?: string;
}

export const whiteboardService = {
    getWhiteboards: async (): Promise<WhiteboardItem[]> => {
        const response = await apiClient.get('/whiteboard');
        return response.data;
    },

    createWhiteboard: async (data: Omit<WhiteboardItem, '_id'>): Promise<WhiteboardItem> => {
        const response = await apiClient.post('/whiteboard', data);
        return response.data;
    },

    updateWhiteboard: async (id: string, data: Partial<WhiteboardItem>): Promise<WhiteboardItem> => {
        const response = await apiClient.put(`/whiteboard/${id}`, data);
        return response.data;
    },

    deleteWhiteboard: async (id: string): Promise<void> => {
        await apiClient.delete(`/whiteboard/${id}`);
    }
};
