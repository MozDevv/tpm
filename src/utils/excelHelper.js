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

import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { message } from 'antd';

export const generateExcelTemplateWithApiService = async (
  fetchApiEndpoint,
  fetchApiService,
  mapDataFunction,
  fileName,
  sheetName,
  pageSize = 10000,
  selectedColumns = [],
  skipBlankEntries = false,
  setLoading, // Added to control loading state
  loading // Added to track loading state
) => {
  try {
    if (!Array.isArray(selectedColumns) || selectedColumns.length === 0) {
      console.error('Selected columns must be a non-empty array');
      return;
    }

    setLoading(true); // Turn on loading before starting the process

    const response = await fetchApiService(fetchApiEndpoint, {
      'paging.pageSize': pageSize,
    });
    const { data } = response.data;

    if (typeof mapDataFunction !== 'function') {
      console.error('Invalid mapDataFunction. It must be a function');
      setLoading(false); // Turn off loading if mapDataFunction is invalid
      return;
    }

    const startTime = performance.now();
    const dataWithFormattedDates = await Promise.all(
      data.map(async (item) => {
        const formattedItem = await Object.keys(item).reduce(
          async (accPromise, key) => {
            const acc = await accPromise;
            const column = selectedColumns.find((col) => col.field === key);
            if (column) {
              const value = item[key];
              if (column.valueFormatter) {
                // Use the valueFormatter function if defined
                acc[key] = column.valueFormatter({ value });
              } else if (
                typeof value === 'string' &&
                dayjs(value, dayjs.ISO_8601, true).isValid() &&
                column.headerName.toLowerCase().includes('date')
              ) {
                const date = dayjs(value);
                acc[key] = `${date.date().toString().padStart(2, '0')}/${(
                  date.month() + 1
                )
                  .toString()
                  .padStart(2, '0')}/${date.year()}`;
              } else {
                acc[key] = value;
              }
            } else {
              acc[key] = item[key];
            }
            return acc;
          },
          Promise.resolve({})
        );

        return formattedItem;
      })
    );

    console.log('Data with formatted dates:', dataWithFormattedDates);
    const endTime = performance.now();
    console.log(`Processing time: ${endTime - startTime} milliseconds`);

    //return;
    const transformedData = mapDataFunction(dataWithFormattedDates);

    const mapWorksheetData = (data, selectedColumns) => {
      const headers = selectedColumns.map((col) => col.headerName);
      const rows = data.map((item, index) => {
        return selectedColumns.map((col) => {
          if (!col.field) return;
          if (col.field === 'no') return index + 1;

          let value = item[col.field];

          if (col.type === 'date' && typeof value === 'string') {
            const parsedDate = new Date(value);
            return isNaN(parsedDate.getTime()) ? '' : parsedDate;
          }

          return value === undefined || value === null ? '' : value;
        });
      });

      return [headers, ...rows];
    };

    let worksheetData = mapWorksheetData(transformedData, selectedColumns);

    if (skipBlankEntries) {
      worksheetData = worksheetData.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== '')
      );
    }

    if (worksheetData.length === 0) {
      console.error('No data to generate Excel. Worksheet is empty.');
      setLoading(false); // Turn off loading if no data to process
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Add headers and styles
    const headerRow = worksheet.addRow(worksheetData[0]);
    headerRow.eachCell((cell) => {
      cell.style = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '006990' },
        },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        },
      };
    });

    // Add rows
    worksheetData.slice(1).forEach((row) => {
      const newRow = worksheet.addRow(row);
      row.forEach((cellValue, idx) => {
        const col = selectedColumns[idx];
        if (col?.type === 'date' && typeof cellValue === 'string') {
          const parsedDate = new Date(cellValue);
          if (!isNaN(parsedDate.getTime())) {
            newRow.getCell(idx + 1).value = parsedDate;
            newRow.getCell(idx + 1).numFmt = 'dd/mm/yyyy';
          }
        }
      });
    });

    worksheet.columns = selectedColumns.map((col, idx) => ({
      key: col.field,
      width: Math.max(
        10,
        ...worksheetData.map((row) => (row[idx] ? String(row[idx]).length : 10))
      ),
    }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);

    setLoading(false); // Turn off loading when the download starts
  } catch (error) {
    console.error('Error generating Excel template:', error);
    message.error('Error generating Excel template. Please try again.');
    setLoading(false); // Turn off loading if there's an error
  }
};

// Sample transformData function

export default generateExcelTemplate;
