import apiClient from './apiClient';

export interface SlideItem {
    _id: string;
    title: string;
    slides: Array<{
        id: string;
        content: string;
        notes?: string;
        background?: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export const slideService = {
    getSlideDecks: async (): Promise<SlideItem[]> => {
        const response = await apiClient.get('/slides');
        return response.data;
    },

    createSlideDeck: async (data: Omit<SlideItem, '_id'>): Promise<SlideItem> => {
        const response = await apiClient.post('/slides', data);
        return response.data;
    },

    updateSlideDeck: async (id: string, data: Partial<SlideItem>): Promise<SlideItem> => {
        const response = await apiClient.put(`/slides/${id}`, data);
        return response.data;
    },

    deleteSlideDeck: async (id: string): Promise<void> => {
        await apiClient.delete(`/slides/${id}`);
    }
};
