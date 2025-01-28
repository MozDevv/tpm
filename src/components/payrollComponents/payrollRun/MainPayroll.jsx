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
import { formatNumber } from '@/utils/numberFormatters';

const MainPayroll = () => {
  const columnDefs = [
    {
      field: 'period',
      headerName: 'Period',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
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
      field: 'totalGross',
      headerName: 'Total Gross',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalNet',
      headerName: 'Total Net',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalDeductions',
      headerName: 'Total Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalTaxDeductions',
      headerName: 'Total Tax Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalStatutoryDeductions',
      headerName: 'Total Statutory Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalIndividualDeductions',
      headerName: 'Total Individual Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalGrossArrears',
      headerName: 'Total Gross Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalNetArrears',
      headerName: 'Total Net Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'totalArrearsDeductions',
      headerName: 'Total Arrears Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      valueFormatter: (params) => formatNumber(params.value),
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
    }));
  };

  const handlers = {};

  const baseCardHandlers = {};

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Payroll - ' + clickedItem.pensionerNo
    : 'Create New Main Payroll';

  const fields = [
    {
      name: 'payrollType',
      label: 'Payroll Type',
      type: 'text',
      disabled: true,
    },

    {
      name: 'period',
      label: 'Period',
      type: 'text',
      disabled: true,
    },
    {
      name: 'totalGross',
      label: 'Total Gross',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNet',
      label: 'Total Net',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalDeductions',
      label: 'Total Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalTaxDeductions',
      label: 'Total Tax Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalStatutoryDeductions',
      label: 'Total Statutory Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalIndividualDeductions',
      label: 'Total Individual Deductions',
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
    {
      name: 'totalArrearsDeductions',
      label: 'Total Arrears Deductions',
      type: 'amount',
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
        fetchApiEndpoint={payrollEndpoints.getPayrollSummaries}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Main Payroll"
        currentTitle="Main Payroll"
        isPayroll={true}
      />
    </div>
  );
};

export default MainPayroll;
