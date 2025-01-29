'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate, parseDate } from '@/utils/dateFormatter';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';

const columnDefs = [
  {
    field: 'no',
    headerName: 'No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
  },
  {
    field: 'financialYear',
    headerName: 'Financial Year',
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
    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'effectiveEndDate',
    headerName: 'Effective End Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'isClosed',
    headerName: 'Is Closed',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const IncreamentMaster = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
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

  const { data } = useFetchAsyncV2(
    payrollEndpoints.getPayrollTypes,
    payrollApiService
  );

  const fields = [
    {
      name: 'payrollTypeId',
      label: 'Payroll Type',
      type: 'select',
      required: true,
      options:
        data &&
        data?.map((item) => ({
          id: item.id,
          name: item.name,
        })),
    },
    {
      name: 'financialYear',
      label: 'Financial Year',
      type: 'text',
      required: true,
    },

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

  const tableFields = [
    {
      value: 'isPercentage',
      label: 'Is Percentage',
      type: 'select',
      required: true,
      options: [
        { id: true, name: 'Yes' },
        { id: false, name: 'No' },
      ],
    },
    {
      value: 'incrementPercentage',
      label: 'Increment Percentage',
      type: 'number',
      required: true,
    },
    {
      value: 'incrementAmount',
      label: 'Increment Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'minimumPensionAmount',
      label: 'Minimum Pension Amount',
      type: 'number',
      required: true,
    },
    {
      value: 'maximumPensionAmount',
      label: 'Maximum Pension Amount',
      type: 'number',
      required: true,
    },
  ];

  const [tableInputData, setTableInputData] = React.useState([]);

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
          <div className="flex flex-col gap-4">
            <BaseInputCard
              fields={fields}
              apiEndpoint={payrollEndpoints.createIncreamentMaster}
              postApiFunction={payrollApiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              tableInputData={tableInputData}
              tableInputObjectKey="ranges"
              setOpenBaseCard={setOpenBaseCard}
            />
            <BaseInputTable
              title="Increament Range"
              fields={tableFields}
              getApiService={apiService.get}
              postApiService={apiService.post}
              putApiService={apiService.put}
              getEndpoint={endpoints.getDeductions('id')}
              postEndpoint={endpoints.createDeductions}
              putEndpoint={endpoints.updateGovernmentSalary}
              passProspectivePensionerId={true}
              isAddMoreFields={true}
              setTableInputData={setTableInputData}
            />
          </div>
        )}
      </BaseCard>
      <BaseTable
        isPayroll={true}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getIncreamentMasters}
        fetchApiService={payrollApiService.get}
        a
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Increment Master Setup"
        currentTitle="Increment Master Setup"
      />
    </div>
  );
};

export default IncreamentMaster;
