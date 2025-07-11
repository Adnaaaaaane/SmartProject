import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { Filter, User, Calendar, Clock } from 'lucide-react';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState(dataService.getTasks());
  const [projects] = useState(dataService.getProjects());
  const [users] = useState(authService.getUsers());
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all',
    assignedTo: 'all'
  });

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.project !== 'all' && task.projectId !== filters.project) return false;
    if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) return false;
    return true;
  });

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    dataService.updateTask(taskId, { status: newStatus });
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        <p className="text-gray-600">Manage and track all tasks across projects</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h3 className="font-bold">Filters</h3>
        </div>
        
        <div className="grid grid-4 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="form-label">Project</label>
            <select
              className="form-select"
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Assigned To</label>
            <select
              className="form-select"
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Summary */}
      <div className="grid grid-4 mb-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredTasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'todo').length}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'in-progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'done').length}</div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                    </div>
                  </td>
                  <td>
                    <Link 
                      to={`/projects/${task.projectId}`} 
                      style={{ color: '#2563eb', textDecoration: 'none' }}
                    >
                      {getProjectName(task.projectId)}
                    </Link>
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                      className="form-select"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{getUserName(task.assignedTo || '')}</span>
                    </div>
                  </td>
                  <td>
                    {task.dueDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span style={{ color: isOverdue(task.dueDate) ? '#dc2626' : 'inherit' }}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No due date</span>
                    )}
                  </td>
                  <td>
                    <Link 
                      to={`/projects/${task.projectId}`} 
                      className="btn btn-outline btn-sm"
                    >
                      View Project
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};