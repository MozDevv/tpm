'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
// import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints, { apiService } from '@/components/services/financeApi';

const columnDefs = [
  /**{
  "receiptTypeName": "string",
  "receiptTypeDescription": "string",
  "typeEnum": 0
} */
  {
    field: 'receiptTypeName',
    headerName: 'Name',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
  {
    field: 'receiptTypeDescription',
    headerName: 'Description',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const ReceiptTypes = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      // roles: item.roles,
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

  const title = clickedItem ? 'Receipt Type' : 'Create New Receipt Type';

  const fields = [
    { name: 'receiptTypeName', label: 'Name', type: 'text', required: true },
    {
      name: 'receiptTypeDescription',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'typeEnum',
      label: 'Receipt Type',
      type: 'select',
      options: [
        { id: 0, name: 'Payroll Returns' },
        { id: 1, name: 'Uncollected Payments' },
        { id: 2, name: 'Secondment' },
        { id: 3, name: 'WCPS' },
        { id: 4, name: 'Deduction To Cap' },
        { id: 5, name: 'Payroll Deduction To Cap' },
        { id: 6, name: 'Abatement' },
      ],
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
        deleteApiEndpoint={financeEndpoints.deleteReceiptType(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateReceiptType}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addReceiptType}
            postApiFunction={apiService.post}
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
        fetchApiEndpoint={financeEndpoints.getReceiptType}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Receipt Types"
        currentTitle="Receipt Types"
      />
    </div>
  );
};

export default ReceiptTypes;
