import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-8 py-6 flex items-center justify-between backdrop-blur-md bg-white/50 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Enterprise Analytics</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/analysis" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Analysis Desk</Link>
          <button className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl leading-tight">
          High-Performance <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enterprise Reporting</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
          Proprietary calculation engine designed for internal analysts. Experience zero-latency data entry and real-time generation of mission-critical reports.
        </p>
        
        <div className="flex items-center">
          <Link to="/analysis" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-1">
            <span className="relative z-10">Launch Analysis Desk</span>
            <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </Link>
      
        </div>
      </main>
    </div>
  );
};
