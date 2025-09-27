import React from 'react';
import { RANGES } from '../constants';

interface ParameterChartProps {
  data: { id: number; value: number }[];
  average: number;
  parameterKey: keyof typeof RANGES;
  label: string;
  unit: string;
}

export const ParameterChart: React.FC<ParameterChartProps> = ({ data, average, parameterKey, label, unit }) => {
  const width = 500;
  const height = 200;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const idealRange = RANGES[parameterKey].ideal;
  const acceptableRange = RANGES[parameterKey].acceptable ?? idealRange;

  const values = data.map(d => d.value);
  const yMin = Math.min(...values, acceptableRange[0]);
  const yMax = Math.max(...values, acceptableRange[1]);
  const yRange = yMax - yMin;
  const yPadding = yRange * 0.1; // 10% padding

  const finalYMin = Math.max(0, yMin - yPadding);
  const finalYMax = yMax + yPadding;

  const scaleX = (id: number) => {
    // Assuming data is sorted by id, or we find the index
    const index = data.findIndex(d => d.id === id);
    if (data.length <= 1) return chartWidth / 2;
    return (index / (data.length - 1)) * chartWidth;
  };
  
  const scaleY = (value: number) => {
    if (finalYMax === finalYMin) return chartHeight / 2; // Avoid division by zero
    return chartHeight - ((value - finalYMin) / (finalYMax - finalYMin)) * chartHeight;
  };

  const linePath = data
    .map(d => `${scaleX(d.id)},${scaleY(d.value)}`)
    .join(' ');
  
  const idealRangeY = scaleY(idealRange[1]);
  const idealRangeHeight = scaleY(idealRange[0]) - idealRangeY;

  return (
    <div>
      <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-300">{label} Trend</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2" aria-labelledby={`${parameterKey}-title`} role="img">
        <title id={`${parameterKey}-title`}>Chart of {label} readings across bungalows.</title>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Ideal Range */}
          <rect
            x="0"
            y={idealRangeY}
            width={chartWidth}
            height={idealRangeHeight > 0 ? idealRangeHeight : 0}
            fill="rgba(45, 212, 191, 0.1)"
            stroke="rgba(45, 212, 191, 0.3)"
            strokeDasharray="2"
          />
          <text x={chartWidth - 5} y={scaleY((idealRange[0] + idealRange[1]) / 2)} textAnchor="end" alignmentBaseline="middle" fontSize="10" fill="rgb(20 184 166)" className="font-semibold">Ideal</text>

          {/* Average Line */}
          <line
            x1="0"
            y1={scaleY(average)}
            x2={chartWidth}
            y2={scaleY(average)}
            stroke="rgb(234 179 8)"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text x={-5} y={scaleY(average)} textAnchor="end" alignmentBaseline="middle" fontSize="10" fill="rgb(234 179 8)" className="font-bold">Avg: {average.toFixed(2)}</text>

          {/* Data Line */}
          {data.length > 1 && <polyline
            fill="none"
            stroke="rgb(59 130 246)"
            strokeWidth="2"
            points={linePath}
          />}

          {/* Data Points */}
          {data.map(({ id, value }) => (
            <circle
              key={id}
              cx={scaleX(id)}
              cy={scaleY(value)}
              r="3"
              fill="rgb(59 130 246)"
            >
                <title>Bungalow {id}: {value.toFixed(2)} {unit}</title>
            </circle>
          ))}

          {/* Y-Axis Labels */}
          <text x={-5} y={scaleY(finalYMax)} textAnchor="end" alignmentBaseline="hanging" fontSize="10" fill="currentColor" className="text-slate-500">{finalYMax.toFixed(1)}</text>
          <text x={-5} y={scaleY(finalYMin)} textAnchor="end" alignmentBaseline="baseline" fontSize="10" fill="currentColor" className="text-slate-500">{finalYMin.toFixed(1)}</text>

          {/* X-Axis Labels */}
          {data.length > 0 && <>
            <text x={0} y={chartHeight + 5} textAnchor="start" alignmentBaseline="hanging" fontSize="10" fill="currentColor" className="text-slate-500">Bungalow {data[0]?.id}</text>
            <text x={chartWidth} y={chartHeight + 5} textAnchor="end" alignmentBaseline="hanging" fontSize="10" fill="currentColor" className="text-slate-500">Bungalow {data[data.length-1]?.id}</text>
          </>}

        </g>
      </svg>
    </div>
  );
};