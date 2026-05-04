/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  BrainCircuit, 
  Clock, 
  Search,
  Sparkles,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GeminiService, RecommendationResult } from '../services/geminiService';
import { Course, Enrollment, PerformanceRecord } from '../types';

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailableCourses();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const json = await res.json();
      setCourses(json);
    } catch (e) {
      console.error(e);
    }
  };

  const generateAIRecommendations = async () => {
    setAiLoading(true);
    // Use latest performance data for AI logic check
    const lastPerformance = data?.performance?.[0] || { score: 75, engagement_level: 'medium' };
    const completionRate = data?.enrollments?.length > 0 ? (data.enrollments.reduce((acc: any, curr: any) => acc + curr.progress, 0) / data.enrollments.length) : 0;
    
    const results = await GeminiService.getRecommendations(
      lastPerformance.score, 
      lastPerformance.engagement_level, 
      completionRate
    );
    setRecommendations(results);
    setAiLoading(false);
  };

  if (loading) return <div className="p-10 text-center">Loading your journey...</div>;

  const chartData = [
    { name: 'Mon', score: 45 },
    { name: 'Tue', score: 52 },
    { name: 'Wed', score: 48 },
    { name: 'Thu', score: 70 },
    { name: 'Fri', score: 61 },
    { name: 'Sat', score: 85 },
    { name: 'Sun', score: 92 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Here's your learning progress for this week.</p>
        </div>
        <button 
          onClick={generateAIRecommendations}
          disabled={aiLoading}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 neon-glow disabled:opacity-50"
        >
          {aiLoading ? <span className="animate-pulse">Analyzing...</span> : <><Sparkles className="w-5 h-5" /> <span>AI Insights</span></>}
        </button>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="text-blue-400 w-6 h-6" />
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Active</span>
          </div>
          <div className="text-2xl font-bold mb-1">{data?.enrollments?.length || 0}</div>
          <div className="text-slate-400 text-sm">Enrolled Courses</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-green-400 w-6 h-6" />
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-2xl font-bold mb-1">84%</div>
          <div className="text-slate-400 text-sm">Avg. Performance</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-purple-400 w-6 h-6" />
          </div>
          <div className="text-2xl font-bold mb-1">12.5h</div>
          <div className="text-slate-400 text-sm">Learning Hours</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="text-yellow-400 w-6 h-6" />
          </div>
          <div className="text-2xl font-bold mb-1">4</div>
          <div className="text-slate-400 text-sm">Certificates Earned</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Analytics Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 font-sans">
            <h3 className="text-xl font-bold mb-8">Performance Analytics</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              <span>Current Courses</span>
            </h3>
            {data?.enrollments?.length > 0 ? (
              <div className="grid gap-4">
                {data.enrollments.map((en: Enrollment) => (
                  <div key={en.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{en.course_title}</h4>
                      <p className="text-slate-400 text-sm line-clamp-1">{en.description}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="min-w-[120px]">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                          <span>Progress</span>
                          <span>{en.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${en.progress}%` }}
                            className="h-full bg-brand-primary"
                          />
                        </div>
                      </div>
                      <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap">
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-slate-500">
                You haven't enrolled in any courses yet.
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full" />
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <BrainCircuit className="w-6 h-6 text-brand-primary" />
              <span>AI Recommendations</span>
            </h3>
            
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-primary/50 transition-all cursor-default"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{rec.level}</span>
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                    </div>
                    <h4 className="font-bold mb-2">{rec.courseName}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{rec.reason}</p>
                  </motion.div>
                ))}
                <p className="text-[10px] text-slate-500 italic text-center">Powered by Gemini AI Vision</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-6">Let our AI analyze your goals and suggest the best path for you.</p>
                <button 
                  onClick={generateAIRecommendations}
                  className="text-brand-primary text-sm font-bold border border-brand-primary/30 px-4 py-2 rounded-lg hover:bg-brand-primary/10 transition-all"
                >
                  Generate Insights
                </button>
              </div>
            )}
          </div>

          {/* New Courses */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Recommended for You</h3>
            <div className="grid gap-4">
              {courses.slice(0, 3).map(course => (
                <div key={course.id} className="glass-card p-4 hover:border-brand-primary/30 transition-all">
                  <h4 className="font-bold text-sm mb-1">{course.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                    <GraduationCap className="w-3 h-3" />
                    <span>{course.instructor_name}</span>
                  </div>
                  <button className="w-full bg-white/5 hover:bg-brand-primary hover:text-white py-2 rounded-lg text-xs font-bold transition-all border border-white/10">
                    Explore Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
