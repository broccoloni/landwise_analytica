import { merriweather } from '@/ui/fonts';

interface LandUsageLegendProps {
  legend: Record<string, string>;
}

export default function LandUsageLegend({ legend }: LandUsageLegendProps) {
  return (
    <div className="">
      <div className={`${merriweather.className} text-center mb-2 font-medium`}>Legend</div>
      {/* Use the legend prop */}
      {Object.keys(legend).map((key) => (
        <div key={key} className="legend-item flex items-center mb-1">
          <span
            className="legend-color block w-4 h-4 mr-2"
            style={{ backgroundColor: legend[key] }}
          ></span>
          <span className="legend-label">{key}</span>
        </div>
      ))}
    </div>
  );
}
