import React from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartData, SimulationConfig } from '../types';

interface RddChartProps {
  data: ChartData[];
  config: SimulationConfig;
}

const RddChart: React.FC<RddChartProps> = ({ data, config }) => {
  return (
    <div className="w-full h-[500px] relative bg-math-bg rounded-xl border border-slate-700 p-4 shadow-2xl overflow-hidden">
       {/* Chart Title Overlay */}
      <div className="absolute top-4 left-6 pointer-events-none z-10">
        <h2 className="text-2xl font-bold text-math-text font-serif">Regression Discontinuity</h2>
        <p className="text-slate-400 text-sm italic mt-1">Visualizing the Causal Jump</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 60, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={['auto', 'auto']} 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
            tickCount={5}
          />
          <YAxis 
            dataKey="y" 
            type="number" 
            domain={['auto', 'auto']} 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3', stroke: '#ffffff40' }}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', fontFamily: 'JetBrains Mono' }}
            itemStyle={{ color: '#38bdf8' }}
            labelStyle={{ color: '#94a3b8' }}
          />

          {/* The Cutoff Line */}
          <ReferenceLine 
            x={config.cutoff} 
            stroke="#e879f9" 
            strokeDasharray="4 4" 
            strokeWidth={2}
            label={{ 
              value: 'Cutoff (c)', 
              position: 'insideTopRight', 
              fill: '#e879f9', 
              fontSize: 14,
              fontFamily: 'Merriweather' 
            }} 
          />

          {/* Scatter Points */}
          <Scatter name="Observations" dataKey="y" fill="#8884d8" shape="circle">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isTreated ? '#facc15' : '#38bdf8'} 
                opacity={0.6} 
              />
            ))}
          </Scatter>

          {/* Regression Lines - Control (Left) */}
          <Line
            type="monotone"
            dataKey="fittedControl"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={false}
            activeDot={false}
            animationDuration={500}
          />

          {/* Regression Lines - Treatment (Right) */}
          <Line
            type="monotone"
            dataKey="fittedTreatment"
            stroke="#facc15"
            strokeWidth={3}
            dot={false}
            activeDot={false}
            animationDuration={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-6 bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 text-xs font-mono">
         <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-math-accent mr-2"></div>
            <span>Control (X &lt; c)</span>
         </div>
         <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-math-highlight mr-2"></div>
            <span>Treated (X &ge; c)</span>
         </div>
      </div>
    </div>
  );
};

export default RddChart;