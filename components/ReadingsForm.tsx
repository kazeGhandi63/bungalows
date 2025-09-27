import React, { useState } from 'react';
import type { PoolReadings } from '../types';

interface ReadingsFormProps {
  onSubmit: (readings: PoolReadings, attendantName: string) => void;
  initialReadings: PoolReadings;
  initialAttendantName?: string;
}

interface FormFieldProps {
    id: keyof PoolReadings;
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, unit, value, min, max, step, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
        </label>
        <div className="mt-1 flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm transition-all focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
            <input
                type="number"
                name={id}
                id={id}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                className="w-full p-3 bg-transparent border-0 rounded-l-md text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                placeholder={`${min} - ${max}`}
                required
            />
            <span className="px-3 text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-600">{unit}</span>
        </div>
    </div>
);


export const ReadingsForm: React.FC<ReadingsFormProps> = ({ onSubmit, initialReadings, initialAttendantName }) => {
  const [readings, setReadings] = useState<PoolReadings>(initialReadings);
  const [attendantName, setAttendantName] = useState(initialAttendantName || '');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReadings(prev => ({ ...prev, [name as keyof PoolReadings]: parseFloat(value) || 0 }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(readings, attendantName);
  };

  const formFields: Omit<FormFieldProps, 'value' | 'onChange'>[] = [
      { id: 'chlorine', label: 'Chlorine', unit: 'ppm', min: 0, max: 15, step: 0.1 },
      { id: 'ph', label: 'pH', unit: '', min: 6.0, max: 9.0, step: 0.1 },
      { id: 'totalAlkalinity', label: 'Total Alkalinity', unit: 'ppm', min: 0, max: 300, step: 1 },
      { id: 'calciumHardness', label: 'Calcium Hardness', unit: 'ppm', min: 0, max: 1000, step: 1 },
      { id: 'tds', label: 'Total Dissolved Solids (TDS)', unit: 'ppm', min: 0, max: 3000, step: 10 },
      { id: 'temperature', label: 'Water Temperature', unit: '°F', min: 32, max: 110, step: 1 },
      { id: 'flow', label: 'Flow Rate', unit: 'GPM', min: 0, max: 100, step: 1 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Enter Bungalow Readings</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Input the latest test results for the bungalows' water features.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="attendantName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Pool Attendant
            </label>
            <div className="mt-1">
                <input
                    type="text"
                    name="attendantName"
                    id="attendantName"
                    value={attendantName}
                    onChange={(e) => setAttendantName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Enter your name"
                    required
                />
            </div>
        </div>

        {formFields.map(field => (
            <FormField 
                key={field.id}
                {...field}
                value={readings[field.id]}
                onChange={handleChange}
            />
        ))}

        <button 
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 transition-transform transform hover:scale-105"
        >
          Analyze Readings
        </button>
      </form>
    </div>
  );
};