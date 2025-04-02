'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import { Button } from '@mui/material';

const ServiceCategories = () => {
  const { data } = useFetchAsync(endpoints.getNumberSeries, apiService);
  const priorityMap = {
    0: { name: 'Low', color: '#1976d2' }, // Blue
    1: { name: 'Normal', color: '#fbc02d' }, // Yellow
    2: { name: 'High', color: '#2e7d32' }, // Green
    3: { name: 'Urgent', color: '#d32f2f' }, // Red
  };
  const columnDefs = [
    /**const columnDefs = [
 {
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "description": "string",
  "numberSeriesId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "priority": 0
}

]; */
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      width: 90,
      filter: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'numberSeriesId',
      headerName: 'Number Series Id',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const numberSeries = data?.find((item) => item.id === params.value);
        if (!numberSeries) return null;

        return <span style={{}}>{numberSeries.code}</span>;
      },
    },

    {
      field: 'priority',
      headerName: 'Priority',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const status = priorityMap[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 3,
              maxHeight: '22px',
              cursor: 'pointer',
              color: status.color,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {status.name.toLowerCase()}
          </Button>
        );
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
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'numberSeriesId',
      label: 'Number Series Id',
      type: 'autocomplete',
      required: true,
      options:
        data &&
        data?.map((item) => ({
          id: item.id,
          name: item.code,
        })),
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        {
          id: 0,
          name: 'Low',
        },
        {
          id: 1,
          name: 'Normal',
        },
        {
          id: 2,
          name: 'High',
        },
        {
          id: 3,
          name: 'Urgent',
        },
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
        deleteApiEndpoint={endpoints.deleteServiceCategory(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createServiceCategory}
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
        fetchApiEndpoint={endpoints.getServiceCategories}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Service Categories"
        currentTitle="Service Categories"
      />
    </div>
  );
};

export default ServiceCategories;
