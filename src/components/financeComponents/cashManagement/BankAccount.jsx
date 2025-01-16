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
import BaseDrilldown from '@/components/baseComponents/BaseDrilldown';
import {
  getColumnDefsByType,
  transformDataByType,
} from '../baseSubledgerData/BaseSubledgerData';

const BankAccount = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);

  const transformData = (data) => {
    return data.map((item, index) => {
      const branch = branches.find((branch) => branch.id === item.bankBranchId);
      return {
        no: index + 1,
        id: item.id,
        bankAccountName: item.bankAccountName,
        bankAccountDescription: item.bankAccountDescription,
        bankAccountNo: item.bankAccountNo,
        bankAccountCode: item.bankAccountCode,
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
      name: 'bankAccountName',
      label: 'Bank Account Name',
      type: 'text',
      required: true,
    },
    {
      name: 'bankAccountDescription',
      label: 'Bank Account Description',
      type: 'text',
      required: true,
    },
    {
      name: 'bankAccountNo',
      label: 'Bank Account No',
      type: 'text',
      required: true,
    },

    {
      name: 'bankPostingGroupId',
      label: 'Bank Posting Group',
      type: 'select',
      required: true,
      options: vendorPG,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'drillDown',
      required: false,
      disabled: true,
    },
    {
      name: 'bank_id',
      label: 'Bank',
      type: 'autocomplete',
      options: banks,
    },

    {
      name: 'bankBranchId',
      label: 'Bank Branch Name',
      options:
        selectedBank && selectedBank.length > 0 ? selectedBank : branches,
      type: 'autocomplete',
    },
    { name: 'isBlocked', label: 'Is Blocked', type: 'switch', required: true },
  ];

  const [openDrilldown, setOpenDrilldown] = React.useState(false);

  const columnDefs = [
    {
      field: 'bankAccountCode',
      headerName: 'Bank Account Code',
      headerClass: 'prefix-header',
      pinned: 'left',
      filter: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'bankAccountNo',
      headerName: 'Bank Account No',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'bankAccountName',
      headerName: 'Bank Account Name',
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
      cellRenderer: (params) => {
        return (
          <p
            className="cursor-pointer underline text-primary font-bold text-[14px]"
            onClick={() => {
              setOpenDrilldown(true);
              setClickedItem(params.data);
            }}
          >
            {formatNumber(params.value)}
          </p>
        );
      },
    },

    {
      field: 'bankAccountDescription',
      headerName: 'Bank Account Description',
      headerClass: 'prefix-header',
      filter: true,
    },

    {
      field: 'isBlocked',
      headerName: 'Is Blocked',
      headerClass: 'prefix-header',
      filter: true,
      width: 100,
    },
  ];

  return (
    <div className="">
      {' '}
      <BaseDrilldown
        setOpenDrilldown={setOpenDrilldown}
        openDrilldown={openDrilldown}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        columnDefs={getColumnDefsByType('Bank Account Ledger Entries')}
        fetchApiEndpoint={financeEndpoints.bankDrillDown(
          clickedItem?.bankAccountCode
        )}
        fetchApiService={apiService.get}
        title={clickedItem?.bankAccountName}
      />
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
        {' '}
        {clickedItem ? (
          <>
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
              setOpenDrilldown={setOpenDrilldown}
              setSelectedBank={setSelectedBank}
            />
          </>
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
        breadcrumbTitle="Bank Account"
        currentTitle="Bank Account"
      />
    </div>
  );
};

export default BankAccount;
