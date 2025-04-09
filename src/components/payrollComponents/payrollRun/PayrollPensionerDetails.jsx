import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import { parseDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints from '@/components/services/setupsApi';
import { apiService } from '@/components/services/api';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import PayrollDeductionDetails from './PayrollDeductionDetails';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import { Box, Dialog, Pagination } from '@mui/material';
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { ExpandedPayrollDetails } from './ExpandedPayrollDetails';
import { useTheme } from '@emotion/react';

function PayrollPensionerDetails({ clickedItem }) {
  const [qualifyingService, setQualifyingService] = useState([]);
  const [payrollDetails, setPayrollDetails] = useState([]);
  const [openRunIncrement, setOpenRunIncrement] = useState(false);
  const columnDefs = [
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
      field: 'pensionerName',
      headerName: 'Pensioner Name',
      headerClass: 'prefix-header',
      flex: 1,
      valueGetter: (params) => {
        const firstName = params.data?.firstName || '';
        const surname = params.data?.surname || '';
        const otherName = params.data?.otherName || '';
        return `${firstName} ${surname} ${otherName}`.trim();
      },
    },

    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        const statusMap = {
          0: { label: 'Unadmitted', color: '#007bff' }, // Blue
          1: { label: 'Active', color: '#28a745' }, // Bright Green
          2: { label: 'Suspended', color: '#ffc107' }, // Yellow
          3: { label: 'Inactive', color: '#dc3545' }, // Bright Red
          4: { label: 'Stopped', color: '#6f42c1' }, // Violet
          5: { label: 'Deleted', color: '#343a40' }, // Dark Gray
        };

        const status = statusMap[params.value] || {
          label: 'Unknown',
          color: 'gray',
        };

        return (
          <span
            style={{
              color: status.color,
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'inline-flex', // Use inline-flex for alignment
              alignItems: 'center', // Vertically center the text
              justifyContent: 'center', // Horizontally center the text
              width: '100%', // Ensure it takes the full width of the cell
              height: '100%', // Ensure it takes the full height of the cell
            }}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      field: 'netAmount',
      headerName: 'Net Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalGrossArrears',
      headerName: 'Total Gross Arrears',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalNetArrears',
      headerName: 'Total Net Arrears',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'lastPayGrossAmount',

      headerName: 'Last Pay Gross Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'lastPayNetAmount',
      headerName: 'Last Pay Net Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
  ];

  const gridApiRef = useRef(null);

  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [clickedRow, setClickedRow] = React.useState(null);

  const fields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'surname',
      label: 'Surname',
      type: 'text',
      disabled: true,
    },
    {
      name: 'otherName',
      label: 'Other Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'awardPrefix',
      label: 'Award Prefix',
      type: 'text',
      disabled: true,
    },

    {
      name: 'pensionerNo',
      label: 'Pensioner Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerCode',
      label: 'Pensioner Code',
      type: 'text',
      disabled: true,
    },
    {
      name: 'grossAmount',
      label: 'Gross Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      disabled: true,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'suspensionStartDate',
      label: 'Suspension Start Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'resumptionDate',
      label: 'Resumption Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastPayDate',
      label: 'Last Pay Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'retirementDate',
      label: 'Retirement Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastPayGrossAmount',
      label: 'Last Pay Gross Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'lastPayNetAmount',
      label: 'Last Pay Net Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalGrossArrears',
      label: 'Total Gross Arrears',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNetArrears',
      label: 'Total Net Arrears',
      type: 'amount',
      disabled: true,
    },
  ];

  const handlers = {
    edit: () => console.log('Edit clicked'),
    //  resumePayroll: () => console.log('Resume Payroll clicked'),
    approvePayrollStop: () => console.log('Approve Payroll Stop clicked'),
    stopPayroll: () => setOpenRunIncrement(true),
  };

  const stopPayroll = () => {
    console.log('Stop Payroll clicked');
  };

  const { data } = useFetchAsyncV2(
    payrollEndpoints.getSuspensionReasons,
    payrollApiService
  );
  const stopPayrollFields = [
    {
      name: 'reasonId',
      label: 'Reason',
      type: 'select',
      options:
        data &&
        data?.map((item) => ({
          id: item.reasonId,
          name: item.description,
        })),
    },
    {
      name: 'suspensionDate',
      label: 'Suspension Date',
      type: 'date',
    },
    {
      name: 'suspensionPeriod',
      label: 'Suspension Period',
      type: 'date',
    },
  ];

  const tabPanes = [
    {
      key: '1',
      title: 'Pensioner Information',
      content: (
        <div>
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createDepartment}
            postApiFunction={apiService.post}
            clickedItem={clickedRow}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        </div>
      ),
    },
    {
      key: '',
      title: 'Deductions',
      content: (
        <div>
          <PayrollDeductionDetails
            payrollDetails={
              payrollDetails &&
              clickedRow &&
              payrollDetails.filter(
                (item) => item.payrollId === clickedRow.payrollId
              )
            }
          />
        </div>
      ),
    },
  ];

  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPayrollDetails = async (id, pageNumber, filters = {}) => {
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.getPeriodSchedule(id),
        {
          'paging.pageNumber': pageNumber,
          'paging.pageSize': 10,

          ...filters,
        }
      );
      if (res.status === 200) {
        const { totalCount, totalPages } = res.data;
        setTotalPages(totalPages);
        setPayrollDetails(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching payroll details', error);
    }
  };

  useEffect(() => {
    if (pageNumber) {
      fetchPayrollDetails(clickedItem.periodId, pageNumber);
    }
  }, [pageNumber]);
  useEffect(() => {
    if (clickedItem) {
      fetchPayrollDetails(clickedItem.periodId);
    }
  }, [clickedItem]);

  const handlePaginationChange = (e, newPage) => {
    console.log('newPage', newPage);
    console.log('***********************');
    console.log('e', e);
    setPageNumber(newPage);
  };

  const [searchText, setSearchText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('pensionerNo');
  const handleSearchColumns = () => {
    const filters = {
      'filterCriterion.criterions[0].propertyName': selectedColumn,
      'filterCriterion.criterions[0].propertyValue': searchText,
      'filterCriterion.criterions[0].criterionType': 2,
    };
    fetchPayrollDetails(clickedItem.periodId, 1, filters);
  };
  const theme = useTheme();

  return (
    <>
      <BaseCard
        openBaseCard={openRunIncrement}
        isSecondaryCard2={true}
        setOpenBaseCard={setOpenRunIncrement}
        //handlers={baseCardHandlers}
        title={
          clickedRow && clickedRow.awardPrefix
            ? clickedRow.awardPrefix + clickedRow.pensionerNo
            : ''
        }
        clickedItem={clickedRow}
        isUserComponent={false}
      >
        <BaseInputCard
          id={clickedRow?.payrollId}
          idLabel="payrollId"
          isBranch={true}
          fields={stopPayrollFields}
          apiEndpoint={payrollEndpoints.stopPayroll}
          postApiFunction={payrollApiService.post}
          // clickedItem={clickedRow}
          useRequestBody={true}
          setOpenBaseCard={setOpenRunIncrement}
        />
      </BaseCard>
      <div className="ag-theme-quartz mt-5 px-5  relative">
        <BaseCard
          openBaseCard={openBaseCard}
          isSecondaryCard={true}
          setOpenBaseCard={setOpenBaseCard}
          //handlers={baseCardHandlers}
          title={'Pensioner Details'}
          clickedItem={clickedRow}
          status={4}
          isUserComponent={false}
          handlers={handlers}
        >
          <BaseTabs tabPanes={tabPanes} />
        </BaseCard>

        <div className="h-[63vh] flex flex-col gap-3">
          <div className="mt-[-20px]">
            <ExpandedPayrollDetails
              eligibleColDefs={columnDefs}
              elgiblePensioners={payrollDetails}
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
                fetchPayrollDetails(clickedItem?.periodId, 1, {});
              }}
              notTable={true}
            />
          </div>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={[
              ...(payrollDetails &&
                payrollDetails.map((detail) => ({
                  ...detail.pensionerDetail, // Spread the existing pensionerDetail fields
                  totalNetArrears: detail.totalNetArrears, // Add totalNetArrears from payrollDetails
                  totalGrossArrears: detail.totalGrossArrears, // Add grossAmount from payrollDetails
                  netAmount: detail.netAmount, // Add netAmount from payrollDetails
                }))),
            ]}
            pagination={false}
            domLayout="normal"
            alwaysShowHorizontalScroll={true}
            className="custom-grid ag-theme-quartz px-2"
            rowSelection="multiple"
            // onSelectionChanged={onSelectionChanged}
            onRowClicked={(e) => {
              setOpenBaseCard(true);
              console.log('e.data', e.data);
              setClickedRow(e.data);
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              // position: 'absolute',
              // bottom: '-20px', // Adjust this value to position the pagination vertically

              // left: '50%', // Move to the center of the parent
              // transform: 'translateX(-50%)', // Adjust to center horizontally
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
      </div>
    </>
  );
}

export default PayrollPensionerDetails;
