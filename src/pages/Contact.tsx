/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic tracking-tight">Get in Touch</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Have questions about our enterprise plans or need technical support? Our team is here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 sm:p-12"
        >
          {success ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-emerald-500 w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
              <p className="text-slate-400">Our team will get back to you within 24 hours.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-8 text-brand-primary font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-brand-primary outline-none transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all hover:bg-brand-primary/90 neon-glow disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send Message</span> <Send className="w-5 h-5" /></>}
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="text-slate-400 leading-relaxed italic">
              "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them."
            </p>
          </div>

          <div className="grid gap-8">
            {[
              { icon: Mail, label: 'Email Us', val: 'support@eduvision.ai', color: 'blue' },
              { icon: Phone, label: 'Call Support', val: '+1 (888) EDU-AI-01', color: 'indigo' },
              { icon: MessageSquare, label: 'Live Chat', val: 'Available 24/7 in dashboard', color: 'purple' },
              { icon: MapPin, label: 'Global HQ', val: '1 Infinite Learning Way, Silicon Valley, CA', color: 'emerald' },
            ].map((contact, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl bg-${contact.color}-500/10`}>
                  <contact.icon className={`w-6 h-6 text-${contact.color}-500`} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-300 mb-1">{contact.label}</div>
                  <div className="text-slate-400 text-sm whitespace-nowrap">{contact.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Social */}
          <div className="pt-10 border-t border-white/10">
            <h3 className="font-bold mb-4">Follow Case Studies</h3>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
