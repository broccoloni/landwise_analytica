import ee from '@google/earthengine';
import { Data } from '@/types/dataTypes';

interface SampleProperties {
  [key: string]: number[][];
}

interface SampleResult {
  properties: SampleProperties;
}

export async function fetchImage(
  imageName: string,
  bandName: string | string[],
  geometry: ee.Geometry
) {
  try {
    const image = ee.Image(imageName).select(bandName);
    const sampleObj = await sampleImage(image, geometry);

    if (!sampleObj) {
      throw new Error('sampleObj not found');
    }

    const bandNames = Array.isArray(bandName) ? bandName : [bandName];
    const bands: Record<string, Data> = {};

    bandNames.forEach((band) => {
      const bandDataArray = sampleObj.properties[band];
      const height = bandDataArray.length;
      const width = bandDataArray[0] ? bandDataArray[0].length : 0;
      bands[band] = { 
        sampleData: bandDataArray.flat().map((data) => (data === 0 ? null : data)),
        height,
        width,
      };
    });

    return bands;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch image:`, error.message);
    } else {
      console.error('Failed to fetch image: An unexpected error occurred');
    }
  }
}

export async function sampleImage(image: ee.ImageType, geometry: ee.Geometry) {
  if (!image) {
    throw new Error('No image to sample');
  }

  try {
    const regionMask = ee.Image(1).clip(geometry);
    const maskedImage = image.updateMask(regionMask);

    // Need to reproject the scale in case the vertical and horizontal
    // resolution of the image are not equal, leading to a tilt when
    // displaying the images on the map with square pixels
    const reprojectedImage = maskedImage.reproject({
      crs: 'EPSG:4326',
      scale: 30,
    });
        
    const sampleData = reprojectedImage.sampleRectangle({ region: geometry, defaultValue: 0 });
    const sampleObj = (await evaluateDictionary(sampleData)) as SampleResult;
    return sampleObj;
      
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to sample image:`, error.message);
    } else {
      console.error('Failed to sample image: An unexpected error occurred');
    }
  }
}

export async function evaluateImage(image: ee.ImageType) {
  if (!image) {
    throw new Error('No image to evaluate');
  }

  try {
    return new Promise((resolve, reject) => {
      image.evaluate((result, error) => {
        if (error) {
          console.error('Error evaluating the reduced image:', error);
          reject(new Error(`Failed to evaluate image: ${error.message}`));
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to evaluate image:`, error.message);
    } else {
      console.error('Failed to evaluate image: An unexpected error occurred');
    }
  }
}

export async function evaluateDictionary<T>(dictionary: InstanceType<typeof ee.Dictionary>): Promise<T> {
  try {  
    return new Promise((resolve, reject) => {
      dictionary.evaluate((result: any, error: any) => {
        if (error) {
          console.error('Error evaluating the dictionary:', error);
          reject(new Error(`Failed to evaluate dictionary: ${(error as Error).message}`));
        } else {
          resolve(result as T);
        }
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to evaluate dictionary:`, error.message);
      return Promise.reject(error);
    } else {
      console.error('Failed to evaluate dictionary: An unexpected error occurred');
      return Promise.reject(new Error('An unexpected error occurred'));
    }
  }
}


export async function sampleDate(
  imgCollection: InstanceType<typeof ee.ImageCollection>, 
  date: string,
): Promise<string[]> {
  return imgCollection.filterDate(date).first();
}

export async function getOverlappingDates(
  collections: InstanceType<typeof ee.ImageCollection>[]
): Promise<string[]> {
  try {
    const allTimestamps = collections.map((collection) =>
      collection.aggregate_array('system:time_start')
    );

    const flattenedTimestamps = ee.List(allTimestamps).flatten();
    const dateStrings = flattenedTimestamps.map((timestamp: number) => {
       const date = ee.Date(ee.Number(timestamp)) as any;
       return date.format('YYYY-MM-dd');
    });

    const frequencyDict = ee.Dictionary(
      dateStrings.reduce(ee.Reducer.frequencyHistogram())
    );

    const validTimestamps = await evaluateDictionary<Record<string, number>>(frequencyDict);

    const overlappingDates = Object.keys(validTimestamps).filter(
      (key) => validTimestamps[key] === collections.length
    );

    return overlappingDates;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to get overlapping dates:`, error.message);
    } else {
      console.error('Failed to get overlapping dates: An unexpected error occurred');
    }
    return [];
  }
}

