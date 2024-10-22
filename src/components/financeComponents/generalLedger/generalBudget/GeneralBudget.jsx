'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import GLAccounts from './GLAccounts';
import * as XLSX from 'xlsx';

const columnDefs = [
  {
    field: 'no',
    headerName: 'No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
  },
  {
    field: 'budgetName',
    headerName: 'Budget Name',
    headerClass: 'prefix-header',
    filter: true,
    width: 250,
  },
  {
    field: 'budgetDescription',
    headerName: 'Budget Description',
    headerClass: 'prefix-header',
    filter: true,
    width: 250,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    headerClass: 'prefix-header',
    filter: true,
    width: 100,
    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    headerClass: 'prefix-header',
    filter: true,
    width: 100,
    valueFormatter: (params) => parseDate(params.value),
  },
];

const GeneralBudget = () => {
  const [uploadExcel, setUploadExcel] = React.useState(false);
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      budgetName: item.budgetName,
      budgetDescription: transformString(item.budgetDescription),
      startDate: item.startDate,
      endDate: item.endDate,
      isBlocked: item.isBlocked,

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
    generateBudgetUploadTemplate: () => generateBudgetUploadTemplate(),
    uploadGeneralBudget: () => setUploadExcel(true),
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

  const title = clickedItem ? clickedItem?.budgetName : 'Create a New Budget';

  const fields = [
    { name: 'budgetName', label: 'Budget Name', type: 'text', required: true },
    {
      name: 'budgetDescription',
      label: 'Budget Description',
      type: 'text',
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', required: true },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'switch',
      required: true,
    },
  ];

  const generateBudgetUploadTemplate = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.generateBudgetUploadTemplate,
        {
          'paging.pageSize': 10000,
        }
      );

      const { data } = response.data; // Extract the data array

      // Prepare the data as an array of arrays (without headers)
      const worksheetData = data.map((item) => [
        item.glAccountId, // GL Account ID
        item.accountNo, // Account No
        item.accountName, // Account Name
        item.amount, // Amount
      ]);

      // Create a worksheet and a workbook
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Use aoa_to_sheet for raw data
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget Template');

      // Create the Excel file and trigger the download
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);

      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'budget_upload_template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel template:', error);
    }
  };

  const uploadFields = [
    { name: 'budgetName', label: 'Budget Name', type: 'text', required: true },
    {
      name: 'budgetDescription',
      label: 'Budget Description',
      type: 'text',
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'EndDate', label: 'End Date', type: 'date', required: true },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'switch',
      required: true,
    },
    {
      name: 'file',
      label: 'Upload File',
      type: 'file',
      required: true,
      fileName: 'Upload Bank Statement',
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={uploadExcel}
        setOpenBaseCard={setUploadExcel}
        title={'Upload Budget'}
        clickedItem={clickedItem}
        isSecondaryCard={true}
      >
        {' '}
        <BaseInputCard
          fields={uploadFields}
          apiEndpoint={financeEndpoints.uploadBudget}
          postApiFunction={apiService.post}
          //  clickedItem={clickedItem}
          useRequestBody={false}
          setOpenBaseCard={setUploadExcel}
          isBranch={true}
          refreshData={false}
        />
      </BaseCard>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <div className="flex flex-col gap-10 overflow-auto max-h-[80vh]">
            <BaseInputCard
              fields={fields}
              apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
            <GLAccounts clickedBudget={clickedItem} uploadExcel={uploadExcel} />
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.createBudget}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <div className="">
        <BaseTable
          openBaseCard={openBaseCard}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          setOpenBaseCard={setOpenBaseCard}
          columnDefs={columnDefs}
          fetchApiEndpoint={financeEndpoints.getBudget}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="General Budget"
          currentTitle="General Budget"
        />
      </div>
    </div>
  );
};

export default GeneralBudget;
