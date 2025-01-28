'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';

const MainPayroll = () => {
  const columnDefs = [
    {
      field: 'pensionerNo',
      headerName: 'Pensioner No',
      width: 200,
      filter: true,
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
      field: 'pensionerCode',
      headerName: 'Pensioner Code',
      headerClass: 'prefix-header',

      width: 150,

      filter: true,
      cellRenderer: (params) => {
        return <p className="text-primary ">{params.value}</p>;
      },
    },

    {
      field: 'payrollType',
      headerName: 'Payroll Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'payrollStatus',
      headerName: 'Payroll Status',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueGetter: (params) => parseDate(params.data.startDate),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueGetter: (params) => parseDate(params.data.endDate),
    },
    {
      field: 'retirementDate',
      headerName: 'Retirement Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueGetter: (params) => parseDate(params.data.retirementDate),
    },
    {
      field: 'lastPayGrossAmount',
      headerName: 'Last Pay Gross Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'lastNetAmount',
      headerName: 'Last Net Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'lastPayDate',
      headerName: 'Last Pay Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueGetter: (params) => parseDate(params.data.retirementDate),
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      pensionerNo: item.pensionerNo,
      pensionerCode: item.pensionerCode,
      payrollType: item.payrollType,
      grossAmount: item.grossAmount,
      payrollStatus: item.payrollStatus,
      startDate: item.startDate,
      endDate: item.endDate,
      retirementDate: item.retirementDate,
      lastPayGrossAmount: item.lastPayGrossAmount,
      lastNetAmount: item.lastNetAmount,
      lastPayDate: item.lastPayDate,
      payrollId: item.payrollId,
    }));
  };

  const handlers = {};

  const baseCardHandlers = {};

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Payroll - ' + clickedItem.pensionerNo
    : 'Create New Payroll Run';

  const fields = [
    {
      name: 'payrollType',
      label: 'Payroll Type',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerNo',
      label: 'Pensioner No',
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
      name: 'payrollStatus',
      label: 'Payroll Status',
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
      name: 'lastNetAmount',
      label: 'Last Net Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'lastPayDate',
      label: 'Last Pay Date',
      type: 'date',
      disabled: true,
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.updateVendorPostingGroup}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.addVendorPostingGroup}
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
        fetchApiEndpoint={payrollEndpoints.getPensionerIndex}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payroll Run"
        currentTitle="Payroll Run"
        isPayroll={true}
      />
    </div>
  );
};

export default MainPayroll;
