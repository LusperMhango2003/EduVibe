import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = (event) => {
      console.log('Auth expired event received');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [navigate]);
};
