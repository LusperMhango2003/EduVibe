import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/permissions';

export const ProtectedRoute = ({ element, requiredRoles = [], fallback = '/login' }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-brown-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  if (requiredRoles.length === 0) {
    return element;
  }

  if (hasRole(user?.role, requiredRoles)) {
    return element;
  }

  return <Navigate to={fallback} replace />;
};

export const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#211C37] mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You don't have permission to access this resource.</p>
        <a href="/dashboard" className="bg-[#FF4B00] text-white px-6 py-2 rounded-lg hover:bg-[#E63E00] transition">Go to Dashboard</a>
      </div>
    </div>
  );
};

export default ProtectedRoute;
