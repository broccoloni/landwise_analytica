export const months = [
  "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

export const dayInts = Array.from({ length: 365 }, (_, i) => i + 1);

// Function to convert a day of the year to a month and day string
export const dayNumToMonthDay = (dayNum: number, year: number = 2024): string => {
  const date = new Date(year, 0, 1);
  date.setDate(dayNum); // Set date directly using the day of the year
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

export const dayStrs = dayInts.map((dayInt) => dayNumToMonthDay(dayInt));

// Function to calculate the 1-based index of the day of the year
export const intsToDayOfYear = (year: number, month: number, day: number): number => {
  // Month and day are 1-based
  const date = new Date(year, month - 1, day); // Date API requires 0-based month
  const startOfYear = new Date(year, 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Function to get the day of the year from a `Date` object
export const dateToDayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Function to format a date string into a month and day name
export const dateToMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};
