import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        console.log('OAuthCallback - User data received:', userData);
        console.log('OAuthCallback - User role:', userData.role);
        localStorage.setItem('smartcampus_token', token);
        localStorage.setItem('smartcampus_user', JSON.stringify(userData));
        console.log('OAuthCallback - Stored user data:', JSON.parse(localStorage.getItem('smartcampus_user') || '{}'));
        
        // Redirect based on user role
        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}