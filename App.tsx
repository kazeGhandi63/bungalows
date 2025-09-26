import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReadingsForm } from './components/ReadingsForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { WelcomeSplash } from './components/WelcomeSplash';
import { BungalowSelector } from './components/BungalowSelector';
import { PrintView } from './components/PrintView';
import { analyzeReadings } from './services/poolAnalyzer';
import type { PoolReadings, AnalysisResult, BungalowState } from './types';

const BUNGALOW_COUNT = 20;

// Default state for a new bungalow
const defaultReadings: PoolReadings = {
  chlorine: 3.0,
  ph: 7.5,
  totalAlkalinity: 100,
  calciumHardness: 300,
  temperature: 85,
  tds: 1000,
};

// Helper to initialize state for all bungalows
const initializeBungalows = (): Record<number, BungalowState> => {
  const bungalows: Record<number, BungalowState> = {};
  for (let i = 1; i <= BUNGALOW_COUNT; i++) {
    bungalows[i] = {
      readings: { ...defaultReadings }, // Create a copy
      results: null,
      attendantName: '',
    };
  }
  return bungalows;
};


const App: React.FC = () => {
  const [bungalows, setBungalows] = useState<Record<number, BungalowState>>(initializeBungalows);
  const [selectedBungalowId, setSelectedBungalowId] = useState<number>(1);

  const handleReadingsSubmit = (readings: PoolReadings, attendantName: string) => {
    const results = analyzeReadings(readings);
    setBungalows(prev => ({
      ...prev,
      [selectedBungalowId]: { readings, results, attendantName },
    }));
  };

  const currentBungalow = bungalows[selectedBungalowId];
  const allBungalowResults = Array.from({ length: BUNGALOW_COUNT }, (_, i) => bungalows[i + 1].results);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-slate-800 dark:to-teal-900 text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        <BungalowSelector 
            bungalowCount={BUNGALOW_COUNT}
            bungalowResults={allBungalowResults}
            selectedBungalowId={selectedBungalowId}
            onSelect={setSelectedBungalowId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ReadingsForm 
            key={selectedBungalowId} // IMPORTANT: Re-mounts form on bungalow change
            onSubmit={handleReadingsSubmit}
            initialReadings={currentBungalow.readings}
            initialAttendantName={currentBungalow.attendantName}
          />
          <div className="lg:sticky lg:top-8">
            {currentBungalow.results ? (
              <ResultsDisplay results={currentBungalow.results} />
            ) : (
              <WelcomeSplash />
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>Disclaimer: This tool is for internal monitoring at Polynesian Bungalows. Always follow official operational procedures and use certified testing equipment.</p>
      </footer>
      <PrintView bungalows={bungalows} />
    </div>
  );
};

export default App;