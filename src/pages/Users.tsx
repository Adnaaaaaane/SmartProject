import React, { useState } from 'react';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { User, Mail, Shield, CheckSquare, FolderOpen, Plus, Edit, Trash2, X } from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState(authService.getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });

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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = authService.addUser(formData);
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', role: 'user' });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = authService.updateUser(editingUser.id, formData);
    if (updatedUser) {
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
    }
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user' });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      const success = authService.deleteUser(userId);
      if (success) {
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'user' });
    setEditingUser(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Membres</h1>
          <p className="text-gray-600">Gérer les utilisateurs et voir leurs performances</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Ajouter un Membre
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-2">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          
          return (
            <div key={user.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
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
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckSquare size={16} />
                    <span className="text-sm text-gray-600">Tâches</span>
                  </div>
                  <div className="text-xl font-bold">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-600">
                    {stats.completedTasks} terminées
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FolderOpen size={16} />
                    <span className="text-sm text-gray-600">Projets</span>
                  </div>
                  <div className="text-xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600">possédés</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Taux de Completion</span>
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
        <h3 className="font-bold mb-4">Assignations de Tâches Récentes</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Projet</th>
                <th>Assigné à</th>
                <th>Statut</th>
                <th>Date d'échéance</th>
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
                      <td>{project?.name || 'Inconnu'}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{user?.name || 'Inconnu'}</span>
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
                          <span className="text-gray-400">Pas de date</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
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
              <div className="flex justify-between items-center">
                <h3 className="card-title">Ajouter un Nouveau Membre</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Ajouter le Membre
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
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
              <div className="flex justify-between items-center">
                <h3 className="card-title">Modifier le Membre</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Mettre à Jour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};