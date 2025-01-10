'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { apiService as setupsApiService } from '../services/setupsApi';
import useFetchAsync from '../hooks/DynamicFetchHook';
import endpoints from '../services/setupsApi';
import BaseAutoSaveInputCard from '../baseComponents/BaseAutoSaveInputCard';
import { getValueById } from '@/utils/agGridutils';

const ContributionTypes = () => {
  //const { data, loading, error } = useFetchAsync('/api/endpoint', apiService);
  const { data: glAccounts } = useFetchAsync(
    financeEndpoints.getAccountByAccountType(0),
    apiService
  );

  const { data: bankBranches } = useFetchAsync(
    endpoints.getBanks,
    setupsApiService
  );

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);

  const columnDefs = [
    {
      field: 'contributionTypeName',
      headerName: 'Contribution Type Name',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
    },
    {
      field: 'contributionTypeDescription',
      headerName: 'Contribution Type Description',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
    },

    {
      field: 'bankAccountName',
      headerName: 'Bank Account Name',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
    },

    {
      field: 'bankAccountNo',
      headerName: 'Bank Account No',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
    },

    {
      field: 'bankBranchId',
      headerName: 'Bank Branch ',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getValueById(
          bankBranches.flatMap((bank) =>
            bank.branches.map((branch) => ({
              ...branch,
              bankId: bank.id,
            }))
          ),
          'name',
          params
        ),
    },
    {
      field: 'contributionExpenseAccount',
      headerName: 'Contribution Expense Account',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
      valueGetter: (params) => getValueById(glAccounts, 'name', params),
    },
    {
      field: 'contributionLiabilityAccount',
      headerName: 'Contribution Liability Account',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
      valueGetter: (params) => getValueById(glAccounts, 'name', params),
    },

    /**{
    "contributionTypeName": "string",
    "contributionTypeDescription": "string",
    "contributionExpenseAccount": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "contributionLiabilityAccount": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "bankAccountName": "string",
    "bankAccountNo": "string",
    "bankBranchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  } */
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      code: index + 1,
      id: item.id,

      contributionTypeName: item.contributionTypeName,
      contributionTypeDescription: item.contributionTypeDescription,
      ...item,
    }));
  };

  const handlers = {
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

  const title = clickedItem
    ? clickedItem?.contributionTypeName
    : 'Create New Contribution Type';

  const fields = [
    {
      name: 'contributionTypeName',
      label: 'Contribution Type Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contributionTypeDescription',
      label: 'Contribution Type Description',
      type: 'text',
      required: true,
    },
    {
      name: 'contributionExpenseAccount',
      label: 'Contribution Expense Account',
      type: 'select',
      required: true,
      table: true,

      options:
        Array.isArray(glAccounts) &&
        glAccounts?.map((account) => ({
          id: account.id,
          name: account.name,
          accountNo: account.accountNo,
        })),
    },
    {
      name: 'contributionLiabilityAccount',
      label: 'Contribution Liability Account',
      type: 'select',
      table: true,
      required: true,
      options:
        Array.isArray(glAccounts) &&
        glAccounts?.map((account) => ({
          id: account.id,
          name: account.name,
          accountNo: account.accountNo,
        })),
    },

    {
      name: 'bank_id',
      label: 'Bank',
      type: 'autocomplete',
      options:
        Array.isArray(bankBranches) &&
        bankBranches.map((bank) => ({
          id: bank.id,
          name: bank.name,
          branches: bank.branches,
        })),
    },
    {
      name: 'bankBranchId',
      label: 'Bank Branch',
      type: 'autocomplete',
      required: true,
      options:
        selectedBank && selectedBank.length > 0
          ? selectedBank
          : bankBranches &&
            bankBranches.flatMap((bank) =>
              bank.branches.map((branch) => ({
                ...branch,
                bankId: bank.id,
              }))
            ),
    },
    {
      name: 'bankAccountName',
      label: 'Bank Account Name',
      type: 'text',
      required: true,
    },
    {
      name: 'bankAccountNo',
      label: 'Bank Account No',
      type: 'text',
      required: true,
    },
  ];

  return (
    <div className="">
      {/* BaseCard component */}
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteContributionType(
          clickedItem?.id
        )}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseAutoSaveInputCard
            fields={fields.filter((field) => field.name !== 'bank_id')}
            apiEndpoint={financeEndpoints.createContributionType}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateContributionType}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getContributionType}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
            banks={bankBranches.flatMap((bank) =>
              bank.branches.map((branch) => ({
                ...branch,
                bankId: bank.id,
              }))
            )}
            setSelectedBank={setSelectedBank}
          />
        ) : (
          <BaseAutoSaveInputCard
            fields={[...fields]}
            apiEndpoint={financeEndpoints.createContributionType}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateContributionType}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getContributionType}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
            banks={
              Array.isArray(bankBranches) &&
              bankBranches.flatMap((bank) =>
                bank.branches.map((branch) => ({
                  ...branch,
                  bankId: bank.id,
                }))
              )
            }
            setSelectedBank={setSelectedBank}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getContributionType}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Contribution Types Setup"
        currentTitle="Contribution Types Setup"
      />
    </div>
  );
};

export default ContributionTypes;
