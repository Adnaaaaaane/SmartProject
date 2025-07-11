import React from 'react';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { User, Mail, Shield, CheckSquare, FolderOpen } from 'lucide-react';

export const Users: React.FC = () => {
  const users = authService.getUsers();
  const projects = dataService.getProjects();
  const tasks = dataService.getTasks();

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    const userProjects = projects.filter(project => project.ownerId === userId);
    const completedTasks = userTasks.filter(task => task.status === 'done').length;
    
    return {
      totalTasks: userTasks.length,
      completedTasks,
      totalProjects: userProjects.length,
      completionRate: userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0
    };
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <p className="text-gray-600">Manage users and view their performance</p>
      </div>

      {/* Users Grid */}
      <div className="grid grid-2">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          
          return (
            <div key={user.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Shield size={16} />
                    <span className={`status-badge ${user.role === 'admin' ? 'priority-high' : 'priority-medium'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckSquare size={16} />
                    <span className="text-sm text-gray-600">Tasks</span>
                  </div>
                  <div className="text-xl font-bold">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-600">
                    {stats.completedTasks} completed
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FolderOpen size={16} />
                    <span className="text-sm text-gray-600">Projects</span>
                  </div>
                  <div className="text-xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600">owned</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium">{stats.completionRate.toFixed(0)}%</span>
                </div>
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '4px', 
                  height: '8px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    backgroundColor: stats.completionRate >= 70 ? '#16a34a' : stats.completionRate >= 40 ? '#f59e0b' : '#dc2626',
                    width: `${stats.completionRate}%`, 
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card mt-4">
        <h3 className="font-bold mb-4">Recent Task Assignments</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter(task => task.assignedTo)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const user = users.find(u => u.id === task.assignedTo);
                  
                  return (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{project?.name || 'Unknown'}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td>
                        {task.dueDate ? (
                          new Date(task.dueDate).toLocaleDateString()
                        ) : (
                          <span className="text-gray-400">No due date</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};