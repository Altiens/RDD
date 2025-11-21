export interface DataPoint {
  id: number;
  x: number;
  y: number;
  isTreated: boolean;
  fittedY?: number; // For regression line
}

export interface SimulationConfig {
  cutoff: number;
  effectSize: number;
  noiseLevel: number;
  sampleSize: number;
  slope: number;
  curvature: number; // x^2 term
}

export interface ChartData extends DataPoint {
  fittedControl?: number;
  fittedTreatment?: number;
}