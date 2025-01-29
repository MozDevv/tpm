import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // Import Ag-Grid
import 'ag-grid-community/styles/ag-grid.css'; // Import Ag-Grid CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Import Ag-Grid Theme CSS
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import './chartsOfAccounts.css'; // Import the stylesheet
import ListNavigation from '@/components/baseComponents/ListNavigation';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import CustomBreadcrumbsList from '@/components/CustomBreadcrumbs/CustomBreadcrumbsList';
import { formatNumber } from '@/utils/numberFormatters';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import BaseDrilldown from '@/components/baseComponents/BaseDrilldown';
import {
  getColumnDefsByType,
  getColumnDefsByType2,
} from '@/components/financeComponents/baseSubledgerData/BaseSubledgerData';
import TrialBalance from '../reports/TrialBalance';
import { Dialog } from '@mui/material';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';

function ChartsOfAccounts() {
  const [rowData, setRowData] = useState([]);
  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);
  const [openTrialBalanceReport, setOpenTrialBalanceReport] = useState(false);

  function calculateTotals(data) {
    let totals = {};
    let currentTotal = 0;
    let currentBudgetTotal = 0;
    let sectionKey = null;

    data.forEach((item) => {
      if (item.accountTypeName === 'BEGIN_TOTAL') {
        // Initialize totals when encountering a BEGIN_TOTAL
        sectionKey = item.id;
        currentTotal = 0;
        currentBudgetTotal = 0;
      }

      if (item.accountTypeName === 'POSTING' && sectionKey) {
        // Accumulate totals for POSTING accounts
        currentTotal += item.amount || 0;

        currentBudgetTotal += item.budgetAmount || 0;
      }

      if (item.accountTypeName === 'END_TOTAL' && sectionKey) {
        // Store totals when encountering an END_TOTAL
        totals[item.id] = {
          totalAmount: currentTotal,
          totalBudget: currentBudgetTotal,
        };
        sectionKey = null; // Reset section key
      }
    });

    return totals;
  }

  const totals = calculateTotals(rowData);

  console.log('totals', totals);

  const colDefs = [
    {
      headerName: 'Account No.',
      field: 'glAccountNo',
      width: 120,
      pinned: 'left',

      cellStyle: ({ data }) => ({
        paddingLeft: '10px',
        textDecoration:
          data.accountTypeName !== 'POSTING' ? 'underline' : 'none',
        color: data.accountTypeName !== 'POSTING' ? '#006990' : 'inherit',

        fontWeight: data.accountTypeName !== 'POSTING' ? 700 : 600,
      }),
    },
    {
      headerName: 'Account Name',
      field: 'glAccountName',

      width: 350,
      cellStyle: ({ data }) => ({
        paddingLeft:
          data.accountTypeName === 'POSTING'
            ? '25px'
            : data.accountTypeName === 'BEGIN_TOTAL' ||
              data.accountTypeName === 'END_TOTAL'
            ? '15px'
            : '4px',
        textTransform:
          data.accountTypeName === 'HEADING' ? 'uppercase' : 'none',
        fontWeight: data.accountTypeName !== 'POSTING' ? 'bold' : 'normal',
        fontSize: '14px',
      }),
    },
    // { headerName: "Account Code", field: "accountCode", width: 150 },
    {
      headerName: 'Net Amount',
      field: 'amount',
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === 'END_TOTAL') {
          console.log('totals[rowId]?.totalAmount', totals[rowId]?.totalAmount);
          console.log('id for end total', rowId);
          return formatNumber(totals[rowId]?.totalAmount);
        }

        return accountType === 'BEGIN_TOTAL' || accountType === 'HEADING'
          ? ''
          : formatNumber(params.value);
      },
      cellRenderer: (params) => {
        const accountType = params.data.accountTypeName;

        const rowId = params.data.id;

        // If it's not BEGIN_TOTAL or HEADING, render clickable amount
        if (
          accountType !== 'BEGIN_TOTAL' &&
          accountType !== 'HEADING' &&
          accountType !== 'END_TOTAL'
        ) {
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
        }

        return formatNumber(totals[rowId]?.totalAmount); // For other types, return normal formatted value
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== 'POSTING' ? 'bold' : 'normal',
        textAlign: 'right',
      }),
    },
    {
      headerName: 'Budget Amount',
      field: 'budgetAmount',
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === 'END_TOTAL') {
          return formatNumber(totals[rowId]?.totalBudget || 0);
        }

        return accountType === 'BEGIN_TOTAL' || accountType === 'HEADING'
          ? ''
          : formatNumber(params.value);
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== 'POSTING' ? 'bold' : 'normal',
        textAlign: 'right',
      }),
    },
    {
      headerName: 'Budget Balance',
      field: 'budgetBalance',
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === 'END_TOTAL') {
          const totalAmount = totals[rowId]?.totalAmount || 0;
          const totalBudget = totals[rowId]?.totalBudget || 0;
          return formatNumber(totalBudget - totalAmount);
        }

        return accountType === 'BEGIN_TOTAL' || accountType === 'HEADING'
          ? ''
          : formatNumber(params.value);
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== 'POSTING' ? 'bold' : 'normal',
        textAlign: 'right',
      }),
    },
    {
      headerName: 'Income or Balance Sheet',
      field: 'incomeOrBalancesheet',
      width: 150,
      valueFormatter: (params) => {
        const value = params.value;
        if (value === 1) {
          return 'Income';
        } else if (value === 2) {
          return 'Balance Sheet';
        } else {
          return 'None';
        }
      },
    },
    {
      headerName: 'Account Category',
      field: 'accountSubgroupId',

      valueFormatter: (params) => {
        const subgroupId = params.data.accountSubgroupId;
        const subGroup = subGroups.find((group) => group.id === subgroupId);
        return subGroup?.parentGroupName || '';
      },
      cellStyle: { marginLeft: '40px' },
    },
    {
      headerName: 'Account Sub Category',
      field: 'subGroupName',
      cellStyle: { marginLeft: '20px', color: '#006990' },
    },

    { headerName: 'Account Type Name', field: 'accountTypeName' },
    { headerName: 'Direct Posting', field: 'isDirectPosting', width: 90 },
    { headerName: 'Reconciliation', field: 'isReconciliation', width: 90 },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const fetchAccountTypes = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.fetchGlAccountTypes
      );
      setAccountTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAccountGroupTypes = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getAccountGroupTypes
      );
      setGroupTypes(response.data.data);
      const flattenedData = response.data.data.flatMap((group) =>
        group.subgroups.map((subgroup) => ({
          ...subgroup,
          parentGroupName: group.groupName,
          groupId: group.id, // Attach the groupId to each subgroup
        }))
      );

      console.log(
        'flattenedData.map((subgroup) => subgroup.subGroupName',
        flattenedData.map((subgroup) => {
          return {
            id: subgroup.id,
            name: subgroup.subGroupName,
            groupId: subgroup.groupId,
          };
        })
      );
      setSubGroups(
        flattenedData.map((subgroup) => {
          return {
            id: subgroup.id,
            name: subgroup.subGroupName,
            groupId: subgroup.groupId,
            parentGroupName: subgroup.parentGroupName,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const [allOptions, setAllOptions] = useState([]);

  const fetchNewOptions = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getAccounts, {
        'paging.pageSize': 2000,
      }); // Pass accountTypeId to the endpoint
      if (res.status === 200) {
        setAllOptions(
          res.data.data.map((acc) => {
            return {
              id: acc.id,
              name: acc.accountNo,
              accountName: acc.name,
              accountType: acc.accountType,
            };
          })
        );
      }
    } catch (error) {
      console.log(error);
      return []; // Return an empty array if an error occurs
    }
  };

  useEffect(() => {
    fetchNewOptions();
  }, []);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        'paging.pageSize': 1000,
      });

      const accounts = response.data.data.map((account) => ({
        ...account,
        glCategory: subGroups.find(
          (group) => group.id === account.accountSubgroupId
        )?.groupId,
        glAccountName: account.accountName,
        glAccountNo: account.accountNo,
        budgetBalance: account.budgetBalance,
      }));
      setRowData(accounts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
    fetchAccountGroupTypes();
    fetchGlAccounts();
  }, []);

  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => exportData(),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),

    reports: () => console.log('Reports clicked'),
    notify: () => setOpenNotification(true),
    'Trial Balance': () => setOpenTrialBalanceReport(true),
    'Balance Sheet': () => setOpenTrialBalanceReport(true),
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    setClickedItem(row);
    setOpenBaseCard(true);
  };
  const [filteredData, setFilteredData] = useState([]);
  const fields = [
    {
      name: 'glAccountNo',
      label: 'Account No',
      type: 'text',
    },
    {
      name: 'glAccountName',
      label: 'Account Name',
      type: 'text',
    },

    {
      name: 'amount',
      label: 'Amount',
      type: 'drillDown',
      disabled: true,
    },
    {
      name: 'budgetAmount',
      label: 'Budget Amount',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'budgetBalance',
      label: 'Budget Balance',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'glCategory',
      label: 'Category',
      type: 'select',
      options: groupTypes?.map((type) => ({
        id: type.id,
        name: type.groupName,
      })),
      required: true,
    },

    {
      name: 'accountSubgroupId',
      label: 'Sub Category',
      type: 'select',
      options:
        filteredData && filteredData.length > 0 ? filteredData : subGroups,
      required: true,
    },
    {
      name: 'glAccountType',
      label: 'Account Type',
      type: 'autocomplete',
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
      required: true,
    },
    {
      name: 'incomeOrBalancesheet',
      label: 'Income or Balance Sheet',
      type: 'select',
      options: [
        { id: 0, name: 'None' },
        { id: 1, name: 'Income' },
        { id: 2, name: 'Balance Sheet' },
      ],
    },

    {
      name: 'isDirectPosting',
      label: 'Direct Posting',
      type: 'switch',
    },
    {
      name: 'isReconciliation',
      label: 'Reconciliation',
      type: 'switch',
    },
  ];

  const inputFields = [
    {
      name: 'accountNo',
      label: 'Account No',
      type: 'text',
      required: true,
    },
    {
      name: 'accountName',
      label: 'Account Name',
      type: 'text',
      required: true,
    },
    {
      name: 'incomeOrBalancesheet',
      label: 'Income or Balance Sheet',
      type: 'select',
      options: [
        { id: 0, name: 'None' },
        { id: 1, name: 'Income' },
        { id: 2, name: 'Balance Sheet' },
      ],
    },
    {
      name: 'group',
      label: 'Category',
      type: 'select',
      options: groupTypes?.map((type) => ({
        id: type.id,
        name: type.groupName,
      })),
      required: true,
    },
    {
      name: 'accountSubgroupId',
      label: 'Sub Category',
      type: 'select',
      options:
        filteredData && filteredData.length > 0 ? filteredData : subGroups,
      required: true,
    },
    {
      name: 'glAccountType',
      label: 'Account Type',
      type: 'autocomplete',
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
      required: true,
    },
    {
      name: 'isDirectPosting',
      label: 'Direct Posting',
      type: 'switch',
    },
    {
      name: 'isReconciliation',
      label: 'Reconciliation',
      type: 'switch',
    },
  ];

  useEffect(() => {
    fetchGlAccounts();
  }, [openBaseCard]);

  const transformData = (data) => {
    return data.map((item) => ({
      id: item.id,
      // accountNo: item.accountNo,
      // accountName: item.accountName,
      amount: item.amount,
      budgetAmount: item.budgetAmount,
      budgetBalance: item.budgetBalance,
      subGroupName: item.subGroupName,
      accountTypeName: item.accountTypeName,
      isDirectPosting: item.isDirectPosting,
      isReconciliation: item.isReconciliation,
      glAccountName: item.accountName,
      glAccountNo: item.accountNo,
    }));
  };

  const [gridHeight, setGridHeight] = useState(400);
  const rowHeight = 40;

  useEffect(() => {
    const totalHeight =
      Array.isArray(rowData) && rowData && rowData.length > 0
        ? Math.min(rowData.length * rowHeight + 50, window.innerHeight - 100)
        : '400px';
    setGridHeight(totalHeight);
  }, [rowData]);

  const [openDrilldown, setOpenDrilldown] = useState(false);

  return (
    <div className="flex flex-col">
      <Dialog
        open={openTrialBalanceReport}
        onClose={() => setOpenTrialBalanceReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '75vh',
            maxHeight: '85vh',
            minWidth: '30vw',
            maxWidth: '35vw',
          },
        }}
      >
        <div className="px-6">
          <TrialBalance setOpenTrialBalanceReport={setOpenTrialBalanceReport} />
        </div>
      </Dialog>
      <CustomBreadcrumbsList currentTitle="Chart of Accounts" />
      <div
        className=" mt-[15px] mr-5"
        style={{ width: '100%', overflowY: 'hidden' }}
      >
        <BaseDrilldown
          setOpenDrilldown={setOpenDrilldown}
          openDrilldown={openDrilldown}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          columnDefs={getColumnDefsByType2('General Ledger Entries', rowData)}
          fetchApiEndpoint={financeEndpoints.glDrillDown(clickedItem?.id)}
          fetchApiService={apiService.get}
          title={`${clickedItem?.glAccountNo} - ${clickedItem?.glAccountName}`}
        />
        <BaseCard
          openBaseCard={openBaseCard}
          setOpenBaseCard={setOpenBaseCard}
          title={clickedItem?.accountName}
          isUserComponent={false}
          // handlers={baseCardHandlers}
          clickedItem={clickedItem}
          deleteApiEndpoint={financeEndpoints.deleteGlAccount(clickedItem?.id)}
          deleteApiService={apiService.delete}
          glAccountName={
            clickedItem
              ? `${clickedItem?.glAccountNo} - ${clickedItem?.glAccountName}`
              : 'Create New GL Account'
          }
        >
          {clickedItem ? (
            <>
              {' '}
              <BaseAutoSaveInputCard
                fields={fields}
                apiEndpoint={financeEndpoints.createGlAccount}
                putApiFunction={apiService.post}
                updateApiEndpoint={financeEndpoints.updateGlAccount}
                postApiFunction={apiService.post}
                getApiEndpoint={financeEndpoints.fetchGlAccounts}
                getApiFunction={apiService.get}
                transformData={transformData}
                setOpenBaseCard={setOpenBaseCard}
                useRequestBody={true}
                openBaseCard={openBaseCard}
                setClickedItem={setClickedItem}
                clickedItem={clickedItem}
                setOpenDrilldown={setOpenDrilldown}
              />{' '}
            </>
          ) : (
            <BaseAutoSaveInputCard
              fields={inputFields}
              apiEndpoint={financeEndpoints.createGlAccount}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateGlAccount}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.fetchGlAccounts}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
              fieldName="group"
              options={subGroups}
              setResultFunction={setFilteredData}
              filterKey="groupId"
            />
          )}
        </BaseCard>

        <ListNavigation
          handlers={handlers}
          reportItems={['Trial Balance', 'Balance Sheet']}
        />
        <div className="mt-6 overflow-hidden"></div>
      </div>
      <div
        className="ag-theme-quartz font-segoe"
        style={{
          height: gridHeight ? `${gridHeight}px` : '75vh',
          width: '100%',
          overflow: 'hidden',
          maxHeight: '600px',
        }} // Set the height as needed
      >
        <AgGridReact
          columnDefs={colDefs}
          rowData={rowData}
          onCellDoubleClicked={(e) => {
            setOpenBaseCard(true);
            setClickedItem(e.data);
          }}
          noRowsOverlayComponent={BaseEmptyComponent}
          // onRowClicked={(e) => {
          //   // setOpenBaseCard(true);
          //   setClickedItem(e.data);
          // }}
          className="font-segoe"
          onGridReady={onGridReady}
          animateRows={true}
          rowHeight={rowHeight}
          domLayout="normal"
        />
      </div>
    </div>
  );
}

export default ChartsOfAccounts;
