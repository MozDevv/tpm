import React, { useState } from 'react';
import { TextField, Button, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { Checkbox } from 'antd';
import endpoints, { apiService } from '../services/setupsApi';

function OmbudsmanReport({ columnDefs, onGenerateReport }) {
  // State variables
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skipBlankEntries, setSkipBlankEntries] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [error, setError] = useState('');

  // Handlers
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleColumnSelection = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    setError('');
    const filters = {
      startDate,
      endDate,
      skipBlankEntries,
      selectedColumns,
    };
    onGenerateReport(filters); // Pass filters to the parent component
  };

  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const contentRef = React.createRef();
  const handleDownload = async () => {
    setLoading(true);

    const element = contentRef.current;

    // Load html2pdf.js dynamically, only in the browser
    const html2pdf = (await import('html2pdf.js')).default;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Ombudsman Report.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    const wrapper = document.createElement('div');

    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';

    const clonedElement = element.cloneNode(true);
    clonedElement.style.transform = 'scale(1)';
    clonedElement.style.transformOrigin = 'top left';

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

  const fetchRowData = async () => {
    try {
      const res = await apiService.get(endpoints.getOmbudsman);
      if (res.status === 200) {
        setRowData(
          res.data.data.map((item) => ({
            ...item,
            status: item.status === 1 ? 'Resolved' : 'On Going',
          }))
        );
        handleDownload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-5 bg-white rounded-lg px-4">
      <div
        className=""
        style={
          {
            //   display: 'none',
          }
        }
      >
        <div className="max-w-3xl mx-auto" ref={contentRef}>
          <div className="text-center space-y-1 text-[11px] font-sans">
            <div className="text-center">
              <img
                src="/kenya.png"
                height={60}
                width={100}
                className="mb-2 inline-block"
              />
            </div>

            <p className="font-bold uppercase">Republic of Kenya</p>
            <p className="font-bold uppercase">
              The National Treasury & Economic Planning
            </p>
            <p className="">
              Name of Public Institution: The National Treasury & Economic
              Planning
            </p>
            <p className="">Financial Year: 2023/2024</p>
            <p className="font-semibold">
              Resolution of Public Complaints Received from CAJ – Report for the
              3rd Quarter Ending 30th April, 2024
            </p>
          </div>
          <table
            style={{
              transform: 'scale(0.8)',
              transformOrigin: 'top left',
              width: '100%',
            }}
            className=" border-collapse font-sans text-[10px]"
          >
            <thead>
              <tr className="">
                {columnDefs.map((header, index) => (
                  <th key={index} className="text-left px-4 py-2 font-bold">
                    {header.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowData.map((row, rowIndex) => (
                <tr key={rowIndex} className="">
                  {columnDefs.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className=" text-gray-600 text-start pl-3"
                    >
                      {row[cell.field] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-14 mt-[-20px]">
        Ombudsman Report
      </h1>
      <IconButton
        onClick={() => onGenerateReport(null)} // Close the report dialog
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

      <div className="mb-4 grid grid-cols-2 gap-4">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
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
          error={!!error && !startDate}
          helperText={!startDate && error ? 'Start date is required' : ''}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
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
          error={!!error && !endDate}
          helperText={!endDate && error ? 'End date is required' : ''}
        />
        <Button
          variant="contained"
          onClick={handleGenerateReport}
          className="col-span-2 mt-2"
        >
          Apply Date Filter
        </Button>
      </div>

      <div className="mb-10 mt-10">
        <label className="inline-flex items-center">
          <Checkbox
            checked={skipBlankEntries}
            onChange={() => setSkipBlankEntries(!skipBlankEntries)}
            className="mr-2"
          />
          Skip blank entries
        </label>
      </div>

      <div className="text-lg font-semibold text-gray-700 mb-8 border-b">
        Select Columns
      </div>
      <div className="grid grid-cols-2 gap-4 mt-3">
        {columnDefs.map((col) => (
          <label
            key={col.field}
            className="inline-flex items-center text-[13px]"
          >
            <Checkbox
              checked={selectedColumns.includes(col.field)}
              onChange={() => handleColumnSelection(col.field)}
              className="mr-2"
            />
            {col.headerName}
          </label>
        ))}
      </div>

      <div className=" bg-white py-4  border-t flex justify-between mt-5 ">
        <button
          // onClick={handleExportExcel}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Export to Excel
        </button>
        <button
          onClick={fetchRowData}
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
  );
}

export default OmbudsmanReport;
