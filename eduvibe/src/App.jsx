import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, UnauthorizedPage } from './components/ProtectedRoute';
import Recordings from './components/Recordings';
import { USER_ROLES } from './utils/permissions';
import { useAuthRedirect } from './hooks/useAuthRedirect';

const LoadingPage = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

function AppContent() {
  useAuthRedirect();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      {/* Public routes */}
      {/*<Route path="/login" element={<LoginPage />} />*/}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes */}
      <Route
        path="/recordings"
        element={
          <ProtectedRoute
            element={<Recordings />}
            requiredRoles={[USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]}
          />
        }
      />

      {/* Redirect root to recordings or login */}
      <Route path="/" element={<Navigate to="/recordings" replace />} />

      {/* Catch all - redirect to recordings */}
      <Route path="*" element={<Navigate to="/recordings" replace />} />
    </Routes>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;