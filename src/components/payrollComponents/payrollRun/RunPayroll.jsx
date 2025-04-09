'use client';
import React, { use, useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { Backdrop, Box, Button, Pagination } from '@mui/material';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { AgGridReact } from 'ag-grid-react';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import { formatNumber } from '@/utils/numberFormatters';
import BaseExpandCard from '@/components/baseComponents/BaseExpandCard';
import PayrollPensioners from '../PayrollPensioners';
import { Search } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { ExpandedPayrollDetails } from './ExpandedPayrollDetails';

const RunPayroll = () => {
  const [computing, setComputing] = React.useState(false);
  const eligibleColDefs = [
    {
      field: 'pensionerNo',
      headerName: 'Pensioner No',
      width: 200,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold underline ">
            {params.data.awardPrefix
              ? params.data.awardPrefix + params.data.pensionerNo
              : params.data.pensionerNo}
          </p>
        );
      },
    },

    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
    },
    {
      field: 'surname',
      headerName: 'Surname',
      width: 150,
    },

    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      width: 150,
      valueFormatter: (params) => formatNumber(params.value), // Format as currency
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      cellRenderer: (params) => {
        //Admitted0, Not Admitted1
        const status = params.data?.status === 0 ? 'Admitted' : 'Not Admitted';
        const statusClass = params.data?.status === 0 ? 'text-green-500' : '';
        return <p className={`text-center ${statusClass}`}>{status}</p>;
      },
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(), // Format as date
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(), // Format as date
    },

    // {
    //   field: 'lastPayDate',
    //   headerName: 'Last Pay Date',
    //   width: 150,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toLocaleDateString() : 'N/A', // Handle null values
    // },
    // {
    //   field: 'retirementDate',
    //   headerName: 'Retirement Date',
    //   width: 150,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toLocaleDateString() : 'N/A', // Handle null values
    // },
    {
      field: 'lastPayGrossAmount',
      headerName: 'Last Pay Gross Amount',
      width: 200,
      valueFormatter: (params) =>
        params.value?.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }), // Format as currency
    },
    {
      field: 'lastPayNetAmount',
      headerName: 'Last Pay Net Amount',
      width: 200,
      valueFormatter: (params) =>
        params.value?.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }), // Format as currency
    },

    {
      field: 'corePayrollNo',
      headerName: 'Core Payroll No',
      width: 200,
    },

    {
      field: 'totalDeductions',
      headerName: 'Total Deductions',
      width: 150,
      valueFormatter: (params) => formatNumber(params.value), // Format as currency
    },
    {
      field: 'amountDeducted',
      headerName: 'Amount Deducted',
      width: 150,
      valueFormatter: (params) => formatNumber(params.value), // Format as currency
    },
    {
      field: 'remainingDeductions',
      headerName: 'Remaining Deductions',
      width: 180,
      valueFormatter: (params) => formatNumber(params.value),
    },
  ];
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold underline ">
            {params.value}
          </p>
        );
      },
    },
    {
      field: 'code',
      headerName: 'Code',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'maximumPayableAmount',
      headerName: 'Maximum Payable Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'isTaxable',
      headerName: 'Is Taxable',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };

  const trialRun = async () => {
    setComputing(true);
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.trialRun(clickedItem.id)
      );
      if (res.status === 200) {
        setComputing(false);
      } else {
        message.error('Error running payroll');
      }
    } catch (error) {
      console.log('Error computing payroll >>>>>>>>>>>:', error);
    } finally {
      setComputing(false);
    }
  };

  const [selectedRows, setSelectedRows] = React.useState([]);
  const handlers = {
    runPayroll: async () => {
      if (selectedRows.length > 0) {
        setComputing(true);
        try {
          for (const row of selectedRows) {
            const res = await payrollApiService.get(
              payrollEndpoints.trialRun(row.id)
            );
            if (res.status !== 200) {
              message.error('Error running payroll for period ID: ' + row.id);
              break;
            }
          }
          setComputing(false);
        } catch (error) {
          console.log('Error computing payroll >>>>>>>>>>>:', error);
        } finally {
          setComputing(false);
        }
      } else {
        message.warning('No rows selected');
      }
    },
  };

  const baseCardHandlers = {
    runPayroll: () => trialRun(),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [elgiblePensioners, setElgiblePensioners] = React.useState([]);

  const title = clickedItem ? clickedItem?.name : 'Create New Payroll Types"';

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      disabled: true,
    },
    {
      name: 'type',
      label: 'Type',
      disabled: true,
      type: 'select',
      options: [
        { value: 0, label: 'Main' },
        { value: 1, label: 'Injury' },
        { value: 2, label: 'Dependent' },
        { value: 3, label: 'Agency' },
      ],
    },
    {
      name: 'maximumPayableAmount',
      label: 'Maximum Payable Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'isTaxable',
      label: 'Is Taxable',
      type: 'switch',
      disabled: true,
    },
  ];

  const [expanded, setExpanded] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [openClickedPensioner, setOpenClickedPensioner] = useState(false);
  const [clickedItemParent, setClickedItemParent] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('pensionerNo');

  const handleExpand = (content, title) => {
    setDialogContent(content);
    setDialogTitle(title);
    setExpanded(true);
  };

  const handlePaginationChange = (e, newPage) => {
    console.log('newPage', newPage);
    console.log('***********************');
    console.log('e', e);
    setPageNumber(newPage);
  };

  const fetchEligiblePensioners = async (pageNumber = 1, filters) => {
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.getEligiblePensioners(clickedItem.id),
        {
          'paging.pageNumber': pageNumber,
          'paging.pageSize': 8,
          ...filters,
        }
      );
      if (res.status === 200) {
        const { totalCount, totalPages } = res.data;
        setTotalPages(totalPages);
        setElgiblePensioners(res.data?.data || []);
      } else {
        message.error('Error fetching eligible pensioners');
      }
    } catch (error) {
      console.log('Error fetching eligible pensioners >>>>>>>>>>>:', error);
    }
  };
  const handleSearchColumns = () => {
    const filters = {
      'filterCriterion.criterions[0].propertyName': selectedColumn,
      'filterCriterion.criterions[0].propertyValue': searchText,
      'filterCriterion.criterions[0].criterionType': 2,
    };
    fetchEligiblePensioners(1, filters);
  };

  useEffect(() => {
    if (pageNumber) {
      fetchEligiblePensioners(pageNumber);
    }
  }, [pageNumber]);
  useEffect(() => {
    fetchEligiblePensioners();
  }, [clickedItem]);

  const theme = useTheme();
  return (
    <div className="">
      {computing && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 99999999999 }}
          open={open}
          onClick={() => setComputing(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Running Payroll
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}

      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {openClickedPensioner && (
          <PayrollPensioners
            openClickedPensioner={openClickedPensioner}
            setOpenClickedPensioner={setOpenClickedPensioner}
            isImported={true}
            clickedItemParent={clickedItemParent}
          />
        )}
        {clickedItem ? (
          <div className="mt-3">
            <BaseCollapse name="Payroll Details">
              <div className="px-3">
                <BaseInputCard
                  disableAll={true}
                  fields={fields}
                  apiEndpoint={payrollEndpoints.updatePayrollTypes}
                  postApiFunction={payrollApiService.post}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                  setOpenBaseCard={setOpenBaseCard}
                />
              </div>
            </BaseCollapse>

            <BaseCollapse
              className="mt-[-20px]"
              name="Eligible Pensioners"
              expandHandler={() => handleExpand('Payroll Details')}
            >
              <BaseExpandCard
                open={expanded}
                onClose={() => setExpanded(false)}
                title="Eligible Pensioners"
              >
                <ExpandedPayrollDetails
                  eligibleColDefs={eligibleColDefs}
                  elgiblePensioners={elgiblePensioners}
                  totalPages={totalPages}
                  pageNumber={pageNumber}
                  handlePaginationChange={handlePaginationChange}
                  handleSearchColumns={handleSearchColumns}
                  setSearchText={setSearchText}
                  setSelectedColumn={setSelectedColumn}
                  theme={theme}
                  handleResetFilters={() => {
                    setSearchText('');
                    setSelectedColumn('pensionerNo');
                    fetchEligiblePensioners(1, {});
                  }}
                />
                ,
              </BaseExpandCard>

              <div className="px-5 ag-theme-quartz h-[40vh] pt-1">
                <AgGridReact
                  noRowsOverlayComponent={BaseEmptyComponent}
                  columnDefs={eligibleColDefs}
                  rowData={elgiblePensioners}
                  pagination={false}
                  domLayout="normal"
                  alwaysShowHorizontalScroll={true}
                  animateRows={true}
                  rowSelection="multiple"
                  className="custom-grid ag-theme-quartz"
                  onRowClicked={(e) => {
                    setOpenClickedPensioner(true);
                    setClickedItemParent(e.data);
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: '60px',
                    left: '50%', // Move to the center of the parent
                    transform: 'translateX(-50%)', // Adjust to center horizontally
                  }}
                >
                  <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={pageNumber}
                    onChange={handlePaginationChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              </div>
            </BaseCollapse>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.createPayrollTypes}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getPayrollTypes}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={{}}
        breadcrumbTitle="Run Payroll"
        currentTitle="Run Payroll"
        isPayroll={true}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default RunPayroll;
