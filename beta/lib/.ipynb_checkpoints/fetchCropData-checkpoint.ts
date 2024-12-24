import { evaluateImage, sampleDate, getOverlappingDates } from '@/utils/earthEngineUtils';
import ee from '@google/earthengine';

const cropNames = [
  'Barley', 'Corn for grain', 'Oats', 'Soybeans', 'Canola', 
  'Flaxseed', 'Lentils', 'Mustard seed', 'Peas, dry', 
  'Wheat, spring', 'Wheat, winter remaining', 'Chick peas', 
  'Triticale'
];

// const cropNames = [
//   'Barley',
// ];

const crops = [133, 147, 136, 158, 153, 154, 174, 155, 162, 146, 145, 163, 139];
// const crops = [133];

const bands = [
  'BRDF_Albedo_Band_Mandatory_Quality_Band1',
  'BRDF_Albedo_Band_Mandatory_Quality_Band2',
  'BRDF_Albedo_Band_Mandatory_Quality_Band3',
  'BRDF_Albedo_Band_Mandatory_Quality_Band4',
  'BRDF_Albedo_Band_Mandatory_Quality_Band5',
  'BRDF_Albedo_Band_Mandatory_Quality_Band6',
  'BRDF_Albedo_Band_Mandatory_Quality_Band7',
  'DayOfYear', 'DetailedQA', 'EVI', 'FparExtra_QC', 
  'FparLai_QC', 'FparStdDev_500m', 'Fpar_500m', 
  'LaiStdDev_500m', 'Lai_500m', 'NDVI', 
  'Nadir_Reflectance_Band1', 'Nadir_Reflectance_Band2', 
  'Nadir_Reflectance_Band3', 'Nadir_Reflectance_Band4', 
  'Nadir_Reflectance_Band5', 'Nadir_Reflectance_Band6', 
  'Nadir_Reflectance_Band7', 'RelativeAzimuth', 
  'SolarZenith', 'SummaryQA', 'ViewZenith', 
  'fesc', 'sur_refl_b01', 'sur_refl_b02', 
  'sur_refl_b03', 'sur_refl_b07'
];

export async function fetchCropData(geometry, years) {
  const results = {};

  for (const yr of years) {
    try {
      const year = parseInt(yr)
      const MOD15A2H = ee.ImageCollection('MODIS/061/MOD15A2H').filterDate(
        `${year}-01-01`,
        `${year+1}-01-01`
      );
      const MOD13Q1 = ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(
        `${year}-01-01`,
        `${year+1}-01-01`
      );
      const MCD43A4 = ee.ImageCollection('MODIS/061/MCD43A4').filterDate(
        `${year}-01-01`,
        `${year+1}-01-01`
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
        .filterDate(`${year}-01-01`, `${year+1}-01-01`)
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