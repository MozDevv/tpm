import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { Button, Divider, TextField } from '@mui/material';
import dayjs from 'dayjs'; // Make sure to install dayjs for date handling

const TrialBalance = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [skipBlankEntries, setSkipBlankEntries] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);

  const getTrialBalance = async () => {
    try {
      const response = await apiService.get(financeEndpoints.getTrialBalance, {
        'paging.pageSize': 12000,
      });
      const data1 = response.data.data;
      setData(data1);
      setFilteredData(data1);
      setSelectedColumns([
        'groupName',
        'subGroupName',
        'accountName',
        'amount',
      ]);
    } catch (error) {
      setError('Failed to fetch trial balance data. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    getTrialBalance();
  }, []);

  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleDateFilter = () => {
    const filtered = data.filter((group) => {
      return group.subGroups.some((subGroup) => {
        return subGroup.accounts.some((account) => {
          const rowStartDate = dayjs(account.startDate);
          const rowEndDate = dayjs(account.endDate);
          const start = startDate ? dayjs(startDate) : null;
          const end = endDate ? dayjs(endDate) : null;

          return (
            (!start || rowStartDate.isSameOrAfter(start)) &&
            (!end || rowEndDate.isSameOrBefore(end))
          );
        });
      });
    });
    setFilteredData(filtered);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  const formatNumber = (value) => {
    const number = value || '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title to the top left
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Trial Balance Report', 10, 10);

    // Add date to the top right
    const date = dayjs().format('MM/DD/YYYY');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      date,
      doc.internal.pageSize.getWidth() - 10 - doc.getTextWidth(date),
      10
    );

    // Add logo to the middle
    const imgWidth = 50; // Adjust the width of the logo
    const imgHeight = 20; // Adjust the height of the logo
    const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    doc.addImage('/logo.png', 'PNG', x, 5, imgWidth, imgHeight);

    // Add margin bottom to separate the header from the table
    const headerBottomMargin = 30;

    let body = [];
    let lastSubGroupName = '';

    filteredData.forEach((group) => {
      if (group.groupName !== lastGroupName) {
        body.push([
          {
            content: group.groupName,
            styles: { fontStyle: 'bold' },
          },
          '',
          '',
        ]);
        lastGroupName = group.groupName;
      } else {
        body.push([
          {
            content: '',
            styles: { fontStyle: 'bold' },
          },
          '',
          '',
        ]);
      }

      group.subGroups.forEach((subGroup) => {
        if (subGroup.subGroupName !== lastSubGroupName) {
          body.push([
            {
              content: '    ' + subGroup.subGroupName, // Indentation for subgroups
              styles: { fontStyle: 'bold' },
            },
            '',
            '',
          ]);
          lastSubGroupName = subGroup.subGroupName;
        } else {
          body.push([
            {
              content: '',
              styles: { fontStyle: 'bold' },
            },
            '',
            '',
          ]);
        }

        subGroup.accounts.forEach((account) => {
          body.push([
            {
              content: '        ' + account.accountName, // Indentation for accounts
              styles: { fontStyle: 'normal' },
            },
            account.amount >= 0 ? formatNumber(account.amount) : '',
            account.amount < 0 ? formatNumber(Math.abs(account.amount)) : '',
          ]);
        });
      });
    });

    doc.autoTable({
      head: [['Name', 'Debit', 'Credit']],
      body: body,
      startY: headerBottomMargin, // Start the table after the header margin
      columnStyles: {
        0: { cellWidth: 'auto' }, // Adjust column width if necessary
      },
    });

    doc.save('report.pdf');
  };

  const handlePreviewPDF = () => {
    const doc = new jsPDF();
    const body = [];

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Trial Balance Report', 10, 10);

    // Add date to the top right
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      date,
      doc.internal.pageSize.getWidth() - 10 - doc.getTextWidth(date),
      10
    );

    // Add logo to the middle
    const imgWidth = 50; // Adjust the width of the logo
    const imgHeight = 20; // Adjust the height of the logo
    const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
    doc.addImage('/logo.png', 'PNG', x, 5, imgWidth, imgHeight);

    // Add margin bottom to separate the header from the table
    const headerBottomMargin = 30;

    filteredData.forEach((group) => {
      if (group.groupName) {
        body.push([
          {
            content: group.groupName,
            styles: { fontStyle: 'bold' }, // No paddingLeft here
          },
          '',
          '',
        ]);
      }

      group.subGroups.forEach((subGroup) => {
        if (subGroup.subGroupName) {
          body.push([
            {
              content: '    ' + subGroup.subGroupName, // Indentation for subgroups
              styles: { fontStyle: 'bold' },
            },
            '',
            '',
          ]);
        }

        subGroup.accounts.forEach((account) => {
          body.push([
            {
              content: '        ' + account.accountName, // Indentation for accounts
              styles: { fontStyle: 'normal' },
            },
            account.amount >= 0 ? formatNumber(account.amount) : '',
            account.amount < 0 ? formatNumber(Math.abs(account.amount)) : '',
          ]);
        });
      });
    });

    doc.autoTable({
      head: [['Name', 'Debit', 'Credit']],
      body: body,
      startY: headerBottomMargin, // Start the table after the header margin
      columnStyles: {
        0: { cellWidth: 'auto' }, // Adjust column width if necessary
      },
    });

    doc.save('preview.pdf');
  };
  const formatColumnName = (columnName) => {
    return columnName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-5 bg-white rounded-lg px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-10 mt-[-20px]">
        Trial Balance Report
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Date Filters */}
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
          onClick={handleDateFilter}
          className="col-span-2 mt-2"
        >
          Apply Date Filter
        </Button>
      </div>

      {/* Skip Blank Entries */}
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

      {/* Column Selection */}
      <div className="text-lg font-semibold text-gray-700 mb-3 border-b">
        Select Columns
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
        {['groupName', 'subGroupName', 'accountName', 'amount'].map(
          (column) => (
            <label key={column} className="flex items-center text-gray-600">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnChange(column)}
                className="mr-2"
              />
              {formatColumnName(column)}
            </label>
          )
        )}
      </div>

      <div className=" bg-white py-4  border-t flex justify-between mt-[160px]  ">
        <button
          onClick={handleExportExcel}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Export to Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Export to PDF
        </button>
        <button
          onClick={handlePreviewPDF}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
        >
          Preview PDF
        </button>
      </div>

      {/* Render Data
      <div className="mt-10">
        {filteredData.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <div className="font-bold">{group.groupName}</div>
            {group.subGroups.map((subGroup, subGroupIndex) => (
              <div key={subGroupIndex} className="ml-4">
                <div className="font-semibold">{subGroup.subGroupName}</div>
                {subGroup.accounts.map((account, accountIndex) => (
                  <div key={accountIndex} className="ml-8">
                    <div>
                      {account.accountName}: {account.amount}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TrialBalance;
