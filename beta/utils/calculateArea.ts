import * as turf from "@turf/turf";

/**
 * Calculates the area of a polygon in square meters.
 * @param coordinates - An array of coordinates in [latitude, longitude] format.
 * @returns The area of the polygon in square meters.
 */
export const calculatePolygonArea = (coordinates: number[][]): number => {
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
