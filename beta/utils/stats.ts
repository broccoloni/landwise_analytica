// utils/stats.ts

/**
 * Calculate the average of an array of numbers.
 * @param numbers Array of numbers to calculate the average.
 * @returns Average of the numbers.
 */
export const getAvg = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
};

/**
 * Calculate the standard deviation of an array of numbers.
 * @param numbers Array of numbers to calculate the standard deviation.
 * @returns Standard deviation of the numbers.
 */
export const getStd = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const avg = getAvg(numbers);
  const variance = numbers.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / numbers.length;
  return Math.sqrt(variance);
};
