import React from 'react';

export const WelcomeSplash: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
             <div className="flex justify-center items-center mb-4">
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Aloha! Ready to Check the Waters?</h2>
            <p className="text-slate-500 dark:text-slate-400">
                Enter the water readings for a bungalow's lagoon in the form on the left.
                <br />
                We'll check them against our high standards for guest safety and experience.
            </p>
        </div>
    );
};