import { DataPoint, SimulationConfig, ChartData } from '../types';

/**
 * Generates synthetic RDD data based on configuration.
 */
export const generateRddData = (config: SimulationConfig): ChartData[] => {
  const { cutoff, effectSize, noiseLevel, sampleSize, slope, curvature } = config;
  const data: ChartData[] = [];

  // Generate random X values centered around the cutoff roughly
  // Range: cutoff - 50 to cutoff + 50
  for (let i = 0; i < sampleSize; i++) {
    const x = (Math.random() * 100) - 50 + cutoff;
    const isTreated = x >= cutoff;
    
    // Base function: Y = alpha + beta*X + gamma*X^2
    // We normalize X relative to cutoff for the calculation to make slope intuitive
    const relX = x - cutoff;
    
    // Deterministic part
    let y = 50 + (slope * relX) + (curvature * relX * relX * 0.01);
    
    // Treatment Effect Jump
    if (isTreated) {
      y += effectSize;
    }

    // Random Noise
    // Box-Muller transform for normal distribution approximation or simple random
    const noise = (Math.random() - 0.5) * noiseLevel * 5;
    y += noise;

    data.push({
      id: i,
      x,
      y,
      isTreated,
    });
  }

  // Sort by X for proper line plotting
  data.sort((a, b) => a.x - b.x);

  // Simple Local Linear Regression (OLS) for visualization lines
  // We calculate two separate regressions: one for left, one for right
  const controlPoints = data.filter(d => !d.isTreated);
  const treatedPoints = data.filter(d => d.isTreated);

  const calculateRegression = (points: DataPoint[]) => {
    if (points.length < 2) return { slope: 0, intercept: 0 };
    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    return { slope: m, intercept: b };
  };

  const controlReg = calculateRegression(controlPoints);
  const treatedReg = calculateRegression(treatedPoints);

  // Assign fitted values back to data structure
  return data.map(point => {
    if (point.x < cutoff) {
      return {
        ...point,
        fittedControl: controlReg.slope * point.x + controlReg.intercept,
        fittedTreatment: undefined // Break the line
      };
    } else {
      return {
        ...point,
        fittedControl: undefined, // Break the line
        fittedTreatment: treatedReg.slope * point.x + treatedReg.intercept
      };
    }
  });
};