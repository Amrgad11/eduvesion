/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthContext';
import { 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  Search, 
  MoreHorizontal, 
  Activity,
  Server,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setStats(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading system control panel...</div>;

  const activityData = [
    { time: '00:00', load: 30 },
    { time: '04:00', load: 15 },
    { time: '08:00', load: 60 },
    { time: '12:00', load: 95 },
    { time: '16:00', load: 80 },
    { time: '20:00', load: 45 },
    { time: '23:59', load: 20 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Systems Administration</h1>
          <p className="text-slate-400">Monitor platform health, manages user roles, and configure system settings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Operational</span>
          </div>
          <button className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all border border-white/10">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter mb-2">Total Users</div>
          <div className="text-3xl font-bold">{stats?.users?.count || 0}</div>
          <div className="flex items-center text-xs text-blue-400 mt-2 font-bold">
            <Users className="w-3 h-3 mr-1" />
            <span>{Math.floor((stats?.users?.count || 0) * 0.7)} Students Active Today</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-indigo-500">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter mb-2">Platform Courses</div>
          <div className="text-3xl font-bold">{stats?.courses?.count || 0}</div>
          <div className="flex items-center text-xs text-indigo-400 mt-2 font-bold">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>12 New This Week</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-amber-500">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter mb-2">Total Enrollments</div>
          <div className="text-3xl font-bold">{stats?.enrollments?.count || 0}</div>
          <div className="flex items-center text-xs text-amber-400 mt-2 font-bold">
            <Activity className="w-3 h-3 mr-1" />
            <span>High Retention Rate</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter mb-2">Server Status</div>
          <div className="text-3xl font-bold">99.9%</div>
          <div className="flex items-center text-xs text-emerald-400 mt-2 font-bold">
            <Server className="w-3 h-3 mr-1" />
            <span>Uptime Optimal</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* System Activity Chart */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold">Real-time Platform Activity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <span className="text-xs text-slate-400">System Load</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#1e293b' }} 
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Tools & Management */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Control Center</span>
          </h3>

          <div className="grid gap-4">
            {[
              { name: 'User Access Controls', icon: Users, color: 'blue' },
              { name: 'Global Course Moderation', icon: BookOpen, color: 'indigo' },
              { name: 'Database Maintenance', icon: Database, color: 'amber' },
              { name: 'Security Audit Logs', icon: ShieldCheck, color: 'emerald' },
            ].map((tool, i) => (
              <button 
                key={i}
                className="glass-card p-5 flex items-center justify-between hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-${tool.color}-500/10`}>
                    <tool.icon className={`w-5 h-5 text-${tool.color}-500`} />
                  </div>
                  <span className="text-sm font-semibold">{tool.name}</span>
                </div>
                <MoreHorizontal className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            <h4 className="text-amber-500 font-bold mb-2 flex items-center space-x-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              <span className="text-sm">Maintenance Alert</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scheduled database optimization in 4 hours. Expect minor latency in AI recommendation queries for approximately 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
