import apiClient from './apiClient';

export interface DocumentItem {
    _id: string;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

export const documentService = {
    getDocuments: async (): Promise<DocumentItem[]> => {
        const response = await apiClient.get('/documents');
        return response.data;
    },

    createDocument: async (data: Omit<DocumentItem, '_id'>): Promise<DocumentItem> => {
        const response = await apiClient.post('/documents', data);
        return response.data;
    },

    updateDocument: async (id: string, data: Partial<DocumentItem>): Promise<DocumentItem> => {
        const response = await apiClient.put(`/documents/${id}`, data);
        return response.data;
    },

    deleteDocument: async (id: string): Promise<void> => {
        await apiClient.delete(`/documents/${id}`);
    }
};
