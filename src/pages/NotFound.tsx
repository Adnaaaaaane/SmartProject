import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card text-center" style={{ maxWidth: '500px' }}>
        <div style={{ fontSize: '96px', fontWeight: 'bold', color: '#2563eb', marginBottom: '16px' }}>
          404
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            <Home size={20} />
            Go to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};