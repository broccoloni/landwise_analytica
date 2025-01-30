// initEarthEngine.ts
import ee from '@google/earthengine';
var privateKey = require('../landwise-analytica-service-key.json');

export async function initializeEarthEngine() {
  return new Promise<void>((resolve, reject) => {
    console.log('Starting Earth Engine authentication...');
    ee.data.authenticateViaPrivateKey(
      privateKey,
      () => {
        console.log('Authentication successful. Initializing Earth Engine...');
        ee.initialize(
          null,
          null,
          () => {
            console.log('Earth Engine initialized successfully.');
            resolve();
          },
          (err) => {
            console.error('Error initializing Earth Engine:', err);
            reject(err);
          }
        );
      },
      (err) => {
        console.error('Error during authentication:', err);
        reject(err);
      }
    );
  });
}
