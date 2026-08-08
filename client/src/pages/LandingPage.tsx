import { useState } from 'react';
import {
  Factory,
  ArrowRight,
  Check,
  Building2,
  FileText,
  ClipboardCheck,
  Workflow,
  Lock,
  Gauge,
  Sparkles,
  Activity,
  Clock,
  Zap,
  Database,
  LayoutDashboard,
  ShieldCheck,
  X,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'demo' | 'contact'>('demo');

  const handleOpenModal = (type: 'demo' | 'contact', e: React.MouseEvent) => {
    e.preventDefault();
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const org = formData.get('organization');
    const message = formData.get('message');
    
    const subject = modalType === 'demo' ? `Demo Request from ${name}` : `Contact Request from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AOrganization: ${org}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    
    window.location.href = `mailto:rajswns3@gmail.com?subject=${subject}&body=${body}`;
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f2f9f6] font-sans selection:bg-[#0a6c47]/20 selection:text-[#0a6c47]">

      {/* 1. Navigation Bar */}
      <nav className="w-full">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0a6c47] flex items-center justify-center">
              <Factory className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MillOps</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-500">
            <a href="#platform" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#teams" className="hover:text-slate-900 transition-colors">For teams</a>
            <a href="#engine" className="hover:text-slate-900 transition-colors">The engine</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-6 text-[15px] font-medium text-slate-500">
            <a href="#" onClick={(e) => handleOpenModal('contact', e)} className="hidden sm:block hover:text-slate-900 transition-colors">Talk to us</a>
            <button
              onClick={(e) => handleOpenModal('demo', e)}
              className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-semibold text-white bg-[#0a6c47] hover:bg-[#085a3b] rounded-lg transition-all active:scale-95 gap-1.5"
            >
              Book a demo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-20 pb-24">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8">

            {/* Left Column */}
            <div className="flex-1 max-w-2xl flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200/60 bg-[#eef7f3] text-xs font-semibold text-[#0a6c47] mb-8 w-fit shadow-sm shadow-[#0a6c47]/5">
                <Sparkles size={14} />
                The operating system for modern mills
              </div>

              <h1 className="text-[64px] md:text-[80px] font-bold text-slate-950 tracking-tight leading-[1.05] max-w-xl">
                Run your mill <br />with <span className="text-[#0a6c47]">clarity.</span>
              </h1>

              <p className="mt-8 text-[20px] text-slate-500 max-w-md leading-[1.6]">
                MillOps connects production, people, and profit in one intelligent platform built for the realities of sugar manufacturing.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={(e) => handleOpenModal('demo', e)}
                  className="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold text-white bg-[#0a6c47] hover:bg-[#085a3b] rounded-xl transition-all active:scale-95 gap-2 w-full sm:w-auto shadow-sm shadow-[#0a6c47]/20"
                >
                  See MillOps in action <ArrowRight size={18} />
                </button>
                <a
                  href="#platform"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all active:scale-95 gap-2 w-full sm:w-auto shadow-sm"
                >
                  Explore the platform <ArrowRight size={18} className="text-slate-400" />
                </a>
              </div>

              <div className="mt-10 flex items-center gap-8 text-[13px] font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#0a6c47]" />
                  No rip-and-replace
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#0a6c47]" />
                  Built for your team
                </div>
              </div>
            </div>

            {/* Right Column (Placeholder) */}
            <div className="flex-1 lg:ml-12 flex items-center">
              <div className="w-full aspect-[16/10] border-2 border-dashed border-[#a7d7c5] rounded-[32px] bg-[#f0f9f5]/50 flex flex-col items-center justify-center p-8 text-center text-[#0a6c47]">
                <Building2 size={40} className="mb-4 opacity-80" strokeWidth={1.5} />
                <h3 className="text-[17px] font-bold text-slate-900 max-w-sm leading-snug">
                  Replace with: High-Res Organization Admin Dashboard Screenshot
                </h3>
                <p className="mt-3 text-[13px] font-medium text-slate-500">
                  Recommended ratio 16:10 · desktop application view
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#e2ece7]" />

      {/* 3. Role-Based Value */}
      <section id="teams" className="py-24">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Header Column */}
            <div className="lg:w-[400px] shrink-0">
              <p className="text-[14px] font-bold text-[#0a6c47] mb-4">One source of truth</p>
              <h2 className="text-[40px] font-bold text-slate-950 tracking-tight leading-[1.1] max-w-sm">
                A better shift starts with a better view.
              </h2>
            </div>

            {/* Grid Columns */}
            <div className="flex-1 grid md:grid-cols-3 gap-12 lg:gap-16">

              <div>
                <Building2 className="text-[#0a6c47] mb-6" size={24} strokeWidth={1.5} />
                <h3 className="text-[17px] font-bold text-slate-900 mb-4">For Corporate Admins</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed">
                  Manage users, monitor live production status, and lock historical logs across every factory in your organization from a single centralized dashboard.
                </p>
              </div>

              <div>
                <FileText className="text-[#0a6c47] mb-6" size={24} strokeWidth={1.5} />
                <h3 className="text-[17px] font-bold text-slate-900 mb-4">For Organization Staff</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed">
                  Stop waiting for end-of-month rollups. Generate Excel-ready reports instantly with mathematically perfect To-Month and To-Date weighted averages.
                </p>
              </div>

              <div>
                <ClipboardCheck className="text-[#0a6c47] mb-6" size={24} strokeWidth={1.5} />
                <h3 className="text-[17px] font-bold text-slate-900 mb-4">For Unit Operators</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed">
                  A frictionless, fatigue-free interface designed for the factory floor. Quickly log 200+ daily parameters with built-in safeguards and workflow accelerators.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#e2ece7]" />

      {/* 4. The Platform */}
      <section id="platform" className="py-24">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">

          <div className="mb-16">
            <p className="text-[13px] font-bold text-[#0a6c47] mb-3">The platform</p>
            <h2 className="text-[36px] font-bold text-slate-950 tracking-tight leading-[1.1] max-w-xl">
              From raw cane to reliable margin.
            </h2>
            <p className="mt-4 text-[16px] text-slate-500 max-w-2xl">
              Every part of your operation is connected, contextual, and ready to act on.
            </p>
          </div>

          <div className="grid md:grid-cols-3 bg-white border border-[#e2ece7] rounded-[20px] overflow-hidden">

            {/* Column 1 */}
            <div className="p-8 flex flex-col h-full border-b md:border-b-0 md:border-r border-[#e2ece7]">
              <div className="w-10 h-10 rounded-[10px] border border-[#bce3d0] bg-[#f4faf7] flex items-center justify-center mb-8">
                <Workflow className="text-[#0a6c47]" size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-3">Connected operations</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-8 flex-1">
                Link cane intake, crushing, refining, packing, and dispatch without stitching systems together.
              </p>
              <a href="#" className="inline-flex items-center text-[12px] font-bold text-[#0a6c47] hover:text-[#085a3b] transition-colors gap-1">
                Learn more <ArrowRight size={14} />
              </a>
            </div>

            {/* Column 2 */}
            <div className="p-8 flex flex-col h-full bg-white border-b md:border-b-0 md:border-r border-[#e2ece7]">
              <div className="w-10 h-10 rounded-[10px] border border-[#bce3d0] bg-[#f4faf7] flex items-center justify-center mb-8">
                <ClipboardCheck className="text-[#0a6c47]" size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-3">Built for the floor</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-8 flex-1">
                Give every shift the right checklist, alert, and next action at the right moment.
              </p>
              <a href="#" className="inline-flex items-center text-[12px] font-bold text-[#0a6c47] hover:text-[#085a3b] transition-colors gap-1">
                Learn more <ArrowRight size={14} />
              </a>
            </div>

            {/* Column 3 */}
            <div className="p-8 flex flex-col h-full bg-white">
              <div className="w-10 h-10 rounded-[10px] border border-[#bce3d0] bg-[#f4faf7] flex items-center justify-center mb-8">
                <Lock className="text-[#0a6c47]" size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-3">Audit-ready by default</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-8 flex-1">
                Keep approvals, adjustments, and production history traceable from field to boardroom.
              </p>
              <a href="#" className="inline-flex items-center text-[12px] font-bold text-[#0a6c47] hover:text-[#085a3b] transition-colors gap-1">
                Learn more <ArrowRight size={14} />
              </a>
            </div>

          </div>

          {/* Expanded Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-32 border-t border-[#e2ece7] pt-20">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-indigo-600">
                <Factory size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cane Crushing & Sugar Bagged</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Track raw intake to final product output with high-precision accounting for losses at every stage.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-[#0a6c47]">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Routine & Special Lab Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Monitor purity, color, and TRS with absolute precision using digitally verified lab protocols.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-red-600">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Downtime & Stoppage Logging</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Categorize mechanical, electrical, and process delays to identify bottlenecks and optimize uptime.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-cyan-600">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Steam, Water, & Power</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Audit utility generation and factory consumption to maximize energy efficiency.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-amber-600">
                <Database size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Stores Consumption</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Track daily usage of lime, sulphur, and sanitation chemicals to ensure optimal inventory levels.</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-5 text-slate-700">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Custom Reports</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Export formatted Excel files with standard and derived metrics pre-calculated for the day, month, and season.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Math Engine (Dark Section) */}
      <section id="engine" className="bg-[#086341] py-32">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-20 items-center">

            {/* Left Col (Text) */}
            <div className="flex-1 max-w-xl">
              <p className="text-[14px] font-semibold text-[#86e2b6] mb-5">The math engine</p>
              <h2 className="text-[44px] font-bold text-white tracking-tight leading-[1.1]">
                Know where every <br />point of yield goes.
              </h2>
              <p className="mt-8 text-[16px] text-[#a7d7c5] leading-[1.7] max-w-lg">
                Our intelligent calculation pipeline doesn't just store data; it understands it. From simple additive totals for utility consumption to complex derived weighted averages for Pol, Brix, and Yield.
              </p>
              <p className="mt-4 text-[16px] text-[#a7d7c5] leading-[1.7] max-w-lg">
                The system automatically calculates daily, monthly, and seasonal aggregates with zero manual intervention, eliminating spreadsheet errors and the "silent zero" trap.
              </p>
            </div>

            {/* Right Col (Cards) */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: White */}
              <div className="bg-[#f7fbf9] rounded-[28px] p-8 md:col-span-1 min-h-[220px] flex flex-col shadow-xl shadow-black/10">
                <Gauge className="text-[#0a6c47] mb-auto" size={24} strokeWidth={1.5} />
                <div>
                  <div className="text-[36px] font-medium text-[#0a6c47] tracking-tight leading-none mb-2">+4.8%</div>
                  <div className="text-[13px] font-medium text-slate-400">recovery improvement</div>
                </div>
              </div>

              {/* Card 2: Dark Green */}
              <div className="bg-transparent border border-[#107b53] rounded-[28px] p-8 min-h-[220px] flex flex-col hover:bg-[#107b53]/50 transition-colors cursor-default">
                <div className="mt-auto">
                  <div className="text-[32px] font-medium text-white tracking-tight leading-none mb-3">-12%</div>
                  <div className="text-[13px] font-medium text-[#a7d7c5]">unplanned downtime</div>
                </div>
              </div>

              {/* Card 3: Dark Green */}
              <div className="bg-transparent border border-[#107b53] rounded-[28px] p-8 min-h-[220px] flex flex-col hover:bg-[#107b53]/50 transition-colors cursor-default">
                <div className="mt-auto">
                  <div className="text-[32px] font-medium text-white tracking-tight leading-none mb-3">2.4x</div>
                  <div className="text-[13px] font-medium text-[#a7d7c5]">faster close</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5.5 Security Section */}
      <section id="security" className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[14px] font-bold text-[#0a6c47] mb-4">Enterprise-grade security</p>
            <h2 className="text-[36px] font-bold text-slate-950 tracking-tight leading-[1.1]">
              Built for strict compliance and data integrity.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-[#f4faf7] rounded-xl flex items-center justify-center mb-6 text-[#0a6c47]">
                <Users size={24} />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-3">Role-Based Access Control</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Granular permissions ensure users only see what they need to. From Super Admins managing organizations to Unit Operators submitting daily logs, every action is strictly governed.
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-[#f4faf7] rounded-xl flex items-center justify-center mb-6 text-[#0a6c47]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-3">Immutable Audit Trails</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Once a log is submitted, it becomes part of a secure, immutable history. Edits and approvals are tracked with precise timestamps and user IDs, ensuring complete traceability.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-[#f4faf7] rounded-xl flex items-center justify-center mb-6 text-[#0a6c47]">
                <Lock size={24} />
              </div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-3">Secure Infrastructure</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                Protected by industry-standard JWT authentication and a robust cloud-native backend, your operational data is encrypted in transit and at rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-12 border-b border-slate-800 pb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#0a6c47] flex items-center justify-center">
                  <Factory className="text-white" size={16} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">MillOps</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                The digital foundation for modern sugar manufacturing. Precision calculations, secure records, and frictionless workflows.
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-4">
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                <Lock className="text-[#0a6c47]" size={20} />
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Security Standard</p>
                  <p className="text-sm font-semibold text-white mt-0.5">Immutable Audit-Ready Records</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300">
                <ShieldCheck className="text-[#0a6c47]" size={20} />
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Infrastructure</p>
                  <p className="text-sm font-semibold text-white mt-0.5">Cloud-Native Architecture</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 text-xs font-medium text-slate-500">
            <p>&copy; 2026 MillOps. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security Overview</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact / Demo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {modalType === 'demo' ? 'Book a Demo' : 'Talk to Us'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input required name="name" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a6c47] focus:ring-1 focus:ring-[#0a6c47] outline-none transition-all" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input required name="email" type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a6c47] focus:ring-1 focus:ring-[#0a6c47] outline-none transition-all" placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                  <input name="organization" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a6c47] focus:ring-1 focus:ring-[#0a6c47] outline-none transition-all" placeholder="Sugar Mills Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                  <textarea required name="message" rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0a6c47] focus:ring-1 focus:ring-[#0a6c47] outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>
              </div>
              
              <div className="mt-8">
                <button type="submit" className="w-full py-3 px-4 bg-[#0a6c47] hover:bg-[#085a3b] text-white rounded-xl font-semibold transition-colors">
                  {modalType === 'demo' ? 'Request Demo' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
