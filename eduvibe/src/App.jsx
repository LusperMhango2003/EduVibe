import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, UnauthorizedPage } from './components/ProtectedRoute';
import Recordings from './components/Recordings';
import Login from './components/loginpage';
import { USER_ROLES } from './utils/permissions';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import SignUp from './components/signupage';

const LoadingPage = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

function AppContent() {
  useAuthRedirect();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/signup" element={<SignUp />} />
      



      <Route
        path="/recordings"
        element={
          <ProtectedRoute
            element={<Recordings />}
            requiredRoles={[USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]}
          />
        }
      />

      <Route path="/" element={isAuthenticated ? <Navigate to="/recordings" replace /> : <Navigate to="/login" replace />} />

      <Route path="*" element={isAuthenticated ? <Navigate to="/recordings" replace /> : <Navigate to="/login" replace />} />
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