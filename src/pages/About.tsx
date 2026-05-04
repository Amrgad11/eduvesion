/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Compass, Lightbulb, Users, Shield, Target, BrainCircuit } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8">Redefining Education <br /> with <span className="text-brand-primary">Visionary AI</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          At EduVision AI, our mission is to merge the art of teaching with the science of AI to create a truly personalized learning environment.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            Founded by a team of educators and data scientists, EduVision AI started with a simple question: "What if technology could understand how every individual learns?"
          </p>
          <p className="text-slate-400 leading-relaxed text-lg">
            Today, we serve a global community, providing tools that automate mundane management tasks for instructors while giving students a clear, AI-optimized roadmap to mastery.
          </p>
        </div>
        <div className="glass-card aspect-video flex items-center justify-center p-12 bg-brand-primary/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent flex items-center justify-center">
            <BrainCircuit className="w-32 h-32 text-brand-primary/50 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Compass, title: 'Personalized Path', desc: 'Every learner is unique. Our AI builds a custom curriculum based on your pace and goals.' },
          { icon: Shield, title: 'Data Sovereignty', desc: 'Your data is yours. We prioritize privacy and security in every part of our architecture.' },
          { icon: Users, title: 'Expert Driven', desc: 'Our platform is powered by instructors from world-class institutions and industries.' },
          { icon: Lightbulb, title: 'Continuous Innovation', desc: 'We integrate the latest LLM and Vision models to enhance the classroom experience.' },
          { icon: Target, title: 'Outcome Focused', desc: 'Success metrics that matter—we track real skills acquisition and retention.' },
          { icon: BrainCircuit, title: 'Advanced Analytics', desc: 'Instructors get real-time dashboards to identify struggling students before they fail.' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-10 hover:border-brand-primary/30 transition-all">
            <item.icon className="w-10 h-10 text-brand-primary mb-6" />
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
