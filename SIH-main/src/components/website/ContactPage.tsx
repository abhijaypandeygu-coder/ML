import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'Chartering Advisory & Platform Integration',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Header with Motion Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIRECT LOGISTICS DESK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Connect with the FreightQuant Team
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Have questions regarding model evaluation, port constraint integration, or SIH 26006 technical architecture? We are ready to assist.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info (5 cols) with Hover Elevation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="enterprise-card p-8 space-y-6 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold text-slate-900">Direct Contact</h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Email Inquiries:</span>
                  <span>contact@freightquant.maritime</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Headquarters:</span>
                  <span>Smart India Hackathon 2026 Innovation Lab, New Delhi, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Corridor Support:</span>
                  <span>Indian East Coast Maritime Logistics Desk (Paradip, Vizag, Dhamra)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#070e1e] text-white p-8 rounded-2xl border border-[#1e3362] space-y-3 shadow-xl">
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Hackathon Prototype</div>
            <h4 className="text-lg font-bold text-white">SIH 2026 Problem Statement 26006</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              An AI-driven decision support system for optimal vessel chartering, integrating forward curves, draft limitations, and COA contract trade-offs.
            </p>
          </div>
        </motion.div>

        {/* Contact Form (7 cols) with Motion Reveal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="lg:col-span-7"
        >
          <div className="enterprise-card p-8 sm:p-10 border border-slate-200">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Inquiry Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. Our quantitative chartering desk has received your request and will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Capt. Rajesh Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="r.sharma@shippingcorp.in"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Organization / Port Authority</label>
                    <input
                      type="text"
                      placeholder="e.g. Steel Authority of India Ltd"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Inquiry Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Message / Charter Scenario Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your parcel volume, trade route (e.g. Hay Point to Paradip), and current chartering workflow..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
