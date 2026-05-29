import apiClient from './apiClient';

export interface Contact {
    _id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    avatar?: string;
    imageUrl?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const contactService = {
    getContacts: async (): Promise<Contact[]> => {
        const response = await apiClient.get('/contacts');
        return response.data;
    },

    createContact: async (data: Omit<Contact, '_id'>): Promise<Contact> => {
        const response = await apiClient.post('/contacts', data);
        return response.data;
    },

    updateContact: async (id: string, data: Partial<Contact>): Promise<Contact> => {
        const response = await apiClient.put(`/contacts/${id}`, data);
        return response.data;
    },

    deleteContact: async (id: string): Promise<void> => {
        await apiClient.delete(`/contacts/${id}`);
    }
};
