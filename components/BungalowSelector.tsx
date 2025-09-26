import React from 'react';
import type { AnalysisResult } from '../types';
import { ParameterStatus } from '../types';

// A utility to determine overall status
const getOverallStatus = (results: AnalysisResult[] | null): ParameterStatus => {
  if (!results) {
    // Treat no results as a neutral/ideal state for UI purposes
    return ParameterStatus.Ideal;
  }
  if (results.some(r => r.status === ParameterStatus.ActionRequired)) {
    return ParameterStatus.ActionRequired;
  }
  if (results.some(r => r.status === ParameterStatus.Acceptable)) {
    return ParameterStatus.Acceptable;
  }
  return ParameterStatus.Ideal;
};

interface BungalowSelectorProps {
  bungalowCount: number;
  bungalowResults: (AnalysisResult[] | null)[];
  selectedBungalowId: number;
  onSelect: (id: number) => void;
}

export const BungalowSelector: React.FC<BungalowSelectorProps> = ({
  bungalowCount,
  bungalowResults,
  selectedBungalowId,
  onSelect,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select a Bungalow</h2>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
        {Array.from({ length: bungalowCount }, (_, i) => i + 1).map((id) => {
          const results = bungalowResults[id - 1];
          const status = getOverallStatus(results);
          
          const isSelected = id === selectedBungalowId;
          const statusColor = {
            [ParameterStatus.Ideal]: 'bg-green-500',
            [ParameterStatus.Acceptable]: 'bg-yellow-500',
            [ParameterStatus.ActionRequired]: 'bg-red-500',
          }[status];
          
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`relative rounded-lg p-2 text-center font-bold text-lg aspect-square flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                isSelected 
                ? 'bg-teal-600 text-white ring-2 ring-teal-500 shadow-md' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              aria-label={`Bungalow ${id}`}
              aria-pressed={isSelected}
            >
              <span className={`absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white/50 dark:ring-slate-800/50 ${statusColor} ${!results ? 'hidden' : ''}`} title={`Status: ${status}`}></span>
              {id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
