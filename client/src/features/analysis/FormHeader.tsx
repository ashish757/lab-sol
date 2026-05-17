interface FormHeaderProps {
  title: string;
  onGenerateReport: () => void;
}

export const FormHeader = ({ title, onGenerateReport }: FormHeaderProps) => {
  return (
    <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10 shadow-sm flex-shrink-0">
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
      <button
        type="button"
        onClick={onGenerateReport}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
      >
        Generate Report
      </button>
    </div>
  );
};
