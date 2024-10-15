'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';

const Approvers = () => {
  const [noSeries, setNoSeries] = useState([]);

  useEffect(() => {
    const fetchNoSeries = async () => {
      try {
        const res = await apiService.get(endpoints.getNumberSeries, {
          'paging.pageSize': 1000,
        });
        const data = res.data.data.map((item) => ({
          id: item.id,
          name: item.code,
        }));
        setNoSeries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchNoSeries();
  }, []);

  const columnDefs = [
    {
      field: 'approval_type_name',
      headerName: 'Approval Type Name',
      headerClass: 'prefix-header',
      filter: true,
    },

    {
      field: 'approval_type_description',
      headerName: 'Approval Type Description',
      headerClass: 'prefix-header',
      filter: true,
    },

    {
      field: 'document_status',
      headerName: 'Document Status',
      headerClass: 'prefix-header',
      filter: true,
    },

    {
      field: 'number_series_id',
      headerName: 'Number Series ID',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => {
        const numberSeries = noSeries.find((item) => item.id === params.value);
        return numberSeries ? numberSeries.name : 'N/A';
      },
    },

    {
      field: 'approver_type',
      headerName: 'Approver Type',
      headerClass: 'prefix-header',
      filter: true,
      valueGetter: (params) => {
        return params.value === 0 ? 'WorkFlow' : 'Direct';
      },
    },
    {
      field: 'requires_approval',
      headerName: 'Requires Approval',
      headerClass: 'prefix-header',
      filter: true,
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      approval_type_name: item.approval_type_name,
      approval_type_description: item.approval_type_description,
      document_status: item.document_status,
      number_series_id: item.number_series_id,
      approver_type: item.approver_type,
      requires_approval: item.requires_approval,

      // roles: item.roles,
    }));
  };

  const handlers = {
    filter: () => console.log('Filter clicked'),
    openInExcel: () => console.log('Export to Excel clicked'),
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

  const title = clickedItem ? 'Approval Type' : 'Create a New Approval Type';

  const fields = [
    {
      name: 'approval_type_name',
      label: 'Approval Type Name',
      type: 'text',
      required: true,
    },
    {
      name: 'approval_type_description',
      label: 'Approval Type Description',
      type: 'text',
      required: true,
    },
    {
      name: 'document_status',
      label: 'Document Status',
      type: 'text',
      required: true,
      valueFormatter: (params) => {
        return params.value === 0 && '0';
      },
    },
    {
      name: 'number_series_id',
      label: 'Number Series',
      type: 'autocomplete',
      required: true,
      options: noSeries,
    },
    {
      name: 'approver_type',
      label: 'Approver Type',
      type: 'select',
      options: [
        {
          id: 0,
          name: 'WorkFlow',
        },
        {
          id: 1,
          name: 'Direct',
        },
      ],
      required: true,
    },
    {
      name: 'requires_approval',
      label: 'Requires Approval',
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
        deleteApiEndpoint={endpoints.deleteApprovalType(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateApprovalType}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createApprovalType}
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
        fetchApiEndpoint={endpoints.getApprovalTypes}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Approval Types"
        currentTitle="Approval Types"
      />
    </div>
  );
};

export default Approvers;
