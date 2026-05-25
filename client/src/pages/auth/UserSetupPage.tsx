import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetTokenDetailsQuery, useSetupUserMutation } from '../../store/api/apiSlice';
import { Users, ArrowRight } from 'lucide-react';
import { PAGES } from '../../config/routesConfig';

export const UserSetupPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { data: tokenDetails, isLoading, error } = useGetTokenDetailsQuery(token as string, {
    skip: !token,
  });

  const [setupUser] = useSetupUserMutation();

  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' });

  if (!token) {
    return <div className="p-8 text-center text-red-500 font-medium">Invalid or missing setup token.</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Validating your invitation...</div>;
  }

  if (error || !tokenDetails) {
    return <div className="p-8 text-center text-red-500 font-medium">This invitation has expired or is invalid.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await setupUser({
        token,
        name: form.name,
        password: form.password,
      }).unwrap();
      
      alert('Account successfully registered! Please login.');
      navigate(PAGES.LOGIN);
    } catch (err) {
      alert('Failed to complete setup. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Complete Your Profile
        </h2>
        <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-600 mb-1">You've been invited to join</p>
          <p className="font-bold text-slate-900">{tokenDetails.orgName}</p>
          {tokenDetails.unitName && (
            <p className="text-sm font-medium text-emerald-600 mt-1">Assigned to: {tokenDetails.unitName}</p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Your Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                disabled
                value={tokenDetails.email}
                className="mt-1 block w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg shadow-sm py-2 px-3 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Activate Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
