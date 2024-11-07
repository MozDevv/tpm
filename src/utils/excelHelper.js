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

export default generateExcelTemplate;
