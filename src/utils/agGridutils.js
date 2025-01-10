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
// Utility function for Ag-Grid valueGetter

//  valueGetter: (params) => getValueById(pensionCaps, 'id', 'name', params.data.pensionAwardId),

export const getValueById = (array, valueKey, params) => {
  const id = params.data[params.colDef.field];

  return array?.find((item) => item.id === id)?.[valueKey] || 'N/A';
};
