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