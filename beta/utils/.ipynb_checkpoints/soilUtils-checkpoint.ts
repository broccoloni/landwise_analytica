import chroma from 'chroma-js';
import { colorSet } from '@/types/colorPalettes';
import { dataToStaticColorUrl } from '@/utils/image';

export const getImageAndLegend(data: any, width: number, height: number, valuesToNames: Records<number, string>, scale: number) {
  try {
    const colors = chroma.scale(colorSet).colors(Object.keys(valuesToNames).length);

    const imageUrl = dataToStaticColorUrl(data, width, height, 0, colors, scale);
    const uniqueElements = new Set(data);
    const legend: Record<string, string> = {};

    const values = Object.keys(valuesToNames).map((val: string) => parseInt(val));
      
    uniqueElements.forEach((value) => {
      const name = valuesToNames[value];
      const index = values.indexOf(value);
                
      if (name && name !== 'NODATA') {
        legend[name] = colors[index];
      }
    });

    return { imageUrl, legend, uniqueElements };
      
  } catch (error) {
    console.error('Error in getImageAndLegend from soilUtils:', error);
  }
};
