import ee from '@google/earthengine';

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
