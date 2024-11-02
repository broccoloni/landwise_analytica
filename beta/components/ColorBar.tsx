import React, { useEffect, useRef } from 'react';
import chroma from 'chroma-js';

interface ColorBarProps {
  vmin: number;
  vmax: number;
  numIntervals?: number;
  heatmapColors: string[];
}

const ColorBar: React.FC<ColorBarProps> = ({ vmin, vmax, numIntervals = 5, heatmapColors }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getIntermediateValues = (vmin: number, vmax: number, numIntervals: number) => {
    const step = (vmax - vmin) / (numIntervals - 1);
    const values = [];
    for (let i = 0; i < numIntervals; i++) {
      values.push(vmin + i * step);
    }
    return values;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas 2D context");
    }

    // Create chroma scale using the provided colors and domain
    const scale = chroma.scale(heatmapColors).domain([vmax, vmin]);

    // Fill the canvas with the gradient based on the scale
    for (let y = 0; y < canvas.height; y++) {
      const value = vmin + ((vmax - vmin) * (y / canvas.height));
      const color = scale(value).hex();
      ctx.fillStyle = color;
      ctx.fillRect(0, y, canvas.width, 1);
    }
  }, [vmin, vmax, heatmapColors]);

  const intermediateValues = getIntermediateValues(vmin, vmax, numIntervals);

  return (
    <div className="flex justify-center items-center">
      <canvas ref={canvasRef} width={30} height={300} className="border border-gray-300" />
      <div className="flex flex-col justify-between ml-2 h-full">
        {intermediateValues.reverse().map((value, index) => (
          <span key={index}>
            {value > 5 ? value.toFixed(1) : value.toFixed(5)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ColorBar;
