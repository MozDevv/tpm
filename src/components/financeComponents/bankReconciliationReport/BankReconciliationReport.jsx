'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';
import { apiService as setupsApiService } from '@/components/services/setupsApi';
import { parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import { formatNumber } from '@/utils/numberFormatters';

import BankReconciliationReportCard from './BankReconciliationReportCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';

const columnDefs = [
  {
    field: 'description',
    headerName: 'Description',
    headerClass: 'prefix-header',
    pinned: 'left',
    flex: 1,
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
  },

  {
    field: 'statementStartDate',

    headerName: 'Statement Start Date',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{parseDate(params.value)}</p>;
    },
  },

  {
    field: 'statementEndDate',

    headerName: 'Statement End Date',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{parseDate(params.value)}</p>;
    },
  },
  {
    field: 'lastStatementBalance',
    headerName: 'Last Statement Balance',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{formatNumber(params.value)}</p>;
    },
  },
  {
    field: 'currentStatementBalance',
    headerName: 'Current Statement Balance',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{formatNumber(params.value)}</p>;
    },
  },
  {
    field: 'isClosed',
    headerName: 'Is Closed',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{params.value ? 'Yes' : 'No'}</p>;
    },
  },
  {
    field: 'isReversed',
    headerName: 'Is Reversed',
    headerClass: 'prefix-header',
    flex: 1,
    cellRenderer: (params) => {
      return <p>{params.value ? 'Yes' : 'No'}</p>;
    },
  },
  {
    field: 'bankAccountId',
    headerName: 'Bank Account Id',
    headerClass: 'prefix-header',
    flex: 1,
    hide: true,
  },
];

const BankReconciliationReport = () => {
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
  const [postReconciliation, setPostReconciliation] = useState(false);

  const handleOpenUploadDialog = () => {
    setUploadExcel(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadExcel(false);
    setSelectedFile(null); // Reset the selected file on close
  };

  const transformData = (data) => {
    return data.map((item, index) => {
      return {
        no: index + 1,
        ...item,
        // roles: item.roles,
      };
    });
  };

  const handlers = {};

  const baseCardHandlers = {};

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [selectedBankStatements, setSelectedBankStatements] = useState([]);
  const [selectedBankSubledgers, setSelectedBankSubledgers] = useState([]);

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
    ? `${clickedItem?.description} ${parseDate(
        clickedItem?.statementStartDate
      )} - ${parseDate(clickedItem?.statementEndDate)}`
    : 'Create New Bank Account';

  const fields = [
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      disabled: true,
    },

    {
      name: 'statementStartDate',
      label: 'Statement Start Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'statementEndDate',
      label: 'Statement End Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastStatementBalance',
      label: 'Last Statement Balance',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'currentStatementBalance',
      label: 'Statement Ending Balance',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'isClosed',
      label: 'Is Closed',
      type: 'switch',
      disabled: true,
    },
    {
      name: 'isReversed',
      label: 'Is Reversed',
      type: 'switch',
      disabled: true,
    },
  ];

  const [refreshBankStatements, setRefreshBankStatements] = useState(1);
  const [totalDifference, setTotalDifference] = useState(0);
  const [reconciliationId, setReconciliationId] = useState(null);

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        largeCard={true}
      >
        <div className="flex flex-col gap-5">
          <BaseInputCard
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

          <BankReconciliationReportCard
            reconciliationId={reconciliationId}
            setReconciliationId={setReconciliationId}
            refreshBankStatements={refreshBankStatements}
            setSelectedBankStatements={setSelectedBankStatements}
            setSelectedBankSubledgers={setSelectedBankSubledgers}
            clickedItem={clickedItem}
            setClickedItem={setClickedItem}
            uploadExcel={uploadExcel}
            setTotalDifference={setTotalDifference}
          />
        </div>
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getBankReconciliatinReport}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Bank Reconciliation Report"
        currentTitle="Bank Reconciliation Report"
      />
    </div>
  );
};

export default BankReconciliationReport;
