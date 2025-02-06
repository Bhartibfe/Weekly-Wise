import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { AnimatedBackground } from 'animated-backgrounds';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const result = await login(credentials);

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError(result.message);
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      {/* Animated Background */}
      <AnimatedBackground animationName="hyperspeed" style={{ zIndex: -1 }} />

      <form
        className="bg-[#31363F] p-8 rounded-lg shadow-md w-80 space-y-6 relative"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-[#EEEEEE]">
          Login to Weekly Wise
        </h2>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value.trim() })
            }
            required
            className="w-full p-2 bg-[#222831] border border-[#76ABAE] rounded text-[#EEEEEE] placeholder-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
          />

          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
            className="w-full p-2 bg-[#222831] border border-[#76ABAE] rounded text-[#EEEEEE] placeholder-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 bg-[#76ABAE] text-[#222831] font-semibold rounded hover:bg-[#EEEEEE] hover:text-[#222831] transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Login'}
        </button>

        <p className="text-sm text-center text-[#EEEEEE]">
          {message || 'Enter your email and password to continue'}
        </p>
      </form>
    </div>
  );
};

export default Login;
