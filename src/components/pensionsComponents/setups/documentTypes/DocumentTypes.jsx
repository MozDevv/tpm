'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import MapFields from './MapFields copy';

const columnDefs = [
  {
    field: 'no',
    headerName: 'No',
    headerClass: 'prefix-header',
    filter: true,
    width: 90,
  },

  {
    field: 'name',
    headerName: 'Name',
    headerClass: 'prefix-header',
    filter: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    headerClass: 'prefix-header',
    filter: true,
  },
  {
    field: 'extenstions',
    headerName: 'Extensions',
    headerClass: 'prefix-header',
    filter: true,
  },
  {
    field: 'has_two_sides',
    headerName: 'Has Two Sides',
    headerClass: 'prefix-header',
    filter: true,
  },
  {
    field: 'max_file_size_in_mb',
    headerName: 'Max File Size (MB)',
    headerClass: 'prefix-header',
    filter: true,
  },
];

const DocumentTypes = () => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      no: index + 1 + (pageNumber - 1) * pageSize,
      name: item.name,
      description: item.description,
      extenstions: item.extenstions,
      has_two_sides: item.has_two_sides,
      max_file_size_in_mb: item.max_file_size_in_mb,
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

  const title = clickedItem ? clickedItem?.name : 'Create a New Document';
  const documentExtensions = [
    { value: '.pdf', label: 'PDF' },
    { value: '.doc', label: 'DOC' },
    { value: '.docx', label: 'DOCX' },
    { value: '.xls', label: 'XLS' },
    { value: '.xlsx', label: 'XLSX' },
    { value: '.ppt', label: 'PPT' },
    { value: '.pptx', label: 'PPTX' },
  ];
  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'extenstions',
      label: 'Extension',
      type: 'select',
      multiple: false,
      required: true,
      options: documentExtensions.map((d) => ({
        id: d.value,
        name: d.label,
      })),
    },
    {
      name: 'has_two_sides',
      label: 'Has Two Sides',
      type: 'switch',
      required: true,
    },
    {
      name: 'max_file_size_in_mb',
      label: 'Max File Size (MB)',
      type: 'number',
      required: true,
    },
  ];

  const tabPanes = [
    {
      key: '1',
      title: 'Document Information',
      content: (
        <div>
          <BaseInputCard
            fields={fields}
            //apiEndpoint={endpoints.updateRole(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        </div>
      ),
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
        deleteApiEndpoint={endpoints.deleteRole(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseTabs tabPanes={tabPanes} />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createDocumentType}
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
        fetchApiEndpoint={endpoints.documentTypes}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Document Types"
        currentTitle="Document Types"
      />
    </div>
  );
};

export default DocumentTypes;
