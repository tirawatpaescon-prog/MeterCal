export type RefInputMode = 'direct' | 'vipf';
export type PhaseMode = '1phase' | '3phase';

export interface MeterFormData {
  revKwh: number;
  revolutions: number;
  timeSec: number;
  refMode: RefInputMode;
  directKw: number;
  phaseMode: PhaseMode;
  voltage: number;
  current: number;
  powerFactor: number;
  // 3-Phase individual currents
  currentA: number;
  currentB: number;
  currentC: number;
  // CT / Multiplier
  multiplier: number;
  // Meter identification details
  meterNo: string;
  customerName: string;
  location: string;
  inspectorName: string;
  notes: string;
}

export interface MeterCalculationResult {
  meterKw: number;
  refKw: number;
  errorPercent: number;
  isNormal: boolean;
  diffKw: number;
  rpm: number;
  timePerRev: number;
  multiplier: number;
  calculatedAt: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  dateStr: string;
  meterNo: string;
  customerName: string;
  location: string;
  inspectorName: string;
  revKwh: number;
  revolutions: number;
  timeSec: number;
  refKw: number;
  meterKw: number;
  errorPercent: number;
  isNormal: boolean;
  multiplier: number;
  notes?: string;
}

export interface PopularConstant {
  value: number;
  label: string;
  typicalMeter: string;
  currentRating: string;
}
