import React from 'react';
import type { PoolReadings, AnalysisResult } from '../types';
import { ParameterStatus } from '../types';
import { RANGES } from '../constants';

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
const CheckCircleIcon: React.FC<{className: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
const ExclamationCircleIcon: React.FC<{className: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
const XCircleIcon: React.FC<{className: string}> = ({ className }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);


function getStatus(value: number, range: { ideal: [number, number]; acceptable?: [number, number] }): ParameterStatus {
  if (value >= range.ideal[0] && value <= range.ideal[1]) {
    return ParameterStatus.Ideal;
  }
  if (range.acceptable && value >= range.acceptable[0] && value <= range.acceptable[1]) {
    return ParameterStatus.Acceptable;
  }
  return ParameterStatus.ActionRequired;
}

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
function getIcon(status: ParameterStatus) {
  switch (status) {
    case ParameterStatus.Ideal:
      return React.createElement(CheckCircleIcon, { className: "w-6 h-6 text-green-500" });
    case ParameterStatus.Acceptable:
      return React.createElement(ExclamationCircleIcon, { className: "w-6 h-6 text-yellow-500" });
    case ParameterStatus.ActionRequired:
      return React.createElement(XCircleIcon, { className: "w-6 h-6 text-red-500" });
  }
}

/**
 * Gets a factor from a lookup table. Finds the factor corresponding to the
 * largest key in the table that is less than or equal to the value.
 */
function getFactor(value: number, points: [number, number][]): number {
  let factor = 0;
  for (const point of points) {
    if (value >= point[0]) {
      factor = point[1];
    } else {
      break;
    }
  }
  return factor;
}

export function analyzeReadings(readings: PoolReadings): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  
  // Chlorine
  const clStatus = getStatus(readings.chlorine, RANGES.chlorine);
  let clMessage = 'Adjust chlorine to ensure proper sanitation.';
  if (clStatus === ParameterStatus.Ideal) {
    clMessage = 'Sanitizer level is optimal. Continue daily monitoring.';
  } else if (clStatus === ParameterStatus.Acceptable) {
    clMessage = 'Chlorine is acceptable. Continue monitoring and adjust as needed.';
  } else if (readings.chlorine < (RANGES.chlorine.acceptable?.[0] ?? RANGES.chlorine.ideal[0])) {
    clMessage = 'Chlorine is critically low. Shock the water immediately and increase daily dosage.';
  } else if (readings.chlorine > (RANGES.chlorine.acceptable?.[1] ?? RANGES.chlorine.ideal[1])) {
    clMessage = 'Chlorine is too high. Stop adding chlorine and allow level to decrease naturally.';
  }
  results.push({
    parameter: 'Chlorine',
    value: `${readings.chlorine.toFixed(2)} ppm`,
    status: clStatus,
    idealRange: `${RANGES.chlorine.ideal[0]} - ${RANGES.chlorine.ideal[1]} ppm`,
    message: clMessage,
    icon: getIcon(clStatus),
  });

  // pH
  const phStatus = getStatus(readings.ph, RANGES.ph);
  results.push({
    parameter: 'pH',
    value: readings.ph.toFixed(2),
    status: phStatus,
    idealRange: `${RANGES.ph.ideal[0]} - ${RANGES.ph.ideal[1]}`,
    message: phStatus === ParameterStatus.Ideal ? 'pH is perfectly balanced.' : 'Adjust pH to prevent irritation and equipment damage.',
    icon: getIcon(phStatus),
  });

  // Temperature
  const tempStatus = getStatus(readings.temperature, RANGES.temperature);
  results.push({
    parameter: 'Temperature',
    value: `${readings.temperature}°F`,
    status: tempStatus,
    idealRange: `${RANGES.temperature.ideal[0]}°F - ${RANGES.temperature.ideal[1]}°F`,
    message: tempStatus !== ParameterStatus.ActionRequired ? 'Water temperature is in a safe and comfortable range.' : 'Temperature exceeds recommended limit of 104°F for spas.',
    icon: getIcon(tempStatus),
  });

  // Flow Rate
  const flowStatus = getStatus(readings.flow, RANGES.flow);
  let flowMessage = 'Adjust flow rate to ensure proper circulation and filtration.';
  if (flowStatus === ParameterStatus.Ideal) {
    flowMessage = 'Flow rate is optimal for filtration and feature performance.';
  } else if (flowStatus === ParameterStatus.Acceptable) {
    flowMessage = 'Flow is acceptable, but monitor for any circulation issues.';
  } else if (readings.flow < (RANGES.flow.acceptable?.[0] ?? RANGES.flow.ideal[0])) {
    flowMessage = 'Flow is low. Check for obstructions, clean filters, and inspect pump.';
  } else if (readings.flow > (RANGES.flow.acceptable?.[1] ?? RANGES.flow.ideal[1])) {
    flowMessage = 'Flow is high. This may indicate an issue or cause unnecessary wear on equipment. Check pump settings.';
  }
  results.push({
    parameter: 'Flow Rate',
    value: `${readings.flow} GPM`,
    status: flowStatus,
    idealRange: `${RANGES.flow.ideal[0]} - ${RANGES.flow.ideal[1]} GPM`,
    message: flowMessage,
    icon: getIcon(flowStatus),
  });

  // Total Alkalinity
  const taStatus = getStatus(readings.totalAlkalinity, RANGES.totalAlkalinity);
  let taMessage = 'Adjust to stabilize pH and prevent fluctuations.';
  if (taStatus === ParameterStatus.Ideal) {
    taMessage = 'Alkalinity is buffering pH effectively.';
  } else if (taStatus === ParameterStatus.Acceptable) {
    taMessage = 'Alkalinity is acceptable but should be monitored closely.';
  } else if (readings.totalAlkalinity < (RANGES.totalAlkalinity.acceptable?.[0] ?? RANGES.totalAlkalinity.ideal[0])) {
    taMessage = 'Alkalinity is low. Add sodium bicarbonate (biocarb) to raise and protect pH.';
  } else if (readings.totalAlkalinity > (RANGES.totalAlkalinity.acceptable?.[1] ?? RANGES.totalAlkalinity.ideal[1])) {
    taMessage = 'Alkalinity is high, which can cause pH to drift up. Add muriatic acid carefully to lower.';
  }
  results.push({
    parameter: 'Total Alkalinity',
    value: `${readings.totalAlkalinity} ppm`,
    status: taStatus,
    idealRange: `${RANGES.totalAlkalinity.ideal[0]} - ${RANGES.totalAlkalinity.ideal[1]} ppm`,
    message: taMessage,
    icon: getIcon(taStatus),
  });

  // Calcium Hardness
  const chStatus = getStatus(readings.calciumHardness, RANGES.calciumHardness);
  let chMessage = 'Adjust to prevent scaling or etching of pool surfaces.';
  if (chStatus === ParameterStatus.Ideal) {
      chMessage = 'Calcium level protects surfaces.';
  } else if (readings.calciumHardness < RANGES.calciumHardness.ideal[0]) {
      chMessage = 'Hardness is low, which can cause etching. Add calcium chloride to increase.';
  } else if (readings.calciumHardness > RANGES.calciumHardness.ideal[1]) {
      chMessage = 'Hardness is high, which can cause scaling. Consider a partial drain and refill with softer water.';
  }
  results.push({
    parameter: 'Calcium Hardness',
    value: `${readings.calciumHardness} ppm`,
    status: chStatus,
    idealRange: `${RANGES.calciumHardness.ideal[0]} - ${RANGES.calciumHardness.ideal[1]} ppm`,
    message: chMessage,
    icon: getIcon(chStatus),
  });

  // Total Dissolved Solids
  const tdsStatus = getStatus(readings.tds, RANGES.tds);
  results.push({
    parameter: 'Total Dissolved Solids (TDS)',
    value: `${readings.tds} ppm`,
    status: tdsStatus,
    idealRange: `${RANGES.tds.ideal[0]} - ${RANGES.tds.ideal[1]} ppm`,
    message: tdsStatus !== ParameterStatus.ActionRequired ? 'TDS level is good.' : 'High TDS can reduce chlorine effectiveness. Consider partial drain and refill.',
    icon: getIcon(tdsStatus),
  });
  
  // LSI Calculation
  const TF_POINTS: [number, number][] = [[32, 0.0], [38, 0.1], [46, 0.2], [53, 0.3], [60, 0.4], [66, 0.5], [76, 0.6], [84, 0.7], [94, 0.8], [105, 0.9]];
  const CF_POINTS: [number, number][] = [[25, 1.0], [50, 1.3], [75, 1.5], [100, 1.6], [150, 1.8], [200, 1.9], [300, 2.1], [400, 2.2], [800, 2.5]];
  const AF_POINTS: [number, number][] = [[25, 1.4], [50, 1.7], [75, 1.9], [100, 2.0], [150, 2.2], [200, 2.3], [300, 2.5], [400, 2.6]];

  const tempFactor = getFactor(readings.temperature, TF_POINTS);
  const calciumFactor = getFactor(readings.calciumHardness, CF_POINTS);
  const alkalinityFactor = getFactor(readings.totalAlkalinity, AF_POINTS);
  const tdsFactor = readings.tds < 1000 ? 12.1 : 12.2;

  const lsi = parseFloat((readings.ph + tempFactor + calciumFactor + alkalinityFactor - tdsFactor).toFixed(2));
  
  const lsiStatus = getStatus(lsi, RANGES.lsi);
  let lsiMessage = 'Water is balanced and stable.';
  if (lsi < RANGES.lsi.ideal[0]) {
      lsiMessage = 'Water is corrosive, which can damage surfaces and equipment.';
  } else if (lsi > RANGES.lsi.ideal[1]) {
      lsiMessage = 'Water is prone to scaling, which can cause cloudy water and clog equipment.';
  }

  results.push({
    parameter: 'Langelier Saturation Index (LSI)',
    value: lsi.toFixed(2),
    status: lsiStatus,
    idealRange: `${RANGES.lsi.ideal[0]} to ${RANGES.lsi.ideal[1]}`,
    message: lsiMessage,
    icon: getIcon(lsiStatus),
  });


  return results;
}