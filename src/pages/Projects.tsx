import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, Calendar, User, CheckSquare } from 'lucide-react';

export const Projects: React.FC = () => {
  const { authState } = useAuth();
  const [projects, setProjects] = useState(dataService.getProjects());
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    status: 'active' as const
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = dataService.addProject({
      ...formData,
      ownerId: authState.user?.id || '1'
    });
    setProjects([...projects, newProject]);
    setShowAddModal(false);
    setFormData({ name: '', description: '', deadline: '', status: 'active' });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      dataService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const getTaskCount = (projectId: string) => {
    return dataService.getTasksByProject(projectId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage your projects</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-3">
        {projects.map((project) => {
          const taskCount = getTaskCount(project.id);
          const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed';
          
          return (
            <div key={project.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{project.name}</h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span style={{ color: isOverdue ? '#dc2626' : 'inherit' }}>
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckSquare size={16} />
                  <span>{taskCount} tasks</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
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
              <h3 className="card-title">Add New Project</h3>
            </div>
            
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Create Project
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