'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

const TaxBands = () => {
  const { data } = useFetchAsync(financeEndpoints.getTaxTypes, apiService);
  const columnDefs = [
    {
      field: 'band',
      headerName: 'Band',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'lowerLimit',
      headerName: 'Lower Limit',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'upperLimit',
      headerName: 'Upper Limit',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'rate',
      headerName: 'Rate',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'taxtype_id',
      headerName: 'Tax Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        const taxType = data && data.find((item) => item.id === params.value);
        return taxType ? taxType.bracket_code : '';
      },
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

  const title = clickedItem ? 'Tax Bands' : 'Create New Tax Bands';

  const fields = [
    { name: 'band', label: 'Band', type: 'number', required: true },
    {
      name: 'lowerLimit',
      label: 'Lower Limit',
      type: 'number',
      required: true,
    },
    {
      name: 'upperLimit',
      label: 'Upper Limit',
      type: 'number',
      required: true,
    },
    { name: 'rate', label: 'Rate', type: 'number', required: true },
    {
      name: 'taxtype_id',
      label: 'Tax Type',
      type: 'select',
      required: true,

      options:
        data &&
        data.map((item) => ({
          id: item.id,
          name: item.bracket_code,
        })),
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
        deleteApiEndpoint={financeEndpoints.deleteTaxBands(clickedItem?.id)}
        deleteApiService={apiService.get}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateTaxBands}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createTaxBands}
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
        fetchApiEndpoint={financeEndpoints.getTaxBands}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Tax Bands"
        currentTitle="Tax Bands"
      />
    </div>
  );
};

export default TaxBands;
