export const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-50 absolute inset-0 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 shadow-md"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading module...</p>
      </div>
    </div>
  );
};
