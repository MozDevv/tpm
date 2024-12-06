// Truncate message to a certain length and add "..." at the end
export const truncateMessage = (message, maxLength) => {
  return message.length > maxLength
    ? message.substring(0, maxLength) + '...'
    : message;
};

export const createColDefsDynamically = (dataObject) => {
  return Object.keys(dataObject).map((key) => {
    let headerName = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
    return {
      field: key,
      headerName: headerName,
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      //   pinned: key === 'payrollNumber' ? 'left' : undefined, // Example condition to pin specific columns
    };
  });
};
