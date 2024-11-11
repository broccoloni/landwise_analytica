'use client';

export const intsToDayOfYear = (year: number, month: number, day: number): number => {
  // Note: This function assumes month and day are 1 based, ie 2024-01-01 if Jan 1,
  // but Date requires 0-based so 2024-01-01 -> 2024-00-00
  // Returns 1-based index of the day of the year
  const date = new Date(year, month-1, day-1); 
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24))+1;
};

export const dateToDayOfYear = (date: Date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - startOfYear.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const dayNumToMonthDay = (dayNum: number) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + dayNum);
  return date.toISOString().split('T')[0].slice(5); // Format to MM-DD
};

export const monthNames = [
  "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
];

export const formatDateToMonthName = (dateString: string) => {
  const date = new Date(dateString);
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

export const getWeekDateRange = (weekNumber: number) => {
  if (isNaN(Number(weekNumber))) {
    return weekNumber;
  }
  const weekStart = formatDateToMonthName(dayNumToMonthDay((weekNumber - 1) * 7)); 
  const weekEnd = formatDateToMonthName(dayNumToMonthDay(weekNumber * 7));
  return `${weekStart} - ${weekEnd}`;
};