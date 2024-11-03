/**
 * Calculate the average of an array of numbers, skipping null values.
 * @param numbers Array of numbers to calculate the average.
 * @returns Average of the numbers, or 0 if there are no valid numbers.
 */
export const getAvg = (numbers: (number | null)[]): number => {
  const validNumbers = numbers.filter((value): value is number => value !== null);
  if (validNumbers.length === 0) return 0;
  return validNumbers.reduce((sum, value) => sum + value, 0) / validNumbers.length;
};

/**
 * Calculate the standard deviation of an array of numbers, skipping null values.
 * @param numbers Array of numbers to calculate the standard deviation.
 * @returns Standard deviation of the numbers, or 0 if there are no valid numbers.
 */
export const getStd = (numbers: (number | null)[]): number => {
  const validNumbers = numbers.filter((value): value is number => value !== null);
  if (validNumbers.length === 0) return 0;
  const avg = getAvg(validNumbers);
  const variance = validNumbers.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / validNumbers.length;
  return Math.sqrt(variance);
};
