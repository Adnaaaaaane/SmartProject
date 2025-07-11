import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, User } from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState(dataService.getProjects().find(p => p.id === id));
  const [tasks, setTasks] = useState(dataService.getTasksByProject(id || ''));
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignedTo: '',
    dueDate: ''
  });

  const users = authService.getUsers();

  if (!project) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link to="/projects" className="btn btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = dataService.addTask({
      ...formData,
      projectId: project.id,
      status: 'todo'
    });
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setFormData({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    dataService.updateTask(taskId, { status: newStatus });
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dataService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  };

  const stats = getTaskStats();

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/projects" className="btn btn-outline">
          <ArrowLeft size={20} />
          Back to Projects
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-4 mb-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.progress.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold">
              <span className={`status-badge status-${project.status}`}>
                {project.status.replace('-', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-4">
        <h3 className="font-bold mb-2">Project Progress</h3>
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px', 
          height: '20px', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            backgroundColor: '#16a34a', 
            width: `${stats.progress}%`, 
            height: '100%',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {stats.completed} of {stats.total} tasks completed
        </div>
      </div>

      {/* Task Management */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="card-title">Tasks</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`btn btn-sm ${filter === 'todo' ? 'btn-primary' : 'btn-outline'}`}
          >
            To Do ({tasks.filter(t => t.status === 'todo').length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`btn btn-sm ${filter === 'in-progress' ? 'btn-primary' : 'btn-outline'}`}
          >
            In Progress ({tasks.filter(t => t.status === 'in-progress').length})
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`btn btn-sm ${filter === 'done' ? 'btn-primary' : 'btn-outline'}`}
          >
            Done ({tasks.filter(t => t.status === 'done').length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => {
            const assignedUser = users.find(u => u.id === task.assignedTo);
            return (
              <div key={task.id} className="card" style={{ marginBottom: 0 }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{task.title}</h4>
                  <div className="flex gap-2">
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
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2">{task.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`status-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  {assignedUser && (
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{assignedUser.name}</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
            <div className="card-header">
              <h3 className="card-title">Add New Task</h3>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  className="form-select"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};