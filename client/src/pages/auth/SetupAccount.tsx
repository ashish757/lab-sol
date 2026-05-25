import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetTokenDetailsQuery, useSetupAccountMutation } from '../../store/api/apiSlice';
import { Building2, ArrowRight } from 'lucide-react';
import { PAGES } from '../../config/routesConfig';

export const SetupAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { data: tokenDetails, isLoading, error } = useGetTokenDetailsQuery(token as string, {
    skip: !token,
  });

  const [setupAccount] = useSetupAccountMutation();

  const [form, setForm] = useState({ updatedOrgName: '', adminName: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (tokenDetails) {
      setForm((prev) => ({ ...prev, updatedOrgName: tokenDetails.orgName || '' }));
    }
  }, [tokenDetails]);

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
      await setupAccount({
        token,
        updatedOrgName: form.updatedOrgName,
        adminName: form.adminName,
        password: form.password,
      }).unwrap();
      
      alert('Organization successfully registered! Please login.');
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
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Confirm {tokenDetails.orgName} Registration
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Organization ID: <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded">{tokenDetails.orgId}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-100">
          <h3 className="text-lg font-medium text-slate-900 mb-6 text-center">Register your first org admin</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Organization Name</label>
              <input
                type="text"
                required
                value={form.updatedOrgName}
                onChange={(e) => setForm({ ...form, updatedOrgName: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Your Full Name</label>
              <input
                type="text"
                required
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Complete Setup & Activate
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
