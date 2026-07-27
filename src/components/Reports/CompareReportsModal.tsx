import React, { useState } from 'react';
import { MedicalReport } from '../../types';
import {
  X,
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface CompareReportsModalProps {
  reports: MedicalReport[];
  isOpen: boolean;
  onClose: () => void;
}

export const CompareReportsModal: React.FC<CompareReportsModalProps> = ({
  reports,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [selectedMetric, setSelectedMetric] = useState('Hemoglobin');

  // Collect unique test names from all reports
  const allTestNamesSet = new Set<string>();
  reports.forEach((rep) => {
    rep.results.forEach((res) => {
      if (res.testName) allTestNamesSet.add(res.testName.split('(')[0].trim());
    });
  });

  const availableMetrics = Array.from(allTestNamesSet);
  if (availableMetrics.length === 0) {
    availableMetrics.push('Hemoglobin', 'Total Cholesterol', 'Fasting Blood Sugar');
  }

  // Sort reports chronologically
  const sortedReports = [...reports].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare recharts data
  const chartData = sortedReports.map((rep) => {
    const matchingResult = rep.results.find((r) =>
      r.testName.toLowerCase().includes(selectedMetric.toLowerCase())
    );

    const val = matchingResult ? parseFloat(matchingResult.value) : null;

    return {
      date: rep.date,
      title: rep.title,
      value: isNaN(val as number) ? null : val,
      unit: matchingResult?.unit || '',
      status: matchingResult?.status || 'Normal',
    };
  }).filter((item) => item.value !== null);

  const firstVal = chartData[0]?.value;
  const lastVal = chartData[chartData.length - 1]?.value;

  const isImproving =
    firstVal && lastVal
      ? selectedMetric.toLowerCase().includes('cholesterol') || selectedMetric.toLowerCase().includes('sugar')
        ? lastVal <= firstVal
        : lastVal >= firstVal
      : true;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <LineChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Lab Report Trend Comparison</h2>
              <p className="text-xs text-slate-500 font-medium">
                Track historical changes across medical reports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector for metric */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Lab Metric to Compare
          </label>
          <div className="flex flex-wrap gap-2">
            {availableMetrics.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedMetric === metric
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* Trajectory Insights Banner */}
        {firstVal !== undefined && lastVal !== undefined && (
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              isImproving
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              {isImproving ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {selectedMetric}: Moved from {firstVal} to {lastVal} {chartData[0]?.unit}
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isImproving
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-rose-200 text-rose-900'
              }`}
            >
              {isImproving ? 'Favorable Trend' : 'Requires Follow-up'}
            </span>
          </div>
        )}

        {/* Recharts Area */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-64 w-full">
          {chartData.length < 1 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Info className="w-8 h-8 mb-1" />
              <p>Insufficient historical data points for {selectedMetric}.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs font-medium shadow-lg">
                          <p className="font-bold text-blue-300">{data.date}</p>
                          <p>{data.title}</p>
                          <p className="text-emerald-400 font-extrabold mt-0.5">
                            {selectedMetric}: {data.value} {data.unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedMetric}
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-[11px] text-slate-500 text-center font-medium">
          Note: Always discuss lab trend variations with your attending physician.
        </p>
      </div>
    </div>
  );
};
