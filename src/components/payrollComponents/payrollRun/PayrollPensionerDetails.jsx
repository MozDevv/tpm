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
import { Dialog } from '@mui/material';
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';

function PayrollPensionerDetails({ payrollDetails }) {
  const [qualifyingService, setQualifyingService] = useState([]);
  const [openRunIncrement, setOpenRunIncrement] = useState(false);
  const columnDefs = [
    {
      field: 'pensionerNo',
      headerName: 'Pensioner Number',
      headerClass: 'prefix-header',
      flex: 1,
      // valueFormatter : if award Prefix append to pensionerNo
      valueFormatter: (params) => {
        return params.data.awardPrefix
          ? params.data.awardPrefix + params.data.pensionerNo
          : params.data.pensionerNo;
      },
    },

    {
      field: 'PensionerName',
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
      <div className="ag-theme-quartz mt-5 px-9 h-[150px]">
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

        <div className="min-h-[600px] max-h-[600px] h-[200px]">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={
              payrollDetails &&
              payrollDetails.map((detail) => detail.pensionerDetail)
            }
            pagination={false}
            domLayout="normal"
            alwaysShowHorizontalScroll={true}
            className="custom-grid ag-theme-quartz"
            rowSelection="multiple"
            // onSelectionChanged={onSelectionChanged}
            onRowClicked={(e) => {
              setOpenBaseCard(true);
              console.log('e.data', e.data);
              setClickedRow(e.data);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default PayrollPensionerDetails;
