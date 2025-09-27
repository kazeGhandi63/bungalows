import React, { useMemo } from 'react';
import type { BungalowState } from '../types';
import { ParameterChart } from './ParameterChart';

interface DailyAverageReportProps {
  bungalows: Record<number, BungalowState>;
}

const ReportCard: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
);

export const DailyAverageReport: React.FC<DailyAverageReportProps> = ({ bungalows }) => {
    const reportData = useMemo(() => {
        const submittedBungalows = Object.entries(bungalows)
            .filter(([, state]) => state.results)
            .map(([id, state]) => ({ id: Number(id), ...state }));

        if (submittedBungalows.length === 0) {
            return null;
        }

        const count = submittedBungalows.length;
        const sums = submittedBungalows.reduce((acc, curr) => {
            acc.chlorine += curr.readings.chlorine;
            acc.ph += curr.readings.ph;
            acc.totalAlkalinity += curr.readings.totalAlkalinity;
            acc.temperature += curr.readings.temperature;
            return acc;
        }, { chlorine: 0, ph: 0, totalAlkalinity: 0, temperature: 0 });

        const averages = {
            chlorine: sums.chlorine / count,
            ph: sums.ph / count,
            totalAlkalinity: sums.totalAlkalinity / count,
            temperature: sums.temperature / count,
        };
        
        const chartData = {
            chlorine: submittedBungalows.map(b => ({ id: b.id, value: b.readings.chlorine })),
            ph: submittedBungalows.map(b => ({ id: b.id, value: b.readings.ph })),
        };
        
        return { averages, chartData, count };

    }, [bungalows]);


    if (!reportData) {
        return (
            <div className="mt-8 bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Daily Averages Report</h3>
                <p className="text-slate-500 dark:text-slate-400">Submit readings for at least one bungalow to generate the average report.</p>
            </div>
        );
    }
    
    const { averages, chartData, count } = reportData;

    return (
        <div className="mt-8 bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Daily Averages Report</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Based on {count} bungalow{count > 1 ? 's' : ''} with submitted readings.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <ReportCard label="Avg. Chlorine" value={`${averages.chlorine.toFixed(2)} ppm`} />
                <ReportCard label="Avg. pH" value={averages.ph.toFixed(2)} />
                <ReportCard label="Avg. Alkalinity" value={`${averages.totalAlkalinity.toFixed(0)} ppm`} />
                <ReportCard label="Avg. Temp" value={`${averages.temperature.toFixed(1)}°F`} />
            </div>

            <div className="space-y-8">
                <ParameterChart 
                    data={chartData.chlorine}
                    average={averages.chlorine}
                    parameterKey="chlorine"
                    label="Chlorine"
                    unit="ppm"
                />
                <ParameterChart 
                    data={chartData.ph}
                    average={averages.ph}
                    parameterKey="ph"
                    label="pH"
                    unit=""
                />
            </div>

        </div>
    );
};