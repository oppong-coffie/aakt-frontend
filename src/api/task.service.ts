import apiClient from './apiClient';

export interface TaskItem {
    _id: string;
    title: string;
    description?: string;
    status: 'Todo' | 'In Progress' | 'Done';
    assignee?: string;
    portfolioItemId?: string;
    parentId?: string;
}

export const taskService = {
    getTasks: async (filters?: { portfolioItemId?: string, parentId?: string | null }): Promise<TaskItem[]> => {
        const response = await apiClient.get('/tasks', { params: filters });
        return response.data;
    },

    createTask: async (data: Partial<TaskItem>): Promise<TaskItem> => {
        const response = await apiClient.post('/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: Partial<TaskItem>): Promise<TaskItem> => {
        const response = await apiClient.put(`/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await apiClient.delete(`/tasks/${id}`);
    }
};
