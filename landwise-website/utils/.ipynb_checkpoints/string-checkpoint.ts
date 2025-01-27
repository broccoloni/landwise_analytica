/**
 * Converts a string to title case.
 * @param str - The string to convert.
 * @returns The string in title case.
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
