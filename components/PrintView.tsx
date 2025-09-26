import React from 'react';
import type { BungalowState, AnalysisResult } from '../types';
import { ParameterStatus } from '../types';

interface PrintViewProps {
  bungalows: Record<number, BungalowState>;
}

const getStatusColor = (status: ParameterStatus) => {
    switch(status) {
        case ParameterStatus.Ideal: return 'bg-green-100';
        case ParameterStatus.Acceptable: return 'bg-yellow-100';
        case ParameterStatus.ActionRequired: return 'bg-red-100';
        default: return 'bg-slate-100';
    }
}

const PrintCard: React.FC<{ bungalowId: number, bungalowState: BungalowState }> = ({ bungalowId, bungalowState }) => {
    const { results, attendantName } = bungalowState;
    return (
        <div className="border border-slate-300 rounded-lg p-3 break-inside-avoid">
            <div className="border-b border-slate-200 pb-1 mb-2">
                 <h3 className="font-bold text-lg text-slate-800">Bungalow {bungalowId}</h3>
                 {attendantName ? (
                    <p className="text-xs text-slate-600">Attendant: <strong>{attendantName}</strong></p>
                 ) : (
                    <p className="text-xs text-slate-500 italic">No attendant specified</p>
                 )}
            </div>

            {results ? (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-300">
                            <th className="text-left font-semibold text-slate-600 pb-1 px-1">Parameter</th>
                            <th className="text-right font-semibold text-slate-600 pb-1 px-1">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.parameter} className={`border-b border-slate-200 last:border-b-0 ${getStatusColor(result.status)}`}>
                                <td className="py-1 px-1">{result.parameter.replace('(LSI)', '').replace('(TDS)', '')}</td>
                                <td className="py-1 px-1 text-right font-mono">{result.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-slate-500 text-sm">No readings submitted.</p>
            )}
        </div>
    );
};

const PrintPage: React.FC<{ bungalowIds: number[], bungalows: Record<number, BungalowState>, pageNumber: number, totalPages: number }> = ({ bungalowIds, bungalows, pageNumber, totalPages }) => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
        <section className="print-page">
            <header className="flex justify-between items-center mb-4 border-b border-slate-400 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Polynesian Bungalows</h1>
                    <h2 className="text-lg text-slate-600">Water Quality Report</h2>
                </div>
                <div className="text-right">
                    <p className="text-slate-600">{currentDate}</p>
                    <p className="text-sm text-slate-500">Page {pageNumber} of {totalPages}</p>
                </div>
            </header>
            <div className="grid grid-cols-2 gap-4">
                {bungalowIds.map(id => (
                    <PrintCard key={id} bungalowId={id} bungalowState={bungalows[id]} />
                ))}
            </div>
        </section>
    );
};


export const PrintView: React.FC<PrintViewProps> = ({ bungalows }) => {
  const bungalowIds = Object.keys(bungalows).map(Number);
  const firstPageIds = bungalowIds.slice(0, 10);
  const secondPageIds = bungalowIds.slice(10, 20);

  return (
    <div className="printable-area text-black">
        <PrintPage 
            bungalowIds={firstPageIds} 
            bungalows={bungalows} 
            pageNumber={1}
            totalPages={2}
        />
        <PrintPage 
            bungalowIds={secondPageIds} 
            bungalows={bungalows} 
            pageNumber={2}
            totalPages={2}
        />
    </div>
  );
};