/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home as HomeIcon,
  Info,
  Mail,
  LogIn,
  UserPlus,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const authLinks = [
    { name: 'Dashboard', path: `/${user?.role}-dashboard`, icon: LayoutDashboard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center neon-glow">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              EduVision AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={cn(
                  "hover:text-brand-primary transition-colors text-sm font-medium",
                  location.pathname === link.path ? "text-brand-primary" : "text-slate-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={`/${user?.role}-dashboard`} 
                  className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/20 transition-all"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-all neon-glow">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-bg-card border-b border-white/10 px-4 pt-2 pb-6"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 flex items-center space-x-2"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link 
                    to={`/${user?.role}-dashboard`} 
                    onClick={() => setIsOpen(false)}
                    className="text-brand-primary flex items-center space-x-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 flex items-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-300">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="bg-brand-primary text-center py-2 rounded-lg">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MainContent() {
  return (
    <main className="pt-24 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <MainContent />
        <footer className="bg-bg-dark pt-20 pb-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <BrainCircuit className="text-brand-primary w-6 h-6" />
              <span className="text-xl font-bold">EduVision AI</span>
            </div>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              Empowering learners and educators with performance-driven AI insights and personalized educational tracks.
            </p>
            <div className="flex justify-center space-x-6 text-slate-400 text-sm mb-8">
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="text-slate-600 text-xs">
              © {new Date().getFullYear()} EduVision AI. All rights reserved.
            </div>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  );
}
