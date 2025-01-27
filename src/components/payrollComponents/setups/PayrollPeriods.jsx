'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate } from '@/utils/dateFormatter';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';

const columnDefs = [
  {
    field: 'no',
    headerName: 'No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
  },
  {
    field: 'period',
    headerName: 'Period',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
  {
    field: 'effectiveStartDate',
    headerName: 'Effective Start Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'effectiveEndDate',
    headerName: 'Effective End Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    field: 'isClosed',
    headerName: 'Is Closed',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const PayrollPeriods = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      period: item.period,
      effectiveStartDate: item.effectiveStartDate,
      effectiveEndDate: item.effectiveEndDate,
      isClosed: item.isClosed,
    }));
  };

  const handlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: (item) => {},
    delete: (item) => {},
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? `${clickedItem?.period} Payroll Period`
    : 'Create New Payroll Period';

  const fields = [
    { name: 'period', label: 'Period', type: 'text', required: true },
    {
      name: 'effectiveStartDate',
      label: 'Effective Start Date',
      type: 'date',
      required: true,
    },
    {
      name: 'effectiveEndDate',
      label: 'Effective End Date',
      type: 'date',
      required: true,
    },
    { name: 'isClosed', label: 'Is Closed', type: 'switch', required: true },
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
        // deleteApiEndpoint={payrollEndpoints.deleteDepartment(clickedItem?.id)}
        // deleteApiService={payrollApiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.updatePayrollPeriod}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.createPayrollPeriod}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        isPayroll={true}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getPayrollPeriods}
        fetchApiService={payrollApiService.get}
        a
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payroll Periods"
        currentTitle="Payroll Periods"
      />
    </div>
  );
};

export default PayrollPeriods;
