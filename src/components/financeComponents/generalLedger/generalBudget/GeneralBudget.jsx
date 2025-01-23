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
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { message } from 'antd';
import {
  AccessTime,
  Cancel,
  Check,
  DoneAll,
  Verified,
  Visibility,
} from '@mui/icons-material';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';

const statusIcons = {
  0: { icon: Visibility, name: 'New', color: '#1976d2' }, // Blue
  1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
  2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
  3: { icon: DoneAll, name: 'Closed', color: '#2e7d32' }, // Green
  4: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
};

const columnDefs = [
  {
    field: 'documentNo',
    headerName: 'Document No',
    headerClass: 'prefix-header',
    width: 90,
    filter: true,
    width: 150,
    pinned: 'left',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    multiple: false,
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    field: 'budgetName',
    headerName: 'Budget Name',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },

  {
    field: 'stage',
    headerName: 'Status',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
    cellRenderer: (params) => {
      const status = statusIcons[params.value];
      if (!status) return null;

      const IconComponent = status.icon;

      return (
        <div
          style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}
        >
          <IconComponent
            style={{
              color: status.color,
              marginRight: '6px',
              fontSize: '17px',
            }}
          />
          <span
            style={{
              color: status.color,
              fontWeight: 'semibold',
              fontSize: '13px',
            }}
          >
            {status.name}
          </span>
        </div>
      );
    },
  },
  {
    field: 'budgetDescription',
    headerName: 'Budget Description',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,

    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,

    valueFormatter: (params) => parseDate(params.value),
  },
  {
    field: 'isBlocked',
    headerName: 'Is Blocked',
    headerClass: 'prefix-header',
    filter: true,
    flex: 1,
  },
];

const GeneralBudget = ({ status }) => {
  const [uploadExcel, setUploadExcel] = React.useState(false);
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      budgetName: item.budgetName,
      budgetDescription: transformString(item.budgetDescription),
      startDate: item.startDate,
      endDate: item.endDate,
      isBlocked: item.isBlocked,
      documentNo: item.documentNo,
      stage: item.stage,

      // roles: item.roles,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
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
          submitBudgetForApproval: () => {
            if (clickedItem) {
              submitBudgetForApproval();
            } else {
              message.error('Please select a budget to submit for approval');
            }
          },
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };
  const baseCardHandlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    ...(status === 0
      ? {
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
          submitBudgetForApproval: () => {
            if (clickedItem) {
              submitBudgetForApproval();
            } else {
              message.error('Please select a budget to submit for approval');
            }
          },
        }
      : status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const submitBudgetForApproval = async () => {
    try {
      const response = await apiService.post(
        financeEndpoints.submitBudgetForApproval(clickedItem.id)
      );
      if (response.status === 200 && response.data.succeeded) {
        message.success('Budget submitted for approval successfully');
        if (openBaseCard) {
          setOpenBaseCard(false);
        }
      }
    } catch (error) {
      console.error('Error submitting budget for approval:', error);
    }
  };

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

      // Prepare the data as an array of arrays (with headers included)
      const worksheetData = [
        ['GL Account ID', 'Account No', 'Account Name', 'Amount'], // Headers
        ...data.map((item) => [
          item.glAccountId, // GL Account ID
          item.accountNo, // Account No
          item.accountName, // Account Name
          item.amount, // Amount
        ]),
      ];

      // Create a worksheet and a workbook
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Format columns for protection (disable editing for GL Account ID and Account No)
      const protection = {
        hidden: false, // Show formulas if any
        locked: true, // Lock this cell (non-editable)
      };

      // Mark the first and second columns (GL Account ID, Account No) as locked
      worksheet['!cols'] = [
        { hidden: false, width: 20, locked: true }, // GL Account ID column (locked)
        { hidden: false, width: 20, locked: true }, // Account No column (locked)
        { hidden: false, width: 30, locked: false }, // Account Name column (editable)
        { hidden: false, width: 15, locked: false }, // Amount column (editable)
      ];

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
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
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
          <div className="flex flex-col  overflow-auto max-h-[80vh]">
            <BaseInputCard
              fields={fields}
              apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
            <div className="mt-[-20px]">
              <BaseCollapse name="GL Accounts">
                <GLAccounts
                  clickedBudget={clickedItem}
                  uploadExcel={uploadExcel}
                />
              </BaseCollapse>
            </div>
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
          fetchApiEndpoint={financeEndpoints.getBudgetByStatus(status)}
          fetchApiService={apiService.get}
          transformData={transformData}
          uploadExcel={uploadExcel}
          pageSize={30}
          handlers={handlers}
          breadcrumbTitle="General Budget"
          currentTitle="General Budget"
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          openApproveDialog={openApprove}
        />
      </div>
    </div>
  );
};

export default GeneralBudget;
