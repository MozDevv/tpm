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
      const response = await apiService.get(financeEndpoints.getTrialBalance);
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const body = [];

    filteredData.forEach((group) => {
      body.push([
        {
          content: group.groupName,
          colSpan: selectedColumns.length,
          styles: { halign: 'left', fontStyle: 'bold' },
        },
      ]);
      group.subGroups.forEach((subGroup) => {
        body.push([
          {
            content: subGroup.subGroupName,
            colSpan: selectedColumns.length,
            styles: { halign: 'left', fontStyle: 'bold', marginLeft: 10 },
          },
        ]);
        subGroup.accounts.forEach((account) => {
          const row = selectedColumns.map(
            (col) => account[col] || subGroup[col] || group[col]
          );
          body.push(row);
        });
      });
    });

    doc.autoTable({
      head: [selectedColumns],
      body: body,
    });
    doc.save('report.pdf');
  };

  const handlePreviewPDF = () => {
    const doc = new jsPDF();
    const body = [];

    filteredData.forEach((group) => {
      body.push([
        {
          content: group.groupName,
          colSpan: selectedColumns.length,
          styles: { halign: 'left', fontStyle: 'bold' },
        },
      ]);
      group.subGroups.forEach((subGroup) => {
        body.push([
          {
            content: subGroup.subGroupName,
            colSpan: selectedColumns.length,
            styles: { halign: 'left', fontStyle: 'bold', marginLeft: 10 },
          },
        ]);
        subGroup.accounts.forEach((account) => {
          const row = selectedColumns.map(
            (col) => account[col] || subGroup[col] || group[col]
          );
          body.push(row);
        });
      });
    });

    doc.autoTable({
      head: [selectedColumns],
      body: body,
    });
    window.open(doc.output('bloburl'));
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

      {/* Render Data */}
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
      </div>
    </div>
  );
};

export default TrialBalance;
