import { User, AuthState } from '../types';

const AUTH_KEY = 'project-manager-auth';
const USERS_KEY = 'project-manager-users';

// Mock users for demo
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user'
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'admin'
  }
];

export const authService = {
  login: (email: string, password: string): Promise<AuthState> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = authService.getUsers();
        const user = users.find(u => u.email === email);
        if (user && password === 'password') {
          const authState: AuthState = {
            isAuthenticated: true,
            user,
            token: 'mock-token-' + Date.now()
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
          resolve(authState);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  register: (name: string, email: string, password: string): Promise<AuthState> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = authService.getUsers();
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('Email already exists'));
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user'
        };

        const authState: AuthState = {
          isAuthenticated: true,
          user: newUser,
          token: 'mock-token-' + Date.now()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
        resolve(authState);
      }, 1000);
    });
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentAuth: (): AuthState | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(stored);
  },

  addUser: (userData: Omit<User, 'id'>): User => {
    const users = authService.getUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>): User | null => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  },

  deleteUser: (id: string): boolean => {
    const users = authService.getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    if (filteredUsers.length === users.length) return false;
    
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    return true;
  }
};