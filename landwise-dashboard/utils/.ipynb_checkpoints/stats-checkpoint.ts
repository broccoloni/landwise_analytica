/**
 * Calculate the minimum, maximum, average, and standard deviation of an array of numbers, skipping null values.
 * @param numbers Array of numbers to calculate statistics.
 * @returns An object containing min, max, avg, and std, or zeros if there are no valid numbers.
 */
export const getStats = (numbers: (number | null)[]): { min: number; max: number; avg: number; std: number } => {
  const validNumbers = numbers.filter((value): value is number => value !== null);

  if (validNumbers.length === 0) return { min: 0, max: 0, avg: 0, std: 0 };

  // Initialize min, max, sum, and sum of squares
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let sumOfSquares = 0;

  // Iterate over the valid numbers once to gather stats
  for (const value of validNumbers) {
    if (value < min) min = value;
    if (value > max) max = value;
    sum += value;
    sumOfSquares += value * value;
  }

  // Calculate average and standard deviation
  const avg = sum / validNumbers.length;
  const variance = sumOfSquares / validNumbers.length - avg * avg;
  const std = Math.sqrt(variance);

  return { min, max, avg, std };
};


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

export const Norm2 = (numbers: (number | null)[]): number => {
  const validNumbers = numbers.filter((value): value is number => value !== null);
  return Math.sqrt(validNumbers.reduce((sum, val) => sum + Math.pow(val, 2), 0));
};
