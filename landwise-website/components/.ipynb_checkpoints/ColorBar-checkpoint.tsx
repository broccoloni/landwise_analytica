import React, { useEffect, useRef, useState } from 'react';
import chroma from 'chroma-js';

interface ColorBarProps {
  vmin: number;
  vmax: number;
  numIntervals?: number;
  heatmapColors: string[];
}

const ColorBar: React.FC<ColorBarProps> = ({ vmin, vmax, numIntervals = 5, heatmapColors }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(false);

  const getIntermediateValues = (vmin: number, vmax: number, numIntervals: number) => {
    const step = (vmax - vmin) / (numIntervals - 1);
    return Array.from({ length: numIntervals }, (_, i) => vmin + i * step);
  };

  useEffect(() => {
    // Detect screen size for orientation
    const updateOrientation = () => {
      setIsHorizontal(window.innerWidth < 768); // Tailwind 'sm' breakpoint is 640px
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");

    const scale = chroma.scale(heatmapColors).domain(isHorizontal ? [vmin, vmax] : [vmax, vmin]);

    if (isHorizontal) {
      // Horizontal gradient (left to right)
      for (let x = 0; x < canvas.width; x++) {
        const value = vmin + ((vmax - vmin) * (x / canvas.width));
        ctx.fillStyle = scale(value).hex();
        ctx.fillRect(x, 0, 1, canvas.height);
      }
    } else {
      // Vertical gradient (top to bottom)
      for (let y = 0; y < canvas.height; y++) {
        const value = vmin + ((vmax - vmin) * (y / canvas.height));
        ctx.fillStyle = scale(value).hex();
        ctx.fillRect(0, y, canvas.width, 1);
      }
    }
  }, [vmin, vmax, heatmapColors, isHorizontal]);

  const intermediateValues = getIntermediateValues(vmin, vmax, numIntervals);

  return (
    <div className={`flex ${isHorizontal ? "flex-col" : "flex-row"} justify-center items-center`}>
      <canvas 
        ref={canvasRef} 
        className="border border-gray-300 w-[260px] h-[30px] md:w-[30px] md:h-[300px]"
      />
      <div className={`flex ${isHorizontal ? "flex-row-reverse" : "flex-col"} justify-between md:ml-2 w-full md:h-full`}>
        {intermediateValues.reverse().map((value, index) => (
          <span key={index}>{value > 5 ? value.toFixed(1) : value.toFixed(5)}</span>
        ))}
      </div>
    </div>
  );
};

export default ColorBar;
