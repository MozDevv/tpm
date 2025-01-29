'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';

const PayrollSuspensionReasons = () => {
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
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
      no: index + 1,
      id: item.reasonId,
      reason: item.name,
      name: item.name,
      description: item.description,
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

  const title = clickedItem
    ? clickedItem?.name
    : 'Create New Suspension Reason';

  const fields = [
    {
      name: 'reason',
      label: 'Reason',
      type: 'select',
      required: true,
      options: [
        { id: 1, name: 'SUSPENSION' },
        { id: 2, name: 'REACTIVATION' },
      ],
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
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
        deleteApiEndpoint={payrollEndpoints.deleteSuspensionReasons(
          clickedItem?.id
        )}
        deleteApiService={payrollApiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.updateSuspensionReasons(
              clickedItem?.id
            )}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.createSuspensionReasonsL}
            postApiFunction={payrollApiService.put}
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
        fetchApiEndpoint={payrollEndpoints.getSuspensionReasons}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Suspension Reasons"
        currentTitle="Suspension Reasons"
        isPayroll={true}
      />
    </div>
  );
};

export default PayrollSuspensionReasons;
