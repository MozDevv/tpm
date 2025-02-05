import * as XLSX from 'xlsx';
import { apiService } from '@/components/services/financeApi'; // Adjust the import based on your project structure

const generateExcelTemplate = async (
  apiEndpoint,
  mapDataFunction,
  fileName,
  sheetName,
  pageSize = 10000
) => {
  try {
    const response = await apiService.get(apiEndpoint, {
      'paging.pageSize': pageSize,
    });

    const { data } = response.data;

    const worksheetData = mapDataFunction(data);

    // Create a worksheet and a workbook
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Define header styles
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };

    // Add headers with styles
    XLSX.utils.sheet_add_aoa(worksheet, [worksheetData[0]], { origin: 'A1' });
    worksheet['!rows'] = [{ hpx: 25 }]; // Set row height for headers

    // Apply styles to header cells
    worksheetData[0].forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellAddress])
        worksheet[cellAddress] = { t: 's', v: header };
      worksheet[cellAddress].s = headerStyle;
    });

    // Add the rest of the data
    XLSX.utils.sheet_add_aoa(worksheet, worksheetData.slice(1), {
      origin: 'A2',
    });

    // Format columns (optional, customize as needed)
    worksheet['!cols'] = [
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 30 }, // Example column
      { hidden: false, width: 15 }, // Example column
      { hidden: false, width: 15 }, // Example column
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 20 }, // Example column
      { hidden: false, width: 20 }, // Example column
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Create the Excel file and trigger the download
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);

    // Create a link element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating Excel template:', error);
  }
};

// Define header style (example styles, adjust as needed)
const headerStyle = {
  font: { bold: true, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '4F81BD' } },
  alignment: { horizontal: 'center' },
};

export const generateExcelTemplateWithApiService = async (
  fetchApiEndpoint,
  fetchApiService,
  mapDataFunction,
  fileName,
  sheetName,
  pageSize = 10000,
  selectedColumns = [],
  skipBlankEntries = false,
  setOpenExcel
) => {
  try {
    console.log('Calling API with endpoint:', fetchApiEndpoint);
    console.log('Selected Columns:', selectedColumns);

    // Ensure selectedColumns is an array
    if (!Array.isArray(selectedColumns) || selectedColumns.length === 0) {
      console.error('Selected columns must be a non-empty array');
      return;
    }

    const response = await fetchApiService(fetchApiEndpoint, {
      'paging.pageSize': pageSize,
    });

    console.log('API response:', response);
    const { data } = response.data;
    console.log('Data received from API:', data);

    // Ensure mapDataFunction is a function
    if (typeof mapDataFunction !== 'function') {
      console.error('Invalid mapDataFunction. It must be a function');
      return;
    }

    // Transform data using mapDataFunction
    const transformedData = mapDataFunction(data);
    console.log('Transformed data:', transformedData);

    // Map worksheet data based on selected columns
    const mapworksheet = (data, selectedColumns) => {
      // Extract headers from selectedColumns
      const headers = selectedColumns.map((col) => col.headerName);

      // Map data to arrays based on selectedColumns
      const rows = data.map((item, index) => {
        console.log('Mapping item:', item); // Log the item being mapped
        console.log('Selected columns:', selectedColumns);
        return selectedColumns.map((col) => {
          console.log('Mapping column:', col.field); // Log the column field being mapped

          if (!col.field) {
            return;
          }
          if (col.field === 'no') {
            return index + 1;
          }
          const value = item[col.field];
          if (value === undefined) {
            console.warn(`Field ${col.field} is undefined for item:`, item);
            return null; // or any default value you prefer
          }
          if (col.type === 'date' && value) {
            return new Date(value); // Convert to Date object for date columns
          }
          return value === null ? 0 : value;
        });
      });

      console.log('rows', rows);
      console.log('mapped data', [headers, ...rows]);

      return [headers, ...rows];
    };

    let worksheetData = mapworksheet(transformedData, selectedColumns);
    console.log('Mapped worksheet data:', worksheetData);

    // Ensure worksheetData is valid
    if (!Array.isArray(worksheetData) || worksheetData.length === 0) {
      console.error('Mapped data is not valid or empty:', worksheetData);
      return;
    }

    if (!Array.isArray(worksheetData[0])) {
      console.error(
        'The first row of worksheet data is not an array:',
        worksheetData[0]
      );
      return;
    }

    // Optionally skip blank entries
    if (skipBlankEntries) {
      worksheetData = worksheetData.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== '')
      );
      console.log(
        'Worksheet data after removing blank entries:',
        worksheetData
      );
    }

    // Check if worksheetData has entries after filtering
    if (worksheetData.length === 0) {
      console.error('No data to generate Excel. Worksheet is empty.');
      return;
    }

    // Define header styles
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };

    // Create an Excel worksheet and workbook
    console.log('Creating Excel workbook and worksheet');
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Add headers and apply styles
    XLSX.utils.sheet_add_aoa(worksheet, [worksheetData[0]], { origin: 'A1' });
    worksheet['!rows'] = [{ hpx: 25 }]; // Set row height for headers

    // Apply styles to header cells
    worksheetData[0].forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress] = { t: 's', v: header };
      worksheet[cellAddress].s = headerStyle;
    });
    console.log('Header styles applied');

    // Add the remaining data
    XLSX.utils.sheet_add_aoa(worksheet, worksheetData.slice(1), {
      origin: 'A2',
    });
    console.log('Worksheet data added');

    // Format date columns
    selectedColumns.forEach((col, idx) => {
      if (col.type === 'date') {
        worksheetData.slice(1).forEach((row, rowIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex + 1,
            c: idx,
          });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            cell.t = 'd'; // Set cell type to date
            cell.z = XLSX.SSF._table[14]; // Apply date format (e.g., 'm/d/yy')
          }
        });
      }
    });

    const columnWidths = selectedColumns.map((col, idx) => {
      const maxLength = Math.max(
        ...worksheetData.map((row) => (row[idx] ? String(row[idx]).length : 10))
      );
      return { width: Math.max(maxLength, 10) };
    });
    worksheet['!cols'] = columnWidths;
    console.log('Column widths set:', columnWidths);

    // Create the Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    // Create and click a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    console.log('File download triggered');

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Avoid memory leak by revoking object URL
    console.log('Download link removed and object URL revoked');
  } catch (error) {
    console.error('Error generating Excel template:', error);
  }
};

// Sample transformData function

export default generateExcelTemplate;
