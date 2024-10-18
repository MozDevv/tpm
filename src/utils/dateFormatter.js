export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const dateFormatter = (dateS) => {
  const date = new Date(dateS);

  // Format to a nice UX-friendly date, e.g., "July 30, 1985"
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formattedDate;
};

//1960-10-10T00:00:00Z to 1960-10-10

export const parseDate = (date) => {
  if (date) {
    return new Date(date).toISOString().split('T')[0];
  }
  return '';
};

export const checkIsDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
export const isValidISODate = (dateString) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return isoDateRegex.test(dateString) && !isNaN(Date.parse(dateString));
};
