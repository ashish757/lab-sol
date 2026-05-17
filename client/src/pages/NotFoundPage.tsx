import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-slate-200/50 to-indigo-100/50 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md backdrop-blur-xl bg-white/60 p-12 rounded-3xl border border-white/40 shadow-2xl shadow-slate-200/50">
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600 mb-6 drop-shadow-sm">
          404
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The requested endpoint does not exist or you do not have permission to access it. Please verify the URL.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
