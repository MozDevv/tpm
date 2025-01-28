'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';

const PayrollTypes = () => {
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
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
      no: index + 1,
      ...item,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
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
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'Payroll Types"' : 'Create New Payroll Types"';

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      label: 'Type',
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
      required: true,
    },
    {
      name: 'isTaxable',
      label: 'Is Taxable',
      type: 'switch',
      required: true,
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
        // // deleteApiEndpoint={payrollEndpoints.deletePayrollTypes(clickedItem?.id)}
        // deleteApiService={payrollApiService.get}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.updatePayrollTypes}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
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
        handlers={handlers}
        breadcrumbTitle="Payroll Types"
        currentTitle="Payroll Types"
      />
    </div>
  );
};

export default PayrollTypes;
