import ee from '@google/earthengine';

export async function fetchImage( imageName: string, bandName: string, geometry: ee.Geometry ) {
  try {
    // Retrieve the historical land use data for the given year
    var image = ee.Image(imageName).select(bandName);

    const sampleObj = await sampleImage(image, geometry);
    const sampleDataArray = sampleObj.properties[bandName];
      
    const height = sampleDataArray.length;
    const width = sampleDataArray[0] ? sampleDataArray[0].length : 0;
    const sampleData = sampleDataArray.flat().map((data) => data === 0 ? null : data);

    return { sampleData, height, width };
  } catch (error) {
    console.error(`Failed to fetch image:`, error.message);
  }
}

export async function sampleImage(image: ee.Image, geometry: ee.Geometry) {
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
    const sampleObj = await evaluateDictionary(sampleData);
    return sampleObj;
      
  } catch (error) {
    console.error('Error in sampleImage function:', error.message);
    throw error;
  }
}

export async function evaluateImage(image: ee.Image) {
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
    console.error('Error in evaluateImage function:', error.message);
    throw error;
  }
}

export async function evaluateDictionary(dictionary: ee.Dictionary) {
  try {
    return new Promise((resolve, reject) => {
      dictionary.evaluate((result, error) => {
        if (error) {
          console.error('Error evaluating the dictionary:', error);
          reject(new Error(`Failed to evaluate dictionary: ${error.message}`));
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error in evaluateDictionary function:', error.message);
    throw new Error(`evaluateDictionary failed: ${error.message}`);
  }
}

export async function sampleDate(imgCollection, date) {
  return imgCollection.filterDate(date).first();
}

export async function getOverlappingDates(collections) {
  return new Promise((resolve, reject) => {
    try {
      const allTimestamps = collections.map(collection =>
        collection.aggregate_array('system:time_start')
      );

      const flattenedTimestamps = ee.List(allTimestamps).flatten();
      const dateStrings = flattenedTimestamps.map(timestamp =>
        ee.Date(ee.Number(timestamp)).format('YYYY-MM-dd')
      );

      const frequencyDict = dateStrings.reduce(ee.Reducer.frequencyHistogram());
      const validTimestamps = ee.Dictionary(frequencyDict);
      const overlappingDates = validTimestamps
        .keys()
        .map(key => {
          const count = ee.Number(validTimestamps.get(key));
          const date = ee.Date(ee.Number(key)).format('YYYY-MM-dd');
          return ee.Algorithms.If(count.eq(collections.length), date, null);
        })
        .filter(ee.Filter.notNull(['item']));

      overlappingDates.evaluate(dates => {
        resolve(dates);
      });
    } catch (error) {
      reject(error);
    }
  });
}
