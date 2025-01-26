// import { Geodesic } from "geographiclib";
// import * as turf from "@turf/turf";

// /**
//  * Calculates the area of a polygon in square meters using GeographicLib.
//  * Ensures the points are in clockwise order using Turf.
//  * @param coordinates - An array of coordinates in [latitude, longitude] format.
//  * @returns The area of the polygon in square meters.
//  */
// export const calculatePolygonArea = (coordinates: number[][]): number | null => {
//   if (coordinates.length < 3) {
//     return null; // Not enough points to form a polygon
//   }

//   const isClosed =
//     coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
//     coordinates[0][1] === coordinates[coordinates.length - 1][1];

//   const closedCoordinates = isClosed ? coordinates : [...coordinates, coordinates[0]];

//   // Ensure the coordinates are in clockwise order using Turf
//   const orderedCoordinates = ensureClockwise(closedCoordinates);

//   // Initialize the geodesic object
//   const geodesic = Geodesic.WGS84;

//   // Create the PolygonArea object using the geodesic instance
//   const polygon = geodesic.Polygon();

//   // Add points to the polygon calculator
//   orderedCoordinates.forEach(([lat, lng]) => {
//     polygon.AddPoint(lat, lng);
//   });

//   // Compute the area
//   const result = polygon.Compute();
//   return Math.round(result.area); // Return absolute value of the area
// };

// /**
//  * Ensures the polygon points are in clockwise order using Turf.
//  * @param coordinates - Array of coordinates to check.
//  * @returns Coordinates in clockwise order.
//  */
// const ensureClockwise = (coordinates: number[][]): number[][] => {
//   // Convert coordinates into GeoJSON Polygon format
//   const geoJson = turf.polygon([coordinates]);

//   // Check if the polygon is in clockwise order
//   const isClockwise = turf.booleanClockwise(geoJson);

//   // If the points are counterclockwise, reverse them
//   return isClockwise ? coordinates : coordinates.reverse();
// };

import * as turf from "@turf/turf";

/**
 * Calculates the area of a polygon in square meters.
 * @param coordinates - An array of coordinates in [latitude, longitude] format.
 * @returns The area of the polygon in square meters.
 */
export const calculatePolygonArea = (coordinates: number[][]): number|null => {
  // Ensure there are enough points to form a polygon
  if (coordinates.length < 3) {
    return null;
  }

  // Close the polygon if not already closed
  const isClosed =
    coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
    coordinates[0][1] === coordinates[coordinates.length - 1][1];

  const closedCoordinates = isClosed
    ? coordinates
    : [...coordinates, coordinates[0]];

  // Convert coordinates to [longitude, latitude] and create a GeoJSON polygon
  const polygon = turf.polygon([
    closedCoordinates.map(([lat, lng]) => [lng, lat]),
  ]);

  // Calculate area in square meters
  return Math.round(turf.area(polygon));
};
