
export const formatNextReminder = (date: string | null) => {
  if (!date) return 'No reminder set';
  return new Date(date).toLocaleString();
};
