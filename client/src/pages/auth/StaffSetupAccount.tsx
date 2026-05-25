import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInvitePreviewQuery, useActivateStaffMutation } from '../../store/api/apiSlice';
import { Building, Shield, ChevronRight, Lock, User, Key } from 'lucide-react';
import { getPagePath } from '../../config/routesConfig';

export const StaffSetupAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { data: previewData, isLoading, error } = useInvitePreviewQuery(token as string, {
    skip: !token,
  });

  const [activateStaff, { isLoading: isActivating }] = useActivateStaffMutation();
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      navigate(getPagePath.login());
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await activateStaff({
        token: token as string,
        fullName: formData.fullName,
        password: formData.password,
      }).unwrap();

      alert("Account successfully activated! Please log in.");
      navigate(getPagePath.login());
    } catch (err) {
      alert("Failed to activate account. The link might be expired or invalid.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid Invite Link</h2>
          <p className="text-slate-500 mb-6">
            This invitation link is invalid, has expired, or has already been used. Please contact your administrator for a new invitation.
          </p>
          <button
            onClick={() => navigate(getPagePath.login())}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden grid md:grid-cols-5 z-10">
        
        {/* Left Side: Info */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
              <Shield size={24} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Setup</h2>
            <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
              You have been invited to join the platform. Complete your registration below.
            </p>

            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-1">
                  <Building size={14} />
                  Organization
                </div>
                <div className="text-white font-medium">{previewData.orgName}</div>
              </div>

              {previewData.unitName && (
                <div className="bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-1">
                    <Building size={14} />
                    Assigned Unit
                  </div>
                  <div className="text-white font-medium">{previewData.unitName}</div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 text-xs text-indigo-300/50 flex items-center gap-2">
            Secure Onboarding <Lock size={10} />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-span-3 p-8 lg:p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Create your profile</h3>
          <p className="text-slate-500 text-sm mb-6">Enter your details to activate your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={previewData.email}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isActivating}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group"
            >
              {isActivating ? 'Activating Account...' : 'Activate Account'}
              {!isActivating && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
