import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { FolderOpen, CheckSquare, Users, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const projects = dataService.getProjects();
  const tasks = dataService.getTasks();
  const users = authService.getUsers();

  // Statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const tasksInProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  // Chart data
  const taskStatusData = [
    { name: 'To Do', value: todoTasks, color: '#f59e0b' },
    { name: 'In Progress', value: tasksInProgress, color: '#2563eb' },
    { name: 'Done', value: completedTasks, color: '#16a34a' }
  ];

  const projectStatusData = [
    { name: 'Active', count: activeProjects },
    { name: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { name: 'On Hold', count: projects.filter(p => p.status === 'on-hold').length }
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your projects and tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 mb-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{totalProjects}</p>
            </div>
            <FolderOpen size={32} style={{ color: '#2563eb' }} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
            <Clock size={32} style={{ color: '#f59e0b' }} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <CheckSquare size={32} style={{ color: '#16a34a' }} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users size={32} style={{ color: '#6b7280' }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-4">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Tasks</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <tr key={task.id}>
                    <td>
                      <Link to={`/projects/${task.projectId}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {task.title}
                      </Link>
                    </td>
                    <td>{project?.name || 'Unknown'}</td>
                    <td>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
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