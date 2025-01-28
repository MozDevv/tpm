'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';

const TaxTypes = () => {
  const columnDefs = [
    {
      field: 'bracket_code',
      headerName: 'Bracket Code',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'bracket_description',
      headerName: 'Bracket Description',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'effective_start_date',
      headerName: 'Effective Start Date',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
      flex: 1,
    },
    {
      field: 'effective_end_date',
      headerName: 'Effective End Date',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
      flex: 1,
    },
    {
      field: 'max_age_taxable',
      headerName: 'Max Age Taxable',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'applied_to',
      headerName: 'Applied To',
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

  const title = clickedItem ? 'Tax Types' : 'Create New Tax Types';

  const fields = [
    {
      name: 'bracket_code',
      label: 'Bracket Code',
      type: 'text',
      required: true,
    },
    {
      name: 'bracket_description',
      label: 'Bracket Description',
      type: 'text',
      required: true,
    },
    {
      name: 'effective_start_date',
      label: 'Effective Start Date',
      type: 'date',
      required: true,
    },
    {
      name: 'effective_end_date',
      label: 'Effective End Date',
      type: 'date',
      required: true,
    },
    {
      name: 'max_age_taxable',
      label: 'Max Age Taxable',
      type: 'number',
      required: true,
    },
    { name: 'applied_to', label: 'Applied To', type: 'number', required: true },
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
        deleteApiEndpoint={financeEndpoints.deleteTaxTypes(clickedItem?.id)}
        deleteApiService={apiService.get}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateTaxTypes}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createTaxTypes}
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
        fetchApiEndpoint={financeEndpoints.getTaxTypes}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Tax Types"
        currentTitle="Tax Types"
      />
    </div>
  );
};

export default TaxTypes;
