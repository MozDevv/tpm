import React, { useState, useEffect, useRef } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs'; // Make sure to install dayjs for date handling
import { Add, Close, RemoveCircle } from '@mui/icons-material';
import ClaimRegister from './ClaimRegister';
import { apiService } from '@/components/services/claimsApi';
import claimsEndpoints from '@/components/services/claimsApi';

const ClaimVerification = ({ setOpenTrialBalanceReport }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([
    'Pensioner No.',
    'Claim Name',
    'Description',
    'Ministry/Department',
    'Personal Number',
    'Reference No.',
  ]);
  const [skipBlankEntries, setSkipBlankEntries] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowData, setRowData] = useState([]);

  const colDefs = [
    {
      headerName: 'Ministry/Department',
      field: 'mda_code',
      width: 200,
    },
    {
      headerName: 'Description',
      field: 'mda_description',
      width: 200,
    },

    {
      headerName: 'Claim Name',
      field: 'pensioner_full_name',
      width: 200,
    },
    {
      headerName: 'Personal Number',
      field: 'personal_number',
      width: 180,
    },
    {
      headerName: 'Reference No.',
      field: 'claim_id',
      width: 150,
    },
    {
      headerName: 'Email Address',
      field: 'email_address',
      width: 200,
      filter: true,
    },
    {
      headerName: 'Gender',
      field: 'gender',
      width: 120,
      cellRenderer: (params) => {
        return params.value === 1 ? 'Male' : 'Female';
      },
    },
    {
      headerName: 'Phone Number',
      field: 'phone_number',
      width: 180,
    },

    {
      headerName: 'National ID',
      field: 'national_id',
      width: 150,
    },
    {
      headerName: 'KRA PIN',
      field: 'kra_pin',
      width: 150,
    },
    {
      headerName: 'Retirement Date',
      field: 'retirement_date',
      width: 180,
      cellRenderer: function (params) {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      },
    },
    {
      headerName: 'Date of Birth',
      field: 'dob',
      width: 180,
      cellRenderer: function (params) {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      },
    },
    {
      headerName: 'Date of Confirmation',
      field: 'date_of_confirmation',
      width: 200,
      cellRenderer: function (params) {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      },
    },
  ];

  const getClaims = async () => {
    setLoading(true);
    try {
      const res = await apiService.get(claimsEndpoints.getClaims, {
        'paging.pageNumber': 1,
        'paging.pageSize': 100000,
      });
      const rawData = res.data.data;

      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalCount);

      const mappedData = rawData.map((item) => ({
        retiree: item?.prospectivePensioner?.id,
        claim_id: item?.claim_id,
        id_claim: item?.id,
        stage: item?.stage,
        comments: item?.comments,
        pensioner_full_name: `${item?.prospectivePensioner?.first_name} ${item?.prospectivePensioner?.surname}`,
        maintenance_case: item?.prospectivePensioner?.maintenance_case,
        is_wcps: item?.prospectivePensioner?.is_wcps,
        email_address: item?.prospectivePensioner?.email_address,
        notification_status: item?.prospectivePensioner?.notification_status,
        gender: item?.prospectivePensioner?.gender,
        phone_number: item?.prospectivePensioner?.phone_number,
        personal_number: item?.prospectivePensioner?.personal_number,
        surname: item?.prospectivePensioner?.surname,
        first_name: item?.prospectivePensioner?.first_name,
        other_name: item?.prospectivePensioner?.other_name,
        pension_award: item?.prospectivePensioner?.mda?.name,
        name: item?.prospectivePensioner?.pension_award?.name,
        national_id: item?.prospectivePensioner?.national_id,
        kra_pin: item?.prospectivePensioner?.kra_pin,
        retirement_date: item?.prospectivePensioner?.retirement_date,
        dob: item?.prospectivePensioner?.dob,
        date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
        last_basic_salary_amount:
          item?.prospectivePensioner?.last_basic_salary_amount,
        mda_code: item?.prospectivePensioner?.mda?.code,
        mda_description: item?.prospectivePensioner?.mda?.description,
        mda_pensionCap_code: item?.prospectivePensioner?.mda?.pensionCap?.code,
        mda_pensionCap_name: item?.prospectivePensioner?.mda?.pensionCap?.name,
        mda_pensionCap_description:
          item?.prospectivePensioner?.mda?.pensionCap?.description,
        workHistories_length: item?.prospectivePensioner?.workHistories?.length,
        bankDetails_length: item?.prospectivePensioner?.bankDetails?.length,
        pensionAward_prefix: item?.prospectivePensioner?.pensionAward?.prefix,
        pensionAward_code: item?.prospectivePensioner?.pensionAward?.code,
        pensionAward_description:
          item?.prospectivePensioner?.pensionAward?.description,
        pensionAward_start_date:
          item?.prospectivePensioner?.pensionAward?.start_date,
        pensionAward_end_date:
          item?.prospectivePensioner?.pensionAward?.end_date,
        pensionAward_pensionCap_code:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.code,
        pensionAward_pensionCap_name:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.name,
        pensionAward_pensionCap_description:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.description,
        pensionAward_pensionCap_id:
          item?.prospectivePensioner?.pensionAward?.pensionCap?.id,
        approval_status: item?.document_status,
        retirement_date: item?.prospectivePensioner?.retirement_date,
        date_from_which_pension_will_commence:
          item?.prospectivePensioner?.date_from_which_pension_will_commence,
        authority_for_retirement_dated:
          item?.prospectivePensioner?.authority_for_retirement_dated,
        authority_for_retirement_reference:
          item?.prospectivePensioner?.authority_for_retirement_reference,
        date_of_first_appointment:
          item?.prospectivePensioner?.date_of_first_appointment,
        date_of_confirmation: item?.prospectivePensioner?.date_of_confirmation,
        country: item?.prospectivePensioner?.country,
        city_town: item?.prospectivePensioner?.city_town,
        pension_commencement_date:
          item?.prospectivePensioner?.pension_commencement_date,
        postal_address: item?.prospectivePensioner?.postal_address,
        id: item.prospectivePensioner?.id,
        exit_grounds: item?.prospectivePensioner?.exitGround.name,
        prospectivePensionerAwards:
          item?.prospectivePensioner?.prospectivePensionerAwards,
      }));

      setRowData(mappedData);
      setFilteredData(mappedData);
      console.log('mappedData', mappedData);
    } catch (error) {
      console.error('Error fetching preclaims:', error);
      return []; // Return an empty array or handle error as needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClaims();
  }, []);

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

  const formatColumnName = (columnName) => {
    return columnName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const [openClaimRegister, setOpenClaimRegister] = React.useState(false);

  const filteredColDefs = colDefs.filter((col) =>
    selectedColumns.includes(col.headerName)
  );

  ///////////  This is the final return statement  ///////////

  const contentRef = useRef();

  const [pdfBlob, setPdfBlob] = useState(null);

  const handleDownload = async () => {
    setLoading(true);

    const element = contentRef.current;

    // Load html2pdf.js dynamically, only in the browser
    const html2pdf = (await import('html2pdf.js')).default;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Page 5.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    const wrapper = document.createElement('div');
    wrapper.style.width = `${fixedWidth}px`;
    wrapper.style.height = `${fixedHeight}px`;
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';

    const clonedElement = element.cloneNode(true);
    clonedElement.style.transform = 'scale(0.8)';
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

  const generatePdfBlob = async () => {
    setTimeout(async () => {
      const element = contentRef.current;

      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default;

      // Define fixed dimensions for the content (in pixels)
      const fixedWidth = 770; // Width in pixels
      const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

      // Define options for the PDF
      const options = {
        margin: 0.5, // Default margin (in inches)
        filename: 'Claim Verification Register.pdf',
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

      const clonedElement = element.cloneNode(true);
      const scale = 0.8; // Scale factor to reduce the size
      clonedElement.style.transform = `scale(${scale})`;
      clonedElement.style.transformOrigin = 'top left';
      clonedElement.style.width = `${fixedWidth}px`;
      clonedElement.style.height = `${fixedHeight}px`;

      wrapper.appendChild(clonedElement);

      html2pdf()
        .set(options)
        .from(wrapper)
        .outputPdf('blob')
        .then((pdfBlob) => {
          setPdfBlob(pdfBlob);
          setLoading(false);
          setOpenClaimRegister(true);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 100); // Adjust the delay as needed
  };
  const [showAllColumns, setShowAllColumns] = useState(false);

  const handleShowMoreColumns = () => {
    setShowAllColumns(!showAllColumns);
  };

  const [mdas, setMdas] = useState([]);

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(claimsEndpoints.mdas, {
        'paging.pageNumber': 1,
        'paging.pageSize': 1000,
      });
      setMdas(
        res.data.data.map((mda) => ({
          id: mda.description,
          name: mda.description,
        }))
      );
    } catch (error) {
      console.error('Error fetching MDAs:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []);
  const visibleColumns = showAllColumns ? colDefs : colDefs.slice(0, 6); // Show first 6 columns (2 rows of 3 columns each)

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const fields = [
    {
      label: 'Ministry/Department',
      name: 'mda_description',
      type: 'select',
      options: mdas,
    },
    {
      label: 'Personal Number',
      name: 'personal_number',
      type: 'text',
    },
    {
      label: 'Pensioner Name',
      name: 'pensioner_full_name',
      type: 'text',
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      options: [
        { id: 1, name: 'Female' },
        { id: 0, name: 'Male' },
      ],
    },
    {
      label: 'Email Address',
      name: 'email_address',
      type: 'text',
    },
    {
      label: 'Phone Number',
      name: 'phone_number',
      type: 'text',
    },
    {
      label: 'National ID',
      name: 'national_id',
      type: 'text',
    },
    {
      label: 'KRA PIN',
      name: 'kra_pin',
      type: 'text',
    },
    {
      label: 'Retirement Date',
      name: 'retirement_date',
      type: 'date',
    },
    {
      label: 'Date of Birth',
      name: 'dob',
      type: 'date',
    },
    {
      label: 'Date of Confirmation',
      name: 'date_of_confirmation',
      type: 'date',
    },
  ];

  const [filters, setFilters] = useState([
    {
      label: 'Ministry/Department',
      name: 'mda_description',
      value: '',
      type: 'select',
      options: [],
    },
    {
      label: 'Personal Number',
      name: 'personal_number',
      value: '',
      type: 'text',
    },
  ]);

  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleAddFilter = (fieldName) => {
    const field = fields.find((f) => f.name === fieldName);
    if (field) {
      setFilters([...filters, { ...field, value: '' }]);
    }
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value; // Update filter value
    setFilters(newFilters);
  };

  // Updated dynamic filter application logic
  const applyFilters = () => {
    let filteredData = rowData;

    filters.forEach((filter) => {
      if (filter.value) {
        filteredData = filteredData.filter((row) => {
          if (filter.type === 'select') {
            return row[filter.name] === filter.value;
          }
          return row[filter.name] === filter.value;
        });
      }
    });

    setFilteredData(filteredData);
  };
  const availableFields = fields.filter(
    (f) => !filters.some((filter) => filter.name === f.name)
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-5 bg-white rounded-lg px-4">
      <h1 className="text-[24px] font-bold text-primary mb-14 mt-[-20px]">
        Claim Verification Register Report
      </h1>
      <Dialog
        open={openClaimRegister}
        onClose={() => setOpenClaimRegister(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '85vh',
            minWidth: '65vw',
            maxWidth: '35vw',
          },
        }}
      >
        <div>
          <div className="">
            {pdfBlob && (
              <iframe
                src={URL.createObjectURL(pdfBlob)}
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="Page 5 PDF"
              />
            )}{' '}
          </div>
          <div
            className="bg-white h-[120px] mb-[-30px] flex justify-between items-center absolute bottom-3 px-4 w-full"
            style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Download PDF
            </button>
            <button
              onClick={() => setOpenClaimRegister(false)} // Assuming this is the cancel action
              className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
      <div className="hidden">
        <div ref={contentRef} className=" pb-3">
          <div className="text-center mx-auto flex flex-col items-center font-sans mb-4">
            <img src="/kenya.png" alt="" height={60} width={60} className="" />
            <h2 className="text-base font-bold">PENSIONS DEPARTMENT</h2>
          </div>
          <div className="flex flex-row gap-2 justify-center text-[18px] courier-font pb-3">
            <div className="text-gray-500 border-b-[1px] pb-1 border-black">
              Claims Verification Register Approval For
            </div>
            <div className="font-semibold">RG4</div>
            <div className="text-gray-500 border-b-[1px] pb-1 border-black">
              Work Group On Date Of
            </div>
            <div className="font-semibold">27-APR-21</div>
            <div className="text-gray-500 pb-1">To</div>
            <div className="font-semibold">05-MAY-24</div>
          </div>
          <div className="w-full pb-5">
            <table className="w-full bg-white border-collapse courier-font">
              <thead>
                <tr>
                  {filteredColDefs.map((header, index) => (
                    <th key={index} className="text-left px-4 py-2 font-bold">
                      {header.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {filteredColDefs.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="text-gray-600 text-start pl-3"
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
      </div>
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
      <div className="mb-5 mt-10">
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
      <div className="text-lg font-semibold text-primary mb-6 border-b">
        Select Columns
      </div>
      <div>
        <div className="grid grid-cols-3 gap-4 mb-2 mt-2">
          {visibleColumns.map((column, index) => (
            <label
              key={index}
              className="flex items-center text-gray-900 text-[13px] font-montserrat"
            >
              <input
                type="checkbox"
                checked={selectedColumns.includes(column.headerName)}
                onChange={() => handleColumnChange(column.headerName)}
                className="mr-2"
              />
              {column.headerName}
            </label>
          ))}
          {colDefs.length > 6 && (
            <Button
              onClick={handleShowMoreColumns}
              variant="text"
              startIcon={<Add />}
            >
              {showAllColumns ? 'Show Less' : 'Add More Columns'}
            </Button>
          )}
        </div>
      </div>
      <div className="mt-6">
        <div className="text-lg font-semibold text-primary mb-3 border-b">
          Filter By:
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4 mb-2 mt-2">
            {filters.map((filter, index) => {
              const field = fields.find((f) => f.name === filter.name);
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex justify-between w-full items-center">
                    <label className="text-xs font-semibold text-gray-600">
                      {field.label}
                    </label>
                    <div className="flex-grow border-b-2 border-dashed border-gray-200 mx-2"></div>
                    {filter.type === 'select' ? (
                      <Autocomplete
                        options={field.options}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) =>
                          handleFilterChange(index, 'value', newValue?.id || '')
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            fullWidth
                            name={filter.name}
                            onChange={(e) =>
                              handleFilterChange(index, 'value', e.target.value)
                            }
                          />
                        )}
                        value={
                          field.options.find(
                            (option) => option.id === filter.value
                          ) || null
                        }
                        className="w-1/2"
                        onBlur={applyFilters}
                      />
                    ) : (
                      <TextField
                        value={filter.value}
                        onChange={
                          (e) =>
                            handleFilterChange(index, 'value', e.target.value) // Fix value handling
                        }
                        className="w-1/2"
                        onBlur={applyFilters}
                        InputProps={{
                          style: {
                            height: '36px',
                            padding: '0 4px',
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: '12px',
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button to add more filters */}
          <Button
            onClick={() => setShowFilterMenu(true)}
            variant="text"
            startIcon={<Add />}
          >
            Add More Filters
          </Button>
        </div>

        {showFilterMenu && (
          <Dialog
            open={showFilterMenu}
            onClose={() => setShowFilterMenu(false)}
            fullWidth
            sx={{
              '& .MuiPaper-root': {
                maxWidth: '25vw',
              },
            }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select Columns</h2>
                <IconButton onClick={() => setShowFilterMenu(false)}>
                  <Close />
                </IconButton>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <label
                    key={index}
                    className="flex items-center text-gray-900 text-[13px]"
                  >
                    <input
                      type="checkbox"
                      onChange={() => handleAddFilter(field.name)}
                      className="mr-2"
                      checked={filters.some(
                        (filter) => filter.name === field.name
                      )}
                    />
                    {field.label}
                  </label>
                ))}
              </div>
              <Button
                onClick={() => setShowFilterMenu(false)}
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,

                  ml: 'auto',
                }}
              >
                Done
              </Button>
            </div>
          </Dialog>
        )}
      </div>

      <div className=" bg-white py-4  border-t flex justify-between">
        <button
          onClick={() => generatePdfBlob()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Preview PDF
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ClaimVerification;
