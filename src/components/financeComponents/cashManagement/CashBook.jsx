'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { apiService as setupsApiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatNumber } from '@/utils/numberFormatters';
import BaseDrilldown from '@/components/baseComponents/BaseDrilldown';
import {
  getColumnDefsByType,
  transformDataByType,
} from '../baseSubledgerData/BaseSubledgerData';

const CashBook = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState(null);

  const transformData = (data) => {
    let cumulativeBalance = 0;

    return data.map((item, index) => {
      cumulativeBalance += item.amount;

      return {
        no: index + 1,
        transactionDate: item.transactionDate,
        documentNo: item.documentNo,
        narration: item.narration,
        balance: formatNumber(Math.abs(item.balance)),
        credit: item.amount < 0 ? formatNumber(Math.abs(item.amount)) : '',
        debit: item.amount > 0 ? formatNumber(Math.abs(item.amount)) : '',
        totalBalance: formatNumber(Math.abs(cumulativeBalance)),
      };
    });
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
      name: 'transactionDate',
      label: 'Transaction Date',
      type: 'date',
      disable: true,
    },
    {
      name: 'documentNo',
      label: 'Document No',
      type: 'text',
      disable: true,
    },
    {
      name: 'narration',
      label: 'Narration',
      type: 'text',
      disable: true,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'amount',
      disable: true,
    },
    {
      name: 'totalBalance',
      label: 'Balance',
      type: 'amount',
      disable: true,
    },
  ];

  const [openDrilldown, setOpenDrilldown] = React.useState(false);

  const columnDefs = [
    {
      field: 'transactionDate',
      headerName: 'Transaction Date',
      headerClass: 'prefix-header',
      pinned: 'left',
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">
            {parseDate(params.value)}
          </p>
        );
      },
    },
    {
      field: 'narration',
      headerName: 'Narration',
      headerClass: 'prefix-header',
      width: 300,
      filter: true,
    },
    {
      field: 'documentNo',
      headerName: 'Document No',
      headerClass: 'prefix-header',

      filter: true,
    },

    {
      field: 'debit',
      headerName: 'Debit (Inflow)',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold text-right ">
            {params.value || '-'}
          </p>
        );
      },
    },

    {
      field: 'credit',
      headerName: 'Credit (Outflow)',
      flex: 1,
      headerClass: 'prefix-header',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold text-right">
            {params.value || '-'}
          </p>
        );
      },
    },
    {
      field: 'totalBalance',
      flex: 1,
      headerName: 'Total Balance',
      headerClass: 'prefix-header',
      cellRenderer: (params) => {
        return (
          <p className="text-green-600 font-semibold text-right">
            {params.value}
          </p>
        );
      },
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
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
            fields={fields.filter((field) => field.name !== 'amount')}
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
            banks={branches}
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
        fetchApiEndpoint={financeEndpoints.getCashBook}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        breadcrumbTitle="Cash Book"
        handlers={{}}
        currentTitle="Cash Book"
        deleteApiEndpoint={financeEndpoints.deleteBankAccount(clickedItem?.id)}
        deleteApiService={apiService.delete}
        excelTitle={[
          'PENSIONS DEPARTMENT - FINANCE',
          'Cash Book Statement  ' + ' ' + parseDate(new Date()),
        ]}
      />
    </div>
  );
};

export default CashBook;
