import { evaluateImage, sampleDate, getOverlappingDates } from '@/utils/earthEngineUtils';
import ee from '@google/earthengine';

export async function fetchCropData(geometry, years, crops, cropNames) {
  const results = {};

  for (const year of years) {
    try {
      const MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(
        `${year}-01-01`,
        `${year}-12-31`
      );
      const MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(
        `${year}-01-01`,
        `${year}-12-31`
      );
      const MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filterDate(
        `${year}-01-01`,
        `${year}-12-31`
      );

      const overlappingDates = await getOverlappingDates([MOD15A2H, MOD13Q1, MCD43A4]);
      if (overlappingDates.length === 0) throw new Error('No overlapping dates');

      const combinedImages = (
        await Promise.all(
          overlappingDates.map(async date => {
            const imageMOD13Q1 = await sampleDate(MOD13Q1, date);
            const imageMOD15A2H = await sampleDate(MOD15A2H, date);
            const imageMCD43A4 = await sampleDate(MCD43A4, date);

            if (imageMOD13Q1 && imageMOD15A2H && imageMCD43A4) {
              return ee.Image(imageMOD13Q1)
                .addBands(imageMOD15A2H)
                .addBands(imageMCD43A4);
            } else {
              console.log(`Skipping date ${date} due to missing image`);
              return null;
            }
          })
        )
      ).filter(image => image !== null);

      const vegReflectanceImages = await Promise.all(
        combinedImages.map(fescBand)
      );
      const vegReflectance = ee.ImageCollection(vegReflectanceImages);
      let vegReflectanceBands = vegReflectance.toBands();

      const pixelArea = ee.Image.pixelArea();
      vegReflectanceBands = vegReflectanceBands.addBands({
        srcImg: pixelArea,
        overwrite: true,
      }).unmask(0);

      const AAFCImage = ee.ImageCollection('AAFC/ACI')
        .filterDate(`${year}-01-01`, `${year}-12-31`)
        .first();

      results[year] = {};

      for (const crop of crops) {
        console.log(`Processing crop ${cropNames[crops.indexOf(crop)]} for year ${year}`);
        vegReflectanceBands = vegReflectanceBands.updateMask(AAFCImage.eq(crop));
          
        const unprocessedPixels = vegReflectanceBands.reduceRegion(
          reducer: ee.Reducer.toList(),
          geometry: geometry,
          scale: 30,
          maxPixels: 1e13,
        });

        const pixelValues = await evaluateImage(unprocessedPixels);
        results[year][cropNames[crops.indexOf(crop)]] = pixelValues;
      }
    } catch (error) {
      console.error(`Error processing data for year ${year}:`, error);
    }
  }

  return results;
}

async function fescBand(image) {
  return new Promise((resolve, reject) => {
    try {
      const NIR = image.select('sur_refl_b02');
      const FPAR = image.select('Fpar_500m');
      const NDVI = image.select('NDVI');

      if (NIR && FPAR && NDVI) {
        const FPARAdjusted = FPAR.add(0.0000001);
        const fesc = NIR.multiply(NDVI).divide(FPARAdjusted).rename('fesc');

        const updatedImage = image.addBands({
          srcImg: fesc,
          overwrite: true,
        });

        resolve(updatedImage);
      } else {
        resolve(image);
      }
    } catch (error) {
      console.error('Error in fescBand function:', error);
      reject(error);
    }
  });
}