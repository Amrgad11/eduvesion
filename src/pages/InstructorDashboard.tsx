/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { 
  Plus, 
  Users, 
  FileText, 
  TrendingUp, 
  MoreVertical, 
  Edit2, 
  Trash2,
  BookOpen,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { Course } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function InstructorDashboard() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Create Course State
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setCourses(json.myCourses || []);
      setStats(json.studentCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        setShowModal(false);
        setNewCourse({ title: '', description: '' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading instructor panel...</div>;

  const enrollmentData = [
    { name: 'Introduction to AI', students: 450 },
    { name: 'Python Mastery', students: 300 },
    { name: 'Web 3.0 Basics', students: 120 },
    { name: 'Data Structures', students: 280 },
  ];

  const COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Instructor Hub</h1>
          <p className="text-slate-400">Manage your courses, students, and track your impact.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 neon-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Students</div>
          </div>
          <div className="text-4xl font-bold">1,482</div>
          <div className="text-sm text-green-400 font-bold mt-2">+12% from last month</div>
        </div>
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <BookOpen className="text-purple-500 w-6 h-6" />
            </div>
            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Courses</div>
          </div>
          <div className="text-4xl font-bold">{courses.length}</div>
          <div className="text-sm text-slate-500 mt-2">2 courses pending review</div>
        </div>
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TrendingUp className="text-green-500 w-6 h-6" />
            </div>
            <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Avg. Rating</div>
          </div>
          <div className="text-4xl font-bold">4.8/5</div>
          <div className="text-sm text-slate-500 mt-2">Based on 850 reviews</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">Your Courses</h3>
              <button className="text-slate-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-white/10">
              {courses.length > 0 ? courses.map((course) => (
                <div key={course.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                   <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                      <FileText className="text-brand-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{course.title}</h4>
                      <p className="text-slate-500 text-xs">Created on {new Date(course.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-500">
                  No courses created yet. Share your knowledge!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Enrollment Share</h3>
              <PieChartIcon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enrollmentData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="students"
                  >
                    {enrollmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {enrollmentData.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[10px] text-slate-400 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-brand-primary/5 border-brand-primary/20">
             <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="text-brand-primary w-6 h-6" />
              <h3 className="font-bold">Growth Insight</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed italic mb-6">
              "Your student base grew by 15% this quarter. AI suggests adding more practical projects to 'Python Mastery' to improve completion rates."
            </p>
            <button className="w-full bg-brand-primary/20 text-brand-primary py-2 rounded-lg text-xs font-bold transition-all hover:bg-brand-primary/30">
              View AI Analysis Report
            </button>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-lg p-8 shadow-2xl border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Course</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><Plus className="rotate-45 w-6 h-6" /></button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Title</label>
                <input 
                  type="text" 
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all"
                  placeholder="e.g. Advanced Machine Learning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all resize-none"
                  placeholder="What will students learn in this course?"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all neon-glow"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
