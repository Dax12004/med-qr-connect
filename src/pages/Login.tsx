
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      
      // Get the current user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Redirect based on role - ensure we're using the navigate function
        if (user.role === "patient") {
          toast.success("Welcome to MediCard Patient Portal!");
          navigate("/patient/dashboard", { replace: true });
        } else if (user.role === "doctor") {
          toast.success("Welcome to MediCard Doctor Portal!");
          navigate("/doctor/dashboard", { replace: true });
        } else if (user.role === "admin") {
          toast.success("Welcome to MediCard Admin Portal!");
          navigate("/admin/dashboard", { replace: true });
        }
      }
    } catch (err) {
      setError("Invalid email or password");
      toast.error("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-medical-dark mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-medical-primary text-white py-2 px-4 rounded-md hover:bg-medical-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-medical-primary hover:text-medical-secondary">
                Register here
              </Link>
            </p>
          </div>

          {/* Admin login hint */}
          <div className="mt-10 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Admin login: <span className="font-medium">admin@qrmedi.com</span> / Password: <span className="font-medium">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
