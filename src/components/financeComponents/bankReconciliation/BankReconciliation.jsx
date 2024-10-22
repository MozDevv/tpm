'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { apiService as setupsApiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatNumber } from '@/utils/numberFormatters';
import BankReconciliationCard from './BankReconciliationCard';
import { Dialog, Divider } from '@mui/material';
import BaseUploadDialog from '@/components/baseComponents/BaseUploadDialog';

const columnDefs = [
  {
    field: 'bankAccountNo',
    headerName: 'Bank Account No',
    headerClass: 'prefix-header',
    filter: true,
    pinned: 'left', // Pinning to the left ensures it's the first column
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    cellRenderer: (params) => {
      return <p className=" text-primary font-semibold">{params.value}</p>;
    },
  },
  {
    field: 'bankAccountName',
    headerName: 'Bank Account Name',
    headerClass: 'prefix-header',

    filter: true,
  },
  {
    field: 'bankAccountDescription',
    headerName: 'Bank Account Description',
    headerClass: 'prefix-header',
    filter: true,
  },

  {
    field: 'amount',
    headerName: 'Amount',
    width: 150,
    valueFormatter: (params) => {
      return formatNumber(params.value);
    },
    cellStyle: { textAlign: 'right' },
  },
  {
    field: 'isBlocked',
    headerName: 'Is Blocked',
    headerClass: 'prefix-header',
    filter: true,
    width: 100,
  },
];

const BankReconciliation = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);
  const [uploadExcel, setUploadExcel] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [matchManually, setMatchManually] = useState(false);

  const handleOpenUploadDialog = () => {
    setUploadExcel(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadExcel(false);
    setSelectedFile(null); // Reset the selected file on close
  };

  const transformData = (data) => {
    return data.map((item, index) => {
      const branch = branches.find((branch) => branch.id === item.bankBranchId);
      return {
        no: index + 1,
        id: item.id,
        bankAccountName: item.bankAccountName,
        bankAccountDescription: item.bankAccountDescription,
        bankAccountNo: item.bankAccountNo,
        isBlocked: item.isBlocked,
        bankBranchId: item.bankBranchId,
        branchName: branch ? branch.name : '',
        bank_id: branch ? branch.bankId : '',
        bankPostingGroupId: item.bankPostingGroupId,
        amount: item.amount === null ? 0 : item.amount,

        // roles: item.roles,
      };
    });
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
    importBankStatement: () => handleOpenUploadDialog(),
    matchManually: () => setMatchManually(true),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const title = clickedItem
    ? `${clickedItem?.bankAccountName}`
    : 'Create New Bank Account';

  const [vendorPG, setVendorPG] = React.useState([]);

  const fetchPostingGroups = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getBankPostingGroups, {
        'paging.pageSize': 1000,
      });
      setVendorPG(
        res.data.data.map((item) => {
          return {
            id: item.id,
            name: item.groupName,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostingGroups();
  }, []);

  const fields = [
    {
      name: 'bankAccountNo',
      label: 'Bank Account No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'bankAccountName',
      label: 'Bank Account Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'bankAccountDescription',
      label: 'Bank Account Description',
      type: 'text',
      disabled: true,
    },

    {
      name: 'bankPostingGroupId',
      label: 'Bank Posting Group',
      type: 'select',
      disabled: true,
      options: vendorPG,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'bank_id',
      label: 'Bank',
      type: 'select',
      options: banks,
      disabled: true,
    },

    {
      name: 'bankBranchId',
      label: 'Bank Branch Name',
      options:
        selectedBank && selectedBank.length > 0 ? selectedBank : branches,
      type: 'select',
      disabled: true,
    },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'switch',
      required: true,
      disabled: true,
    },
  ];

  const handleUploadFile = () => {
    console.log('Uploading file:', selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('bankAccountId', clickedItem.id);

    handleCloseUploadDialog();
  };

  const uploadFields = [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'statementDate',
      label: 'Bank Statement Date',
      type: 'date',
      required: true,
    },
    {
      name: 'closingBalance',
      label: 'Closing Balance',
      type: 'amount',
      required: true,
    },
    {
      name: 'file',
      label: 'Upload Bank Statement',
      type: 'file',
      required: true,
      fileName: 'Upload Bank Statement',
    },
  ];

  return (
    <div className="">
      {/* <BaseUploadDialog
        open={uploadExcel}
        onClose={handleCloseUploadDialog}
        title="Upload Bank Statement"
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleUploadFile={handleUploadFile}
        clickedItem={clickedItem}
      /> */}

      <BaseCard
        openBaseCard={uploadExcel}
        setOpenBaseCard={setUploadExcel}
        title={'Upload Bank Statement'}
        clickedItem={clickedItem}
        isSecondaryCard={true}
      >
        {' '}
        <BaseInputCard
          fields={uploadFields}
          apiEndpoint={financeEndpoints.uploadBankStatement}
          postApiFunction={apiService.post}
          clickedItem={clickedItem}
          useRequestBody={false}
          setOpenBaseCard={setUploadExcel}
          id={clickedItem?.id}
          idLabel={'bankAccountId'}
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
        deleteApiEndpoint={financeEndpoints.deleteBankAccount(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <div className="flex flex-col gap-5">
            <BaseAutoSaveInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.addBankAccount}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateBankAccount}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.getBankAccounts}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
              banks={branches}
              setSelectedBank={setSelectedBank}
            />

            <BankReconciliationCard
              clickedItem={clickedItem}
              uploadExcel={uploadExcel}
            />
          </div>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addBankAccount}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateBankAccount}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getBankAccounts}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getBankAccounts}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Bank Reconciliation"
        currentTitle="Bank Reconciliation"
      />
    </div>
  );
};

export default BankReconciliation;
