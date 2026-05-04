/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BrainCircuit, Rocket, Target, Users, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-8 hover:border-brand-primary/50 transition-all group"
  >
    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-brand-primary w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">New: AI-Powered Learning Paths</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight font-sans"
          >
            Elevate Your Learning with <br />
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Educational Intelligence
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            EduVision AI uses advanced analytics to personalize your educational journey. 
            Real-time insights, instructor-led courses, and AI recommendations built for excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/register" className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-primary/90 transition-all flex items-center justify-center space-x-2 neon-glow">
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
              View All Courses
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-y border-white/5 py-12">
            {[
              { label: 'Learners', val: '50k+' },
              { label: 'Courses', val: '1.2k+' },
              { label: 'Success Rate', val: '94%' },
              { label: 'AI Accuracy', val: '99%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.val}</div>
                <div className="text-slate-500 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for the Future of Learning</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Experience a range of tools designed to optimize performance for both students and instructors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={BrainCircuit}
            title="AI Recommendations"
            desc="Our AI analyzes your performance to suggest the most relevant courses and learning materials."
            delay={0.1}
          />
          <FeatureCard 
            icon={Target}
            title="Precision Tracking"
            desc="Detailed analytics on your engagement levels, completion rates, and assessment scores."
            delay={0.2}
          />
          <FeatureCard 
            icon={Users}
            title="Role-Based Dashboards"
            desc="Tailored experiences for students, instructors, and admins with specialized management tools."
            delay={0.3}
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Secure Infrastructure"
            desc="Enterprise-grade security for your data, materials, and certificates with JWT authentication."
            delay={0.4}
          />
          <FeatureCard 
            icon={Rocket}
            title="Accelerated Growth"
            desc="Skip the fluff and focus on what matters with personalized paths that challenge you."
            delay={0.5}
          />
          <FeatureCard 
            icon={Zap}
            title="Instant Insights"
            desc="Get immediate feedback on your performance and automated alerts from instructors."
            delay={0.6}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-xl border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] -z-10" />
          <h2 className="text-4xl md:text-5xl font-bold mb-8 italic">Ready to transform your vision?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of students and world-class instructors on the most advanced AI-powered educational platform.
          </p>
          <Link to="/register" className="bg-white text-brand-primary px-10 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all inline-flex items-center space-x-2">
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
