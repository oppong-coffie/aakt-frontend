import apiClient from './apiClient';

export interface FileItem {
    _id: string;
    name: string;
    url: string;
    size?: number;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const fileService = {
    getFiles: async (): Promise<FileItem[]> => {
        const response = await apiClient.get('/files');
        return response.data;
    },

    createFile: async (data: Omit<FileItem, '_id'>): Promise<FileItem> => {
        const response = await apiClient.post('/files', data);
        return response.data;
    },

    updateFile: async (id: string, data: Partial<FileItem>): Promise<FileItem> => {
        const response = await apiClient.put(`/files/${id}`, data);
        return response.data;
    },

    deleteFile: async (id: string): Promise<void> => {
        await apiClient.delete(`/files/${id}`);
    }
};
