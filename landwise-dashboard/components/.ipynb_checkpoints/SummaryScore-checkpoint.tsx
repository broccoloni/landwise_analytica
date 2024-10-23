'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';

// Dynamically import Plotly without SSR (server-side rendering)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const SummaryScore = () => {
  const categories = [
    'Estimated Yield', 
    'Climate', 
    'Infrastructure & Accessibility', 
    'Topography', 
    'Economic Viability'
  ];

  const scores = [86, 92, 88, 77, 80];
  const meanScores = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const overallScore = Math.round(meanScores);

  // Close the radar chart by repeating the first point
  const closedScores = [...scores, scores[0]];
  const closedCategories = [...categories, categories[0]];

  return (
    <div className="w-full">
      <div className={`${montserrat.className} text-2xl`}>
        {`Score: ${overallScore}%`}
      </div>
      <div className="" style={{ height: '300px' }}>
        <Plot
          data={[
            {
              type: 'scatterpolar',
              r: closedScores,
              theta: closedCategories,
              fill: 'toself',
              marker: { color: 'var(--accent)' },
              line: {
                shape: 'spline',
                smoothing: 0.8,
                color: 'var(--accent)',
                width: 3,
              },
              fillcolor: 'rgba(0,0,0, 0.1)',
              hoverinfo: 'none',
            }
          ]}
          layout={{
            polar: {
              radialaxis: {
                visible: true,
                range: [0, 100],
                tickfont: {
                  size: 14,
                  color: '#333',
                  family: roboto.style.fontFamily,
                },
                gridcolor: '#ccc',
              },
              angularaxis: {
                tickfont: {
                  size: 14,
                  color: '#444',
                  family: roboto.style.fontFamily,
                },
                linecolor: '#888',
              },
            },
            margin: {
              t: 20,
              l: 160,
              r: 120,
              b: 20,
            },
            showlegend: false,
            paper_bgcolor: '#fff',
            plot_bgcolor: '#f5f5f5',
            dragmode: false,
            scrollZoom: false,
            zoom: false,
            selectable: false,
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%'}}
        />
      </div>
    </div>
  );
};

export default SummaryScore;
