import type { ParameterStatus } from './types';
import { ParameterStatus as StatusEnum } from './types';

interface Range {
  ideal: [number, number];
  acceptable?: [number, number];
}

export const RANGES: { [key: string]: Range } = {
  chlorine: { ideal: [2.0, 5.0], acceptable: [1.0, 10.0] },
  ph: { ideal: [7.2, 7.8] },
  totalAlkalinity: { ideal: [80, 120], acceptable: [60, 180] },
  calciumHardness: { ideal: [200, 400] },
  temperature: { ideal: [78, 95], acceptable: [70, 104] },
  tds: { ideal: [400, 1500], acceptable: [400, 2000] },
  lsi: { ideal: [-0.3, 0.3], acceptable: [-0.5, 0.5] },
  flow: { ideal: [40, 80], acceptable: [30, 90] },
};

export const STATUS_STYLES: { [key in ParameterStatus]: { bg: string; text: string; border: string } } = {
  [StatusEnum.Ideal]: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-500',
  },
  [StatusEnum.Acceptable]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-500',
  },
  [StatusEnum.ActionRequired]: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-500',
  },
};