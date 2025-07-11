import { Project, Task } from '../types';

const PROJECTS_KEY = 'project-manager-projects';
const TASKS_KEY = 'project-manager-tasks';

// Initial mock data
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    deadline: '2024-03-15',
    status: 'active',
    createdAt: '2024-01-01',
    ownerId: '1'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop iOS and Android mobile application',
    deadline: '2024-04-20',
    status: 'active',
    createdAt: '2024-01-15',
    ownerId: '1'
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 marketing campaign planning and execution',
    deadline: '2024-02-28',
    status: 'completed',
    createdAt: '2023-12-01',
    ownerId: '2'
  }
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframes and mockups for homepage',
    status: 'done',
    priority: 'high',
    projectId: '1',
    assignedTo: '2',
    createdAt: '2024-01-02',
    dueDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Develop Frontend',
    description: 'Implement responsive frontend components',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    assignedTo: '2',
    createdAt: '2024-01-05',
    dueDate: '2024-02-01'
  },
  {
    id: '3',
    title: 'Setup Database',
    description: 'Configure and setup database schema',
    status: 'todo',
    priority: 'medium',
    projectId: '2',
    assignedTo: '1',
    createdAt: '2024-01-16',
    dueDate: '2024-02-05'
  },
  {
    id: '4',
    title: 'API Development',
    description: 'Develop REST API endpoints',
    status: 'todo',
    priority: 'high',
    projectId: '2',
    createdAt: '2024-01-18',
    dueDate: '2024-02-15'
  },
  {
    id: '5',
    title: 'Social Media Strategy',
    description: 'Plan social media content and campaigns',
    status: 'done',
    priority: 'medium',
    projectId: '3',
    assignedTo: '2',
    createdAt: '2023-12-05',
    dueDate: '2023-12-20'
  }
];

export const dataService = {
  // Projects
  getProjects: (): Project[] => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (!stored) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(stored);
  },

  addProject: (project: Omit<Project, 'id' | 'createdAt'>): Project => {
    const projects = dataService.getProjects();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = dataService.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return projects[index];
  },

  deleteProject: (id: string): boolean => {
    const projects = dataService.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filteredProjects));
    
    // Also delete related tasks
    const tasks = dataService.getTasks();
    const filteredTasks = tasks.filter(t => t.projectId !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    
    return filteredProjects.length < projects.length;
  },

  // Tasks
  getTasks: (): Task[] => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (!stored) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
      return initialTasks;
    }
    return JSON.parse(stored);
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const tasks = dataService.getTasks();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>): Task | null => {
    const tasks = dataService.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  deleteTask: (id: string): boolean => {
    const tasks = dataService.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    return filteredTasks.length < tasks.length;
  },

  getTasksByProject: (projectId: string): Task[] => {
    return dataService.getTasks().filter(task => task.projectId === projectId);
  }
};