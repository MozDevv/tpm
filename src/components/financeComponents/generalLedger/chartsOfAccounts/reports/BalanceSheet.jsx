import React, { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { Button, Divider, IconButton, TextField } from '@mui/material';
import dayjs from 'dayjs'; // Make sure to install dayjs for date handling
import { Close } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';
import ExcelJS from 'exceljs';

const BalanceSheet = ({ setOpenTrialBalanceReport }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [skipBlankEntries, setSkipBlankEntries] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef();

  const getTrialBalance = async () => {
    try {
      const response = await apiService.get(financeEndpoints.getBalanceSheet, {
        'paging.pageSize': 12000,
      });
      const data1 = response.data;
      setData(data1);
      setFilteredData(data1);
      // setSelectedColumns([
      //   'groupName',
      //   'subGroupName',
      //   'accountName',
      //   'amount',
      // ]);
    } catch (error) {
      setError('Failed to fetch trial balance data. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    getTrialBalance();
  }, []);

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Balance Sheet');

    // Set column widths
    worksheet.columns = [
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Amount', key: 'amount', width: 20 },
    ];

    // Merge and style Title Row
    worksheet.mergeCells('A1:B1');
    const titleRow = worksheet.getCell('A1');
    titleRow.value = 'Ministry of Finance - Pensions Department';
    titleRow.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } }; // White text
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '006990' }, // Background color
    };

    // Merge and style Subtitle Row
    worksheet.mergeCells('A2:B2');
    const subtitleRow = worksheet.getCell('A2');
    subtitleRow.value = 'Balance Sheet';
    subtitleRow.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } }; // White text
    subtitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    subtitleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '006990' }, // Background color
    };
    // Merge and style Date Row
    worksheet.mergeCells('A3:B3');
    const dateRow = worksheet.getCell('A3');
    dateRow.value = `For Year Ended December 31, 2025`;
    dateRow.font = { italic: true, size: 11 };
    dateRow.alignment = { horizontal: 'center', vertical: 'middle' };
    subtitleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '006990' }, // Background color
    };

    // Remove the border between the two header rows
    worksheet.getRow(1).border = {};
    worksheet.getRow(2).border = {};
    worksheet.getRow(3).border = {};

    // Process data
    Object.entries(filteredData).forEach(([category, groups]) => {
      let categoryTotal = 0;

      // Add category row (LEVEL 1)
      const categoryRow = worksheet.addRow([category.toUpperCase(), '']);
      categoryRow.font = { bold: true, size: 12 };

      groups.forEach((group) => {
        let subgroupTotal = 0;

        // Add subgroup row (LEVEL 2)
        const subgroupRow = worksheet.addRow([`    ${group.subgroupName}`, '']);
        subgroupRow.font = { bold: true };

        group.details.forEach((detail) => {
          // Add account row (LEVEL 3)
          worksheet.addRow([`        ${detail.accountName}`, detail.amount]);

          // Accumulate totals
          subgroupTotal += detail.amount;
        });

        // Add subgroup total row
        const subgroupTotalRow = worksheet.addRow([
          `    ${group.subgroupName} Total`,
          subgroupTotal,
        ]);
        subgroupTotalRow.font = { bold: true };

        categoryTotal += subgroupTotal;
      });

      // Add category total row
      const categoryTotalRow = worksheet.addRow([
        `Total ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        categoryTotal,
      ]);
      categoryTotalRow.font = { bold: true, size: 12 };
      categoryTotalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EAD1DC' },
      };
    });

    // Apply borders only to data cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 4) {
        // Avoid adding borders to title, subtitle, and date rows
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          };
        });
      }
    });

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'BalanceSheet.xlsx');
  };

  const handleDownload = () => {
    setLoading(true);
    const element = contentRef.current;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Payment_Voucher.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    // Create a wrapper to hold the cloned content
    const wrapper = document.createElement('div');
    wrapper.style.width = `${fixedWidth}px`;
    wrapper.style.height = `${fixedHeight}px`;
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';

    // Create the watermark element
    const watermark = document.createElement('div');
    watermark.textContent = 'MOF - Pensions';
    watermark.style.position = 'absolute';
    watermark.style.left = '50%';
    watermark.style.top = '50%';
    watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermark.style.fontSize = '5rem'; // Adjust the font size as needed
    watermark.style.fontFamily = 'Georgia, serif'; // Use a more elegant font
    watermark.style.fontWeight = 'lighter'; // Lighter weight for subtlety
    watermark.style.color = 'rgba(0, 0, 0, 0.05)'; // Very light gray color for watermark
    watermark.style.whiteSpace = 'nowrap';
    watermark.style.pointerEvents = 'none'; // Ensure the watermark doesn't interfere with other elements
    watermark.style.zIndex = '10'; // Ensure watermark is below content

    wrapper.appendChild(watermark);

    const clonedElement = element.cloneNode(true);
    const scale = 0.86; // Scale factor to reduce the size
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.width = `${fixedWidth}px`;
    clonedElement.style.height = `${fixedHeight}px`;

    wrapper.appendChild(clonedElement);

    html2pdf()
      .set(options)
      .from(wrapper)
      .save()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const formatColumnName = (column) => {
    switch (column) {
      case 'groupName':
        return 'Group Name';
      case 'subGroupName':
        return 'Subgroup Name';
      case 'accountName':
        return 'Account Name';
      case 'amount':
        return 'Amount';
      default:
        return column;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-5 bg-white rounded-lg px-4">
      <h1 className="text-2xl font-bold text-primary mb-14 mt-[-20px]">
        Balance Sheet Report
      </h1>
      <IconButton
        onClick={() => setOpenTrialBalanceReport(false)}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'gray',
        }}
      >
        <Close />
      </IconButton>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            className="w-full"
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputLabel-root': {
                color: '#006990',
              },
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            className="w-full"
            sx={{
              '& .MuiInputBase-root': {
                height: '40px',
              },
              '& .MuiInputLabel-root': {
                color: '#006990',
              },
            }}
          />
          <Button
            variant="contained"
            //  onClick={handleDateFilter}
            className="col-span-2 mt-2"
          >
            Apply Date Filter
          </Button>
        </div>

        <div className="mb-10 mt-10">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={skipBlankEntries}
              onChange={() => setSkipBlankEntries(!skipBlankEntries)}
              className="mr-2"
            />
            Skip blank entries
          </label>
        </div>

        <div className="text-lg font-semibold text-gray-700 mb-3 border-b">
          Select Columns
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
          {['groupName', 'subGroupName', 'accountName', 'amount'].map(
            (column) => (
              <label key={column} className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  disabled={true}
                  checked={true}
                  onChange={() => handleColumnChange(column)}
                  className="mr-2"
                />
                {formatColumnName(column)}
              </label>
            )
          )}
        </div>

        <div className=" bg-white py-4  border-t flex justify-between mt-[180px]  ">
          <button
            onClick={handleExportExcel}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Export to Excel
          </button>
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Export to PDF
          </button>
          {/* <button
            onClick={() => handlePreviewPDF(filteredData)}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Preview PDF
          </button> */}
        </div>
      </div>

      <div className="hidden">
        <div className="font-sans mx-auto p-4" ref={contentRef}>
          <h2 className="text-center font-bold text-lg">
            Ministry of Finance - Pensions Department
          </h2>
          <h3 className="text-center font-semibold">Balance Sheet</h3>
          <p className="text-center text-gray-600">
            For Year Ended December 31, 2025
          </p>

          <div className="bg-primary text-white font-bold text-center p-2 mt-4">
            <div className="flex flex-row justify-between items-center">
              <div>Balance Sheet</div>
              {/* use current year */}
              <div className="">{dayjs().format('MMMM DD, YYYY')}</div>
            </div>
          </div>

          <div className="mt-4">
            {Object.entries(filteredData).map(([category, groups]) => {
              // Calculate the total for the current category
              const categoryTotal = groups.reduce((total, group) => {
                return (
                  total +
                  group.details.reduce((groupTotal, detail) => {
                    return groupTotal + detail.amount;
                  }, 0)
                );
              }, 0);

              return (
                <div key={category} className="mt-6">
                  <h4 className="font-bold text-lg">
                    {category.toUpperCase()}
                  </h4>

                  {groups.map((group, index) => (
                    <div key={index} className="mt-2">
                      <h5 className="font-semibold  pl-3">
                        {group.subgroupName}
                      </h5>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {group.details.map((detail, i) => (
                            <tr key={i} className="">
                              <td className="py-1 pl-6">
                                {detail.accountName}
                              </td>
                              <td className="py-1 text-right">
                                {detail.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* Add total row for the category */}
                  <div className=" font-bold">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr className="relative border-t border-black pt-1">
                          <div className=" border-b-[2px] border-black absolute bottom-[-10px] w-full"></div>
                          <td className="">
                            Total{' '}
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </td>
                          <td className=" text-right">
                            {categoryTotal.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
