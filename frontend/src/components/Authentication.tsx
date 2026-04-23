import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin' | 'staff';
  department: string;
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthenticationProps {
  onAuthChange?: (authState: AuthState) => void;
}

export default function Authentication({ onAuthChange }: AuthenticationProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    onAuthChange?.(authState);
  }, [authState, onAuthChange]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setAuthState(prev => ({
        ...prev,
        error: 'Please enter email and password'
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock authentication API call
      const mockUsers = [
        {
          id: 1,
          email: 'admin@campus.edu',
          name: 'Admin User',
          role: 'admin' as const,
          department: 'IT Administration',
          avatar: 'https://picsum.photos/seed/admin/200/200',
          isActive: true
        },
        {
          id: 2,
          email: 'john.doe@campus.edu',
          name: 'John Doe',
          role: 'student' as const,
          department: 'Computer Science',
          avatar: 'https://picsum.photos/seed/john/200/200',
          isActive: true
        },
        {
          id: 3,
          email: 'jane.smith@campus.edu',
          name: 'Jane Smith',
          role: 'faculty' as const,
          department: 'Engineering',
          avatar: 'https://picsum.photos/seed/jane/200/200',
          isActive: true
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user = mockUsers.find(u => u.email === formData.email);
      
      if (user && formData.password === 'password123') {
        const token = 'mock-jwt-token-' + Date.now();
        
        if (rememberMe) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
        }
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        setFormData({
          email: '',
          password: '',
          name: '',
          department: '',
          confirmPassword: ''
        });
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid email or password'
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Login failed. Please try again.'
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name || !formData.department) {
      setAuthState(prev => ({
        ...prev,
        error: 'Please fill in all required fields'
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAuthState(prev => ({
        ...prev,
        error: 'Passwords do not match'
      }));
      return;
    }

    if (formData.password.length < 8) {
      setAuthState(prev => ({
        ...prev,
        error: 'Password must be at least 8 characters long'
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser: User = {
        id: Date.now(),
        email: formData.email,
        name: formData.name,
        role: 'student' as const,
        department: formData.department,
        avatar: `https://picsum.photos/seed/${formData.name}/200/200`,
        isActive: true
      };

      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      setFormData({
        email: '',
        password: '',
        name: '',
        department: '',
        confirmPassword: ''
      });
    } catch (error) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'faculty':
        return 'text-purple-600 bg-purple-100';
      case 'staff':
        return 'text-blue-600 bg-blue-100';
      case 'student':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'faculty':
        return '👨‍🏫';
      case 'staff':
        return '👨‍💼';
      case 'student':
        return '👨‍🎓';
      default:
        return '👤';
    }
  };

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="text-6xl">
              {authState.user.avatar ? (
                <img 
                  src={authState.user.avatar} 
                  alt={authState.user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{authState.user.name}</h2>
              <p className="text-gray-600">{authState.user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(authState.user.role)}`}>
                  <span className="mr-1">{getRoleIcon(authState.user.role)}</span>
                  {authState.user.role.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">• {authState.user.department}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎫</div>
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Support Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Profile Complete</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors">
                📅 View Bookings
              </button>
              <button className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors">
                🏢 Manage Resources
              </button>
              <button className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors">
                📊 View Analytics
              </button>
              <button className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700 transition-colors">
                ⚙️ Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Campus Portal</h1>
          <p className="text-gray-600">Manage your campus resources efficiently</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Toggle between Login and Register */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLoginMode 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isLoginMode 
                    ? 'bg-white text-gray-900 shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Message */}
          {authState.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {authState.error}
            </div>
          )}

          {/* Login/Register Form */}
          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@campus.edu"
                required
              />
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="•••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="•••••••••"
                  required
                />
              </div>
            )}

            {isLoginMode && (
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {authState.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLoginMode ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1">
                <p>Admin: admin@campus.edu / password123</p>
                <p>Student: john.doe@campus.edu / password123</p>
                <p>Faculty: jane.smith@campus.edu / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
