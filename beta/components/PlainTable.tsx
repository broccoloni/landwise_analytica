import React from 'react';
import { montserrat, roboto, merriweather } from '@/ui/fonts';

interface PlainTableProps {
  headers: string[];
  data: any[];
}

const PlainTable: React.FC<PlainTableProps> = ({ headers, data }) => {
  return (
    <table className="min-w-full border-collapse mb-4">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className={`${montserrat.className} px-4 py-2 font-normal ${index === 0 ? 'text-left' : 'text-right'}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(item).map((value, cellIndex) => (
              <td
                key={cellIndex}
                className={`px-4 py-2 ${cellIndex === 0 ? 'text-left' : 'text-right'}`}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlainTable;
