import React from 'react';

const WaterWaveIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.62 7.76a.75.75 0 01.63.12l1.69 1.41a.75.75 0 00.91-.12l1.83-2.13a.75.75 0 111.18.98l-1.83 2.13a2.25 2.25 0 01-2.73.36l-1.69-1.41a2.25 2.25 0 00-1.93-.16.75.75 0 01-.63-1.28zm-2.8 3.06a.75.75 0 01.52-.22l2.22.61a.75.75 0 00.73-.23l1.88-1.88a.75.75 0 111.06 1.06l-1.88 1.88a2.25 2.25 0 01-2.19.69l-2.22-.61a.75.75 0 01-.12-1.3z" clipRule="evenodd" />
    </svg>
);

const PrintIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <WaterWaveIcon />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              Polynesian Bungalows Reads
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
            aria-label="Print report"
          >
            <PrintIcon />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};