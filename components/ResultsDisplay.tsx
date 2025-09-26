import React from 'react';
import type { AnalysisResult } from '../types';
import { ParameterStatus } from '../types';
import { ParameterCard } from './ParameterCard';
import { STATUS_STYLES } from '../constants';

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

const SummaryCard: React.FC<{ status: ParameterStatus, message: string }> = ({ status, message }) => {
  const styles = STATUS_STYLES[status];
  const icon = status === ParameterStatus.ActionRequired 
    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

  return (
    <div className={`p-4 rounded-lg flex items-start space-x-3 ${styles.bg} ${styles.text}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-bold">{status === ParameterStatus.ActionRequired ? "Action Required" : "Overall Status: Good"}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const overallStatus = results.some(r => r.status === ParameterStatus.ActionRequired)
    ? ParameterStatus.ActionRequired
    : results.some(r => r.status === ParameterStatus.Acceptable)
    ? ParameterStatus.Acceptable
    : ParameterStatus.Ideal;

  const summaryMessage = 
    overallStatus === ParameterStatus.ActionRequired
      ? "One or more parameters are outside of our quality standards. See details below for required actions."
      : "All readings are within quality standards. Great job maintaining the pristine water for our guests.";

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analysis Results</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Here's how your readings compare to our quality standards.</p>

      <SummaryCard status={overallStatus} message={summaryMessage} />

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <ParameterCard key={result.parameter} result={result} />
        ))}
      </div>
    </div>
  );
};