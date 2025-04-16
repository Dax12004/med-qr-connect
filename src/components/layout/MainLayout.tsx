
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-medical-light">
      {/* Navbar - Fixed */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-medical-primary"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="M12 16v-4" />
                  <path d="M12 12h4" />
                  <path d="M12 8v.01" />
                </svg>
                <span className="font-bold text-xl text-medical-dark">QR Medical Records</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                {isAuthenticated ? (
                  <>
                    {user?.role === "patient" && (
                      <Link to="/patient/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                        Patient Dashboard
                      </Link>
                    )}
                    {user?.role === "doctor" && (
                      <Link to="/doctor/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                        Doctor Dashboard
                      </Link>
                    )}
                    {user?.role === "admin" && (
                      <Link to="/admin/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/" className="text-medical-dark hover:text-medical-primary transition-colors">
                      Home
                    </Link>
                  </>
                )}
              </nav>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-medical-dark">
                        Welcome, {user?.role === "doctor" ? "Dr. " : ""}{user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded bg-medical-primary text-white hover:bg-medical-brown/80 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded border border-medical-primary text-medical-primary hover:bg-medical-light transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded bg-medical-primary text-white hover:bg-medical-brown/80 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
            <nav className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "patient" && (
                    <Link to="/patient/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                      Patient Dashboard
                    </Link>
                  )}
                  {user?.role === "doctor" && (
                    <Link to="/doctor/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                      Doctor Dashboard
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link to="/admin/dashboard" className="text-medical-dark hover:text-medical-primary transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-medical-dark hover:text-medical-primary transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-medical-dark hover:text-medical-primary transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" className="text-medical-dark hover:text-medical-primary transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content - with padding for fixed header */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-[76px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-medical-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QR Medical Records</h3>
              <p className="text-gray-300">
                Secure storage and easy access to your medical records through QR technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-300 hover:text-white">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-300 hover:text-white">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                Email: support@qrmedical.com
                <br />
                Phone: +1 (123) 456-7890
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} QR Medical Records. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
