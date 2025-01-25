import ee from '@google/earthengine';

/**
 * Print the type of the provided object, checking for Google Earth Engine types as well as common JavaScript types.
 * @param obj The object to check the type of.
 */
export function printType(obj: any): void {
  if (obj instanceof ee.List) {
    console.log("The object is of type: ee.List");
  } else if (obj instanceof ee.Array) {
    console.log("The object is of type: ee.Array");
  } else if (obj instanceof ee.Image) {
    console.log("The object is of type: ee.Image");
  } else if (obj instanceof ee.ImageCollection) {
    console.log("The object is of type: ee.ImageCollection");
  } else if (obj instanceof ee.Feature) {
    console.log("The object is of type: ee.Feature");
  } else if (obj instanceof ee.FeatureCollection) {
    console.log("The object is of type: ee.FeatureCollection");
  } else if (obj instanceof ee.Geometry) {
    console.log("The object is of type: ee.Geometry");
  } else if (obj instanceof ee.Dictionary) {
    console.log("The object is of type: ee.Dictionary");
  } else if (Array.isArray(obj)) {
    console.log("The object is a JavaScript Array");
  } else if (obj instanceof Set) {
    console.log("The object is a JavaScript Set");
  } else if (obj instanceof Map) {
    console.log("The object is a JavaScript Map");
  } else if (obj === null) {
    console.log("The object is null");
  } else if (obj === undefined) {
    console.log("The object is undefined");
  } else if (typeof obj === 'string') {
    console.log("The object is a JavaScript String");
  } else if (typeof obj === 'number') {
    console.log("The object is a JavaScript Number");
  } else if (typeof obj === 'boolean') {
    console.log("The object is a JavaScript Boolean");
  } else if (typeof obj === 'function') {
    console.log("The object is a JavaScript Function");
  } else if (typeof obj === 'object') {
    console.log("The object is a JavaScript Object");
  } else {
    console.log(`The object is of unknown type: ${typeof obj}`);
  }
}
