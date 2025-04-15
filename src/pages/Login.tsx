
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

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
      
      // Redirect based on role (handled by the AuthContext)
      const storedUser = localStorage.getItem("medicalQrUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "patient") {
          navigate("/patient/dashboard");
        } else if (user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
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

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
