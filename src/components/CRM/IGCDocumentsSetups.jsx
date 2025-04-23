'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import useFetchAsync from '../hooks/DynamicFetchHook';

const IGCDocumentsSetups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const { data: documentTypes } = useFetchAsync(
    endpoints.documentTypes,
    apiService
  );

  const igcTypes = [
    { id: 0, name: 'Dependant Pension' },
    { id: 1, name: 'Killed On Duty' },
    { id: 2, name: 'Injury or Disability Pension' },
    { id: 3, name: 'Revised Disability' },
    { id: 4, name: 'Revised Cases Court Order' },
    { id: 5, name: 'Add Beneficiary Alive' },
    { id: 6, name: 'Add Beneficiary Deceased' },
    { id: 7, name: 'Change of Pay Point' },
    { id: 8, name: 'Revised Computation' },
  ];

  const columnDefs = [
    {
      field: 'igC_Type',
      headerName: 'IGC Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return igcTypes.find((d) => d.id === params.value)?.name;
      },
    },
    {
      field: 'document_type_id',
      headerName: 'Document Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return (
          documentTypes &&
          documentTypes.find((d) => d.id === params.value)?.name
        );
      },
    },
    {
      field: 'required',
      headerName: 'Required',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'hasTwoSides',
      headerName: 'Has Two Sides',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'officer_upload',
      headerName: 'Officer Upload',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'front',
      headerName: 'Front',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'back',
      headerName: 'Back',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.document_type_id,
      ...item,

      // roles: item.roles,
    }));
  };

  const handleDeleteSchedule = async () => {
    try {
      const res = await apiService.delete(endpoints.deleteIgc, {
        id: clickedItem.document_type_id,
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
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
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'Document' : 'Create a New Document';

  const fields = [
    {
      name: 'igC_Type',
      label: 'IGC Type',
      type: 'autocomplete',
      required: true,
      options: igcTypes && igcTypes,
    },
    {
      name: 'document_type_id',
      label: 'Document Type',
      type: 'autocomplete',
      required: true,
      options: documentTypes && documentTypes,
    },
    {
      name: 'required',
      label: 'Required',
      type: 'switch',
      required: true,
    },
    {
      name: 'hasTwoSides',
      label: 'Has Two Sides',
      type: 'switch',
    },
    {
      name: 'front',
      label: 'Front',
      type: 'switch',
    },
    {
      name: 'back',
      label: 'Back',
      type: 'switch',
    },
    {
      name: 'officer_upload',
      label: 'Officer Upload',
      type: 'switch',
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
        customDeleteFunction={handleDeleteSchedule}
      >
        {clickedItem ? (
          <div>
            <BaseInputCard
              fields={fields}
              apiEndpoint={endpoints.updateIGCDoc}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
            />
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createIgcDocument}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.igcDocuments}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="IGC Document Setups"
        currentTitle="IGC Document Setups"
      />
    </div>
  );
};

export default IGCDocumentsSetups;
