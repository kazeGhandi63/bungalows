export interface PoolReadings {
  ph: number;
  chlorine: number;
  totalAlkalinity: number;
  calciumHardness: number;
  temperature: number;
  tds: number;
  flow: number;
}

export enum ParameterStatus {
  Ideal = 'Ideal',
  Acceptable = 'Acceptable',
  ActionRequired = 'Action Required',
}

export interface AnalysisResult {
  parameter: string;
  value: string;
  status: ParameterStatus;
  idealRange: string;
  message: string;
  icon: JSX.Element;
}

export interface BungalowState {
  readings: PoolReadings;
  results: AnalysisResult[] | null;
  attendantName?: string;
}