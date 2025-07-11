import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  LogOut, 
  User 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-bold">Project Manager</h2>
          <div className="flex items-center gap-2 mt-4">
            <User size={20} />
            <div>
              <div className="font-medium">{authState.user?.name}</div>
              <div className="text-sm text-gray-600">{authState.user?.role}</div>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item flex items-center gap-3 ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="nav-item flex items-center gap-3 w-full text-left"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};