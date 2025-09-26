
import React from 'react';
import type { AnalysisResult } from '../types';
import { STATUS_STYLES } from '../constants';

interface ParameterCardProps {
  result: AnalysisResult;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ result }) => {
  const styles = STATUS_STYLES[result.status];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${styles.bg} ${styles.border} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {result.icon}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{result.parameter}</p>
            <p className={`text-xs font-medium uppercase tracking-wider ${styles.text}`}>{result.status}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 dark:text-white">{result.value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ideal: {result.idealRange}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 pl-9">{result.message}</p>
    </div>
  );
};
