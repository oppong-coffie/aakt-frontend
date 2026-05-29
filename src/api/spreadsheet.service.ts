import apiClient from './apiClient';

export interface SpreadsheetItem {
    _id: string;
    title: string;
    workbookData: any;
    createdAt?: string;
    updatedAt?: string;
}

export const spreadsheetService = {
    getSpreadsheets: async (): Promise<SpreadsheetItem[]> => {
        const response = await apiClient.get('/spreadsheets');
        return response.data;
    },

    createSpreadsheet: async (data: Omit<SpreadsheetItem, '_id' | 'workbookData'> & { workbookData?: any }): Promise<SpreadsheetItem> => {
        const response = await apiClient.post('/spreadsheets', data);
        return response.data;
    },

    updateSpreadsheet: async (id: string, data: Partial<SpreadsheetItem>): Promise<SpreadsheetItem> => {
        const response = await apiClient.put(`/spreadsheets/${id}`, data);
        return response.data;
    },

    deleteSpreadsheet: async (id: string): Promise<void> => {
        await apiClient.delete(`/spreadsheets/${id}`);
    }
};
