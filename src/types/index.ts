export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  ownerId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assignedTo?: string;
  createdAt: string;
  dueDate?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}