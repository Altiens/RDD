import React, { useState, useEffect, useMemo } from 'react';
import RddChart from './components/RddChart';
import ControlSlider from './components/ControlSlider';
import { SimulationConfig } from './types';
import { generateRddData } from './utils/mathUtils';
import { getRddExplanation } from './services/geminiService';

// Initial State
const INITIAL_CONFIG: SimulationConfig = {
  cutoff: 50,
  effectSize: 15,
  noiseLevel: 5,
  sampleSize: 200,
  slope: 0.5,
  curvature: 0,
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoize data generation to avoid unnecessary recalc on other state changes
  const data = useMemo(() => generateRddData(config), [config]);

  // Handle Slider Changes
  const updateConfig = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateExplanation = async () => {
    setIsLoading(true);
    setExplanation("");
    const text = await getRddExplanation(config);
    setExplanation(text);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      
      {/* Left Column: Visualization & Header */}
      <div className="flex-1 flex flex-col gap-6">
        <header className="mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 font-serif tracking-tight">
            The Identification Strategy
          </h1>
          <p className="text-slate-400 mt-2 font-serif text-lg">
            Exploring Regression Discontinuity
          </p>
        </header>

        <RddChart data={data} config={config} />

        {/* Math Context Box */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 font-serif text-slate-300 leading-relaxed">
          <p className="mb-2">
            <strong className="text-math-secondary">Equation:</strong>
          </p>
          <div className="font-mono text-sm md:text-base bg-slate-900 p-4 rounded border border-slate-800 overflow-x-auto">
            Yᵢ = α + β₁(Xᵢ - c) + ρDᵢ + εᵢ
          </div>
          <p className="mt-4 text-sm italic opacity-80">
            Where <span className="text-math-secondary font-bold">c</span> is the cutoff, 
            <span className="text-math-highlight font-bold"> Dᵢ</span> is the treatment status (1 if X &ge; c), 
            and <span className="text-math-accent font-bold">ρ</span> is the causal effect we want to measure.
          </p>
        </div>
      </div>

      {/* Right Column: Controls & AI */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        
        {/* Controls Panel */}
        <div className="bg-math-card p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-2 text-blue-200">Parameters</h3>
          
          <ControlSlider 
            label="Cutoff Threshold (c)" 
            value={config.cutoff} 
            min={10} max={90} step={1} 
            onChange={(v) => updateConfig('cutoff', v)} 
            colorClass="text-math-secondary"
          />
          
          <ControlSlider 
            label="Treatment Effect (ρ)" 
            value={config.effectSize} 
            min={-30} max={50} step={1} 
            onChange={(v) => updateConfig('effectSize', v)} 
            colorClass="text-math-highlight"
          />

          <ControlSlider 
            label="Noise / Variance (ε)" 
            value={config.noiseLevel} 
            min={0} max={20} step={0.5} 
            onChange={(v) => updateConfig('noiseLevel', v)} 
          />

          <ControlSlider 
            label="Underlying Slope" 
            value={config.slope} 
            min={-2} max={2} step={0.1} 
            onChange={(v) => updateConfig('slope', v)} 
          />

           <ControlSlider 
            label="Non-Linearity (Curvature)" 
            value={config.curvature} 
            min={-5} max={5} step={0.5} 
            onChange={(v) => updateConfig('curvature', v)} 
          />

          <div className="pt-4 border-t border-slate-700 mt-4 flex justify-between items-center">
            <span className="text-xs text-slate-500">Sample Size: {config.sampleSize}</span>
            <button 
              onClick={() => setConfig(prev => ({...prev, sampleSize: prev.sampleSize === 200 ? 500 : 200}))}
              className="text-xs text-blue-400 hover:underline"
            >
              Toggle N
            </button>
          </div>
        </div>

        {/* AI Explanation Panel */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-purple-300">AI Analysis</h3>
            <button
              onClick={handleGenerateExplanation}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-md text-sm font-bold transition-all
                ${isLoading 
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'}
              `}
            >
              {isLoading ? 'Thinking...' : 'Explain This'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            {explanation ? (
              <div className="prose prose-invert prose-sm font-serif text-slate-300">
                {explanation.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 italic text-sm text-center p-4 border border-dashed border-slate-700 rounded">
                Adjust parameters and click "Explain This" to get a professor-style breakdown of the current causal inference validity.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;