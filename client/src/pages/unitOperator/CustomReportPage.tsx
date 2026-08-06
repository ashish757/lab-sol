import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Copy, Calendar, Activity, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import type { RootState } from '../../store/store';
import { useFetchUnitLogsQuery, useGetActiveSessionQuery } from '../../store/api/apiSlice';
import { customReportFields } from '../../config/customReportFields';
import { PAGES } from '../../config/routesConfig';

export const CustomReportPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Field search and selection
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    return customReportFields.filter(f => f.defaultSelected).map(f => f.id);
  });

  const { data: session, isLoading: sessionLoading } = useGetActiveSessionQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });

  const { data: logs = [], isLoading: logsLoading } = useFetchUnitLogsQuery(user?.unitId as string, {
    skip: !user?.unitId,
  });

  const toggleField = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const processedData = useMemo(() => {
    if (!logs || !Array.isArray(logs)) return [];
    
    let filtered = logs.filter((log: any) => {
      const logDateVal = log.createdAt || log.date || log.logDate;
      if (!logDateVal) return false;
      const d = new Date(logDateVal).toISOString().split('T')[0];
      
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      
      return true;
    });
    
    return filtered.map((log: any) => {
      const payload = typeof log.payload === 'string' ? JSON.parse(log.payload) : (log.payload || {});
      const calc = typeof log.calculation?.calculatedMetrics === 'string' 
        ? JSON.parse(log.calculation.calculatedMetrics) 
        : (log.calculation?.calculatedMetrics || {});
        
      const logDateVal = log.createdAt || log.date || log.logDate;
      const dateStr = logDateVal ? new Date(logDateVal).toISOString().split('T')[0] : '';
        
      return {
        ...payload,
        ...calc,
        date: dateStr,
        plantName: session?.plantName || '',
        plantCode: session?.plantCode || '',
        id: log.id,
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [logs, startDate, endDate, session]);

  const handleCopyTSV = async () => {
    if (processedData.length === 0) return;
    
    const headers = selectedFields.map(id => {
      const field = customReportFields.find(f => f.id === id);
      return field ? field.label : id;
    });
    
    const rows = processedData.map(row => {
      return selectedFields.map(id => {
        const val = row[id];
        return val !== undefined && val !== null ? String(val) : '';
      }).join('\t');
    });
    
    const tsv = [headers.join('\t'), ...rows].join('\n');
    
    try {
      await navigator.clipboard.writeText(tsv);
      alert('Data copied to clipboard! You can now paste it directly into Excel.');
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Failed to copy data. Please try again.');
    }
  };

  // Group filtered fields for the sidebar
  const groupedFields = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = customReportFields.filter(f => f.label.toLowerCase().includes(lowerQuery));
    
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(f => {
      if (!groups[f.group]) groups[f.group] = [];
      groups[f.group].push(f);
    });
    return groups;
  }, [searchQuery]);

  return (
    <div className="flex-1 flex overflow-hidden flex-col bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex flex-col gap-1">
          <Link to={PAGES.UNIT_DASHBOARD} className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider w-fit">
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            Custom Report Generator
          </h1>
        </div>
        
        <button
          onClick={handleCopyTSV}
          disabled={processedData.length === 0 || selectedFields.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
        >
          <Copy className="w-4 h-4" />
          Copy Data for Excel
        </button>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        
        {/* Left Sidebar: Filters & Fields */}
        <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-0">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date Range
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-slate-100 flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Fields to Include
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px]">
                {selectedFields.length} selected
              </span>
            </h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {Object.entries(groupedFields).map(([group, fields]) => (
              <div key={group} className="mb-4">
                <div className="px-2 py-1.5 mb-1 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-10">
                  {group}
                </div>
                <div className="flex flex-col gap-0.5">
                  {fields.map(field => {
                    const isSelected = selectedFields.includes(field.id);
                    return (
                      <label 
                        key={field.id}
                        className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm select-none ${isSelected ? 'font-bold text-emerald-900' : 'font-medium text-slate-600'}`}>
                          {field.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {Object.keys(groupedFields).length === 0 && (
              <div className="text-center p-6 text-slate-400 text-sm font-semibold">
                No fields found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Data Table */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col relative">
          
          {logsLoading || sessionLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Data...</p>
              </div>
            </div>
          ) : processedData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-slate-50/50">
              <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Activity size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">No Data Found</h3>
                <p className="text-sm font-medium text-slate-500">
                  There are no logs matching the selected date range. Try expanding your dates.
                </p>
              </div>
            </div>
          ) : selectedFields.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-slate-50/50">
              <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Select Fields</h3>
                <p className="text-sm font-medium text-slate-500">
                  Choose the fields from the left sidebar that you want to include in your custom report.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden inline-block min-w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {selectedFields.map((id, index) => {
                        const field = customReportFields.find(f => f.id === id);
                        return (
                          <th 
                            key={id} 
                            className={`px-4 py-3 bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-200 whitespace-nowrap ${index !== selectedFields.length - 1 ? 'border-r border-slate-200' : ''}`}
                          >
                            {field ? field.label : id}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.map((row, rowIndex) => (
                      <tr key={row.id || rowIndex} className="hover:bg-slate-50/80 transition-colors">
                        {selectedFields.map((id, colIndex) => {
                          const val = row[id];
                          const displayVal = val !== undefined && val !== null && val !== '' ? String(val) : '—';
                          return (
                            <td 
                              key={`${row.id}-${id}`} 
                              className={`px-4 py-2.5 text-sm font-semibold text-slate-700 border-b border-slate-100 whitespace-nowrap ${colIndex !== selectedFields.length - 1 ? 'border-r border-slate-100' : ''}`}
                            >
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
    </div>
  );
};
