import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-4">Unauthorized</h1>
      <p className="text-sm text-slate-600 mb-8 font-semibold uppercase tracking-wider">
        You do not have the required clearance to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 transition-all uppercase tracking-wide text-xs"
      >
        Return to Safety
      </Link>
    </div>
  );
};
