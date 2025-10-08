import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setError(result.message);
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center 
		bg-gradient-to-br from-purple-600 to-pink-500"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <form
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 space-y-6 relative border border-white/30"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <h2 className="text-3xl font-bold text-white">Weekly Wise</h2>
          <Sparkles className="w-8 h-8 text-yellow-300" />
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm text-white p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 backdrop-blur-sm text-white p-3 rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value.trim() })
              }
              required
              className="w-full p-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full p-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-opacity-90 transform hover:-translate-y-0.5 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : "Login"}
        </button>

        <p className="text-sm text-center text-white/80">
          {message || "Enter your email and password to continue"}
        </p>
      </form>
    </div>
  );
};

export default Login;
