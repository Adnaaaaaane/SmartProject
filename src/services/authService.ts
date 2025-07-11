import { User, AuthState } from '../types';

const AUTH_KEY = 'project-manager-auth';

// Mock users for demo
const mockUsers: User[] = [
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
  }
];

export const authService = {
  login: (email: string, password: string): Promise<AuthState> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
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
        const existingUser = mockUsers.find(u => u.email === email);
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
    return mockUsers;
  }
};