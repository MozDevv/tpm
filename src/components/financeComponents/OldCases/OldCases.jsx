'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import financeEndpoints, { apiService } from '@/components/services/financeApi';

const columnDefs = [
  {
    field: 'pensionerNo',
    headerName: 'Pensioner No',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <div className=" text-primary underline font-semibold">
          {params.value}
        </div>
      );
    },
  },

  {
    field: 'pensionerName',
    headerName: 'Pensioner Name',
    filter: true,
    flex: 1,
  },

  {
    field: 'returnReason',
    headerName: 'Return Reason',
    filter: true,
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      return (
        <div className="text-right text-primary">
          {formatNumber(params.value)}
        </div>
      );
    },
  },
];

const OldCases = () => {
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

  const handlers = {};

  const baseCardHandlers = {
    addReturnToIGC: () => {},
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.pensionerNo
    : 'Create New Return Detail';

  const fields = [
    {
      name: 'returnType',
      label: 'Return Type',
      type: 'autocomplete',
      required: true,
      options: [
        {
          id: 0,
          name: 'None',
        },
        {
          id: 1,
          name: 'Death',
        },
        {
          id: 2,
          name: 'Dormant Account',
        },
        {
          id: 3,
          name: 'Wrong Bank Details',
        },
      ],
    },
    { name: 'pensionerName', label: 'Name', type: 'text', disabled: true },
    {
      name: 'pensionerNo',
      label: 'Pensioner No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'returnReason',
      label: 'Return Reason',
      type: 'text',
      disabled: true,
    },
    { name: 'amount', label: 'Amount', type: 'text', disabled: true },
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
            apiEndpoint={financeEndpoints.updateReturnLine}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createDepartment}
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
        fetchApiEndpoint={financeEndpoints.getReturnDetails}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Old Cases"
        currentTitle="Old Cases"
      />
    </div>
  );
};

export default OldCases;
