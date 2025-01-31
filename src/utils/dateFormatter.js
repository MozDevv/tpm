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
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return '';
};

//1960-10-10T00:00:00Z to 1960/10/10
export const parseDateSlash = (date) => {
  if (date) {
    return new Date(date).toISOString().split('T')[0].replace(/-/g, '/');
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
///1960-10-10T00:00:00Z to 10/10/1960
export const parseDate2 = (date) => {
  if (date) {
    return new Date(date)
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('/');
  }
  return '';
};

export const formatDateToDayMonthYear = (dateS) => {
  const date = new Date(dateS);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // Get short month name and convert to uppercase
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
  return `${day}-${month}-${year}`;
};
