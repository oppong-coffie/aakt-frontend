import apiClient from './apiClient';

// ============ BIZ CONCEPT ============
export interface BizConcept {
    product: string;
    customer: string;
    goToMarket: GoToMarketStrategy[];
    culture: string;
}

export type GoToMarketStrategy = 
    | 'online_store'
    | 'direct_sales'
    | 'retail'
    | 'subscription'
    | 'freemium'
    | 'marketplace'
    | 'consulting'
    | 'partnerships';

// ============ AGENTS/EMPLOYEES ============
export interface Agent {
    id: string;
    name: string;
    kind: 'human' | 'ai' | 'software';
    title: string;
    email: string;
    timezone: string;
}

export interface AgentsContainer {
    agents: Agent[];
}

// ============ PERMISSIONS ============
export interface Permission {
    agentId: string;
    level: 'view' | 'edit' | 'admin';
}

// ============ BASE NODE ============
export interface BaseNode {
    id: string;
    name: string;
    parentId?: string | null;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    permissions: Permission[];
}

// ============ FOLDER ============
export interface Folder extends BaseNode {
    type: 'folder';
    children: (Folder | Project | Process | Block)[];
}

// ============ PROJECT ============
export interface ProjectTeamMember {
    agentId: string;
    role: 'manager' | 'employee';
}

export interface ProjectTimeline {
    start?: string;
    finish?: string;
    flexibility: 'low' | 'medium' | 'high';
}

export interface ProjectReality {
    team: ProjectTeamMember[];
    budget?: number;
    timeline: ProjectTimeline;
    constraints: string[];
}

export interface ProjectScope {
    mustHave: string[];
    niceToHave: string[];
    wontHave: string[];
}

export interface ProjectGoal {
    objective?: string;
    deliverables: string[];
    successMetrics: string[];
    scope: ProjectScope;
}

export interface Project extends BaseNode {
    _id: string; // Backend uses _id
    projectName: string;
    projectDescription?: string;
    businessId: string;
    type: 'project';
    reality: ProjectReality;
    goal: ProjectGoal;
    status: 'active' | 'paused' | 'complete';
    children: Phase[];
}

// ============ PHASE ============
export interface Phase extends BaseNode {
    _id: string;
    phaseName: string;
    phaseDescription?: string;
    projectId: string;
    type: 'phase';
    order: number;
    status: 'locked' | 'active' | 'complete';
    children: (Folder | Process | Block)[];
}

// ============ PROCESS ============
export interface TaskStep {
    type: 'command' | 'deliverable' | 'feedback';
    content?: string;
    blockId?: string;
    reviewerAgentId?: string;
    onApprove?: string;
    onReject?: string;
}

export interface Task {
    _id: string;
    taskName: string;
    parentId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    permissions: Permission[];
    agentIds: string[];
    status: 'pending' | 'running' | 'waiting_feedback' | 'complete' | 'error';
    mode: 'predefined' | 'guided' | 'emergent';
    steps: TaskStep[];
}

export interface Process extends BaseNode {
    _id: string;
    processName: string;
    businessId: string;
    projectId: string;
    phaseId: string;
    type: 'process';
    trigger: 'manual' | 'scheduled' | 'automatic';
    schedule?: string;
    status: 'idle' | 'running' | 'complete' | 'error';
    mode: 'predefined' | 'guided' | 'emergent';
    children: Task[];
}

// ============ BLOCK ============
export interface Block extends BaseNode {
    _id: string;
    kind: 'document' | 'spreadsheet' | 'database' | 'metric' | 'dashboard' | 'file';
    contentUrl?: string;
    summary?: string;
}

// ============ PORTFOLIO ============
export interface Portfolio {
    id: string;
    category: 'saas' | 'ecommerce';
    bizConcept: BizConcept;
    agents: AgentsContainer;
    tree: (Folder | Project | Process | Block)[];
}

// ============ LEGACY SUPPORT ============
export interface PortfolioItem {
    _id: string;
    itemType: 'department' | 'operation' | 'project' | 'process' | 'block';
    parentId?: string | null;
    category: 'saas' | 'ecommerce';
    name: string;
    description?: string;
    order: number;
}

// ============ PORTFOLIO SERVICE ============
export const portfolioService = {
    // Portfolio CRUD
    getPortfolio: async (portfolioId: string): Promise<Portfolio> => {
        const response = await apiClient.get(`/portfolio/${portfolioId}`);
        return response.data;
    },

    createPortfolio: async (data: Partial<Portfolio>): Promise<Portfolio> => {
        const response = await apiClient.post(`/portfolio`, data);
        return response.data;
    },

    updatePortfolio: async (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}`, data);
        return response.data;
    },

    deletePortfolio: async (portfolioId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}`);
    },

    getAllPortfolios: async (): Promise<Portfolio[]> => {
        const response = await apiClient.get(`/portfolio`);
        return response.data;
    },

    // BizConcept
    updateBizConcept: async (portfolioId: string, concept: BizConcept): Promise<BizConcept> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/concept`, concept);
        return response.data;
    },

    getBizConcept: async (portfolioId: string): Promise<BizConcept> => {
        const response = await apiClient.get(`/portfolio/${portfolioId}/concept`);
        return response.data;
    },

    // Agents/Employees
    getAgents: async (portfolioId: string): Promise<Agent[]> => {
        const response = await apiClient.get(`/portfolio/${portfolioId}/agents`);
        return response.data;
    },

    addAgent: async (portfolioId: string, agent: Partial<Agent>): Promise<Agent> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/agent`, agent);
        return response.data;
    },

    updateAgent: async (portfolioId: string, agentId: string, data: Partial<Agent>): Promise<Agent> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/agent/${agentId}`, data);
        return response.data;
    },

    deleteAgent: async (portfolioId: string, agentId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/agent/${agentId}`);
    },

    // Folders
    createFolder: async (portfolioId: string, data: Partial<Folder>): Promise<Folder> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/folder`, data);
        return response.data;
    },

    updateFolder: async (portfolioId: string, folderId: string, data: Partial<Folder>): Promise<Folder> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/folder/${folderId}`, data);
        return response.data;
    },

    deleteFolder: async (portfolioId: string, folderId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/folder/${folderId}`);
    },

    // Projects
    createProject: async (portfolioId: string, data: Partial<Project>): Promise<Project> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/project`, data);
        return response.data;
    },

    updateProject: async (portfolioId: string, projectId: string, data: Partial<Project>): Promise<Project> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/project/${projectId}`, data);
        return response.data;
    },

    deleteProject: async (portfolioId: string, projectId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/project/${projectId}`);
    },

    getProject: async (portfolioId: string, projectId: string): Promise<Project> => {
        const response = await apiClient.get(`/portfolio/${portfolioId}/project/${projectId}`);
        return response.data;
    },

    // Phases
    createPhase: async (portfolioId: string, projectId: string, data: Partial<Phase>): Promise<Phase> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/project/${projectId}/phase`, data);
        return response.data;
    },

    updatePhase: async (portfolioId: string, projectId: string, phaseId: string, data: Partial<Phase>): Promise<Phase> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/project/${projectId}/phase/${phaseId}`, data);
        return response.data;
    },

    deletePhase: async (portfolioId: string, projectId: string, phaseId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/project/${projectId}/phase/${phaseId}`);
    },

    // Processes
    createProcess: async (portfolioId: string, data: Partial<Process>): Promise<Process> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/process`, data);
        return response.data;
    },

    updateProcess: async (portfolioId: string, processId: string, data: Partial<Process>): Promise<Process> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/process/${processId}`, data);
        return response.data;
    },

    deleteProcess: async (portfolioId: string, processId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/process/${processId}`);
    },

    // Tasks
    createTask: async (portfolioId: string, processId: string, data: Partial<Task>): Promise<Task> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/process/${processId}/task`, data);
        return response.data;
    },

    updateTask: async (portfolioId: string, processId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/process/${processId}/task/${taskId}`, data);
        return response.data;
    },

    deleteTask: async (portfolioId: string, processId: string, taskId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/process/${processId}/task/${taskId}`);
    },

    // Blocks
    createBlock: async (portfolioId: string, data: Partial<Block>): Promise<Block> => {
        const response = await apiClient.post(`/portfolio/${portfolioId}/block`, data);
        return response.data;
    },

    updateBlock: async (portfolioId: string, blockId: string, data: Partial<Block>): Promise<Block> => {
        const response = await apiClient.put(`/portfolio/${portfolioId}/block/${blockId}`, data);
        return response.data;
    },

    deleteBlock: async (portfolioId: string, blockId: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${portfolioId}/block/${blockId}`);
    },

    // Permissions
    updatePermissions: async (portfolioId: string, nodeId: string, permissions: Permission[]): Promise<void> => {
        await apiClient.put(`/portfolio/${portfolioId}/node/${nodeId}/permissions`, { permissions });
    },

    // Legacy methods for backward compatibility
    getItems: async (category: string, itemType: string, parentId?: string | null): Promise<PortfolioItem[]> => {
        const params = parentId !== undefined ? { parentId } : {};
        const response = await apiClient.get(`/portfolio/${category}/${itemType}`, { params });
        return response.data;
    },

    createItem: async (category: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
        const response = await apiClient.post(`/portfolio/${category}`, data);
        return response.data;
    },

    updateItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
        const response = await apiClient.put(`/portfolio/${id}`, data);
        return response.data;
    },

    deleteItem: async (id: string): Promise<void> => {
        await apiClient.delete(`/portfolio/${id}`);
    },

    reorderItems: async (items: { id: string, order: number }[]): Promise<void> => {
        await apiClient.patch(`/portfolio/reorder`, { items });
    }
};
