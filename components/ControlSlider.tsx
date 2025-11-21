import React from 'react';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  colorClass?: string;
}

const ControlSlider: React.FC<ControlSliderProps> = ({ 
  label, value, min, max, step = 1, onChange, colorClass = "text-math-accent" 
}) => {
  return (
    <div className="mb-6 group">
      <div className="flex justify-between mb-2 font-serif text-sm tracking-wider">
        <span className="text-gray-400">{label}</span>
        <span className={`font-bold ${colorClass} font-mono`}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
          accent-math-accent hover:bg-gray-600 transition-all duration-300
        `}
      />
    </div>
  );
};

export default ControlSlider;