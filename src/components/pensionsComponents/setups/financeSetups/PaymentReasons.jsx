'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const PaymentReasons = () => {
  const columnDefs = [
    {
      field: 'payementReturnReasonEnum',
      headerName: 'Payment Return Reason',
      headerClass: 'prefix-header',
      width: 200,
      filter: true,
      valueFormatter: (params) => {
        const value = params.value;
        if (value === 0) return 'None';
        if (value === 1) return 'Wrong Bank Details';
        if (value === 2) return 'Death';
        if (value === 3) return 'Dormant Account';
        return value; // Default case, in case of unexpected values
      },
    },
    {
      field: 'description',
      headerName: 'Description',
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

  const title = clickedItem ? 'Department' : 'Create New Department';

  const fields = [
    // { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      /**  {
        None,
        Wrong_Bank_Details,
        Death,
        Dormant_Account,
 
    } */
      name: 'payementReturnReasonEnum',
      label: 'Payment Return Reason',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'None' },
        { id: 1, name: 'Wrong Bank Details' },
        { id: 2, name: 'Death' },
        { id: 3, name: 'Dormant Account' },
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
        deleteApiEndpoint={endpoints.deletePaymentReasons(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updatePaymentReasons}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.addPaymentReasons}
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
        fetchApiEndpoint={endpoints.getPaymentReasons}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payment Reasons Setups"
        currentTitle="Payment Reasons Setups"
      />
    </div>
  );
};

export default PaymentReasons;
