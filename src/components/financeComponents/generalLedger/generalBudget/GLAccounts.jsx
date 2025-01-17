import React, { use, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import './chartsOfAccounts.css'; // Import the stylesheet
import ListNavigation from '@/components/baseComponents/ListNavigation';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { formatNumber } from '@/utils/numberFormatters';
import BaseAmountInput from '@/components/baseComponents/BaseAmountInput';
import { message } from 'antd';

function GLAccounts({ clickedBudget, uploadExcel }) {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { headerName: 'Account No.', field: 'accountNo' },
    { headerName: 'Account Name', field: 'accountName' },
    { headerName: 'Budgeted Amount', field: 'budgetedAmount' },
  ]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.fetchGlAccountsById(clickedBudget.id),
        {
          'paging.pageSize': 1000,
        }
      );

      setRowData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts();
  }, []);

  useEffect(() => {
    fetchGlAccounts();
  }, [uploadExcel]);

  useEffect(() => {
    fetchGlAccounts();

    const newColDefs = [...colDefs]; // Start with existing column definitions

    // Check and add startDate column if it exists
    if (clickedBudget?.startDate) {
      const startDateYear = new Date(clickedBudget.startDate).getFullYear();
      if (!newColDefs.find((col) => col.field === 'startDate')) {
        newColDefs.push({
          headerName: `Financial Year (${startDateYear})`, // Set headerName to the year
          field: 'budgetAmount',
          editable: true,
        });
      }
    }

    // Check and add endDate column if it exists
    // if (clickedBudget?.endDate) {
    //   const endDateYear = new Date(clickedBudget.endDate).getFullYear();
    //   if (!newColDefs.find((col) => col.field === "endDate")) {
    //     newColDefs.push({
    //       headerName: `Financial Year(${endDateYear})`, // Set headerName to the year
    //       field: "endDate",
    //       editable: true,
    //       width: 100,
    //     });
    //   }
    // }

    setColDefs(newColDefs); // Update the column definitions
  }, [clickedBudget]);

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
  };

  // Fixed variable name typo
  const [loading, setLoading] = useState(false); // To manage loading state

  const renderTableCell = (colDef, row) => {
    const { field, editable } = colDef;
    const value = row[field];
    const isAccountName = field === 'accountName';
    const isPostingType = row.accountTypeName === 'POSTING';
    const isAccountNo = field === 'accountNo';
    const formattedValue =
      typeof value === 'number' && value === 0 ? '0.00' : value;
    const isBudgetedAmount = field === 'budgetedAmount';
    const budgetAmountValue = row.budgetAmount || 0;
    const endDateValue = row.endDate || 0;
    const cumulativeBudgetAmount = budgetAmountValue * 1 + endDateValue * 1;

    const isEndTotal = row.accountTypeName === 'END_TOTAL';

    const handleInputChange = (e) => {
      const newValue = e.target.value;
      setRowData((prevRowData) =>
        prevRowData.map((r) =>
          r.id === row.id ? { ...r, [field]: newValue } : r
        )
      );
    };

    const saveOrUpdateBudgetAmount = async () => {
      const data = {
        id: row.budgetLineId || null,
        budgetId: clickedBudget.id,
        glAccountId: row.id,
        budgetType: 0,
        amount: row[field] * 1,
        periodStart: clickedBudget.startDate,
        periodEnd: clickedBudget.endDate,
      };

      setLoading((prevLoading) => ({ ...prevLoading, [row.id]: true })); // Set loading state for the field

      try {
        if (row.budgetLineId) {
          const res = await apiService.post(
            financeEndpoints.updateBudgetLine,
            data
          );
          if (res.data.succeeded === false && res.data.messages[0]) {
            message.error(res.data.messages[0]);
          }
        } else {
          const res = await apiService.post(
            financeEndpoints.addBudgetLines,
            data
          );
          if (res.data.succeeded === false && res.data.messages[0]) {
            message.error(res.data.messages[0]);
          }
        }
        fetchGlAccounts();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, [row.id]: false })); // Reset loading state
      }
    };

    return (
      <TableCell
        className="table-cell"
        style={{
          fontWeight: isAccountName && !isPostingType ? 'bold' : 'normal',
          fontSize: isAccountName && !isPostingType ? '13px' : '12px',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: editable && 0,
          paddingRight: editable && 0,
          position: 'relative',
          borderRight: '1px solid #ccc',
        }}
        key={field}
      >
        {editable && isPostingType ? (
          <>
            {loading[row.id] && (
              <CircularProgress
                size={24}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  marginTop: -12, // Center spinner vertically
                }}
              />
            )}

            <TextField
              variant="outlined"
              size="small"
              type="text"
              value={value || 0}
              onChange={handleInputChange}
              onBlur={() => {
                if (value !== '' || value !== null) {
                  saveOrUpdateBudgetAmount();
                }
              }}
              fullWidth
              inputProps={{
                style: {
                  textAlign: 'right',
                  padding: 0, // Remove internal padding
                  margin: 0, // Remove internal margin
                  height: '100%', // Inherit the height of the row
                  fontSize: '13px',
                },
              }}
              InputProps={{
                inputComponent: BaseAmountInput,
              }}
              sx={{
                fontSize: '12px',
                height: '100%', // Inherit the height of the row
                '& .MuiOutlinedInput-root': {
                  paddingX: 2, // Remove padding in the root

                  height: '100%', // Inherit the height of the row
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none', // Remove the border if needed

                    marginY: -1,
                  },
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                  {
                    border: 'none',
                  },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  backgroundColor: '', // Background color on focus
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #006990', // Outline border on focus
                  },
                },
              }}
            />
          </>
        ) : !isPostingType && !isAccountName && !isAccountNo ? (
          <></>
        ) : isAccountNo && !isPostingType ? (
          <p className="underline text-primary font-semibold">
            {formattedValue}
          </p>
        ) : isBudgetedAmount ? (
          <p className=" text-primary text-right">
            {formatNumber(cumulativeBudgetAmount * 1)}
          </p>
        ) : typeof value === 'boolean' ? (
          value ? (
            'Yes'
          ) : (
            'No'
          )
        ) : (
          formattedValue
        )}
      </TableCell>
    );
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    setClickedItem(row);
    setOpenBaseCard(true);
  };

  const renderRow = (row) => (
    <TableRow
      key={row.id}
      className=" cursor-pointer"
      onDoubleClick={() => handleRowClick(row)}
      sx={{
        '&:hover': {
          backgroundColor: '#f5f5f5', // Light background on hover
        },
      }}
    >
      {colDefs.map((colDef) => renderTableCell(colDef, row))}
    </TableRow>
  );

  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGlAccounts();
  }, [openBaseCard]);

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
    fetchAccountGroupTypes();
  }, []);

  const fields = [
    {
      name: 'accountCode',
      label: 'Account Code',
      type: 'text',
    },
    {
      name: 'accountName',
      label: 'Account Name',
      type: 'text',
    },
    {
      name: 'accountNo',
      label: 'Account No',
      type: 'text',
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
    },
    {
      name: 'subGroupName',
      label: 'Sub Group Name',
      type: 'text',
    },
    {
      name: 'glAccountType',
      label: 'GL Account Type',
      type: 'text',
    },
    {
      name: 'accountTypeName',
      label: 'Account Type Name',
      type: 'text',
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
      name: 'group',
      label: 'Category',
      type: 'select',
      options: groupTypes?.map((type) => ({
        id: type.id,
        name: type.groupName,
      })),
    },
    {
      name: 'accountSubgroupId',
      label: 'Sub Category',
      type: 'select',
      options:
        groupTypes
          ?.find((group) => group.id === selectedGroup)
          ?.subgroups.map((subgroup) => ({
            id: subgroup.id,
            name: subgroup.subGroupName,
          })) || [],
    },
    {
      name: 'glAccountType',
      label: 'GL Account Type',
      type: 'autocomplete',
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
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
    {
      name: 'incomeOrBalancesheet',
      label: 'Income Or Balance Sheet',
      type: 'select',
      options: [
        { id: 0, name: 'None' },
        { id: 1, name: 'Income Statement' },
        {
          id: 2,
          name: 'Balance Sheet',
        },
      ],
    },
  ];

  return (
    <div className="overflow-hidden px-5 pt-2 ">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={clickedItem?.accountName}
        isUserComponent={false}
        clickedItem={clickedItem}
        deleteApiEndpoint={financeEndpoints.deleteGlAccount(clickedItem?.id)}
        deleteApiService={apiService.delete}
        glAccountName={
          clickedItem
            ? `${clickedItem?.accountNo} - ${clickedItem?.accountName}`
            : null
        }
        isSecondary={true}
        isSecondaryCard={true}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            clickedItem={clickedItem}
            openBaseCard={openBaseCard}
            setOpenBaseCard={setOpenBaseCard}
            apiEndpoint={financeEndpoints.updateGlAccount}
            postApiFunction={apiService.post}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fetchData={fetchGlAccounts}
            fields={inputFields}
            selectedLabel={'group'}
            setSelectedValue={setSelectedGroup}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            apiEndpoint={financeEndpoints.createGlAccount}
            postApiFunction={apiService.post}
          />
        )}
      </BaseCard>

      <TableContainer
        sx={{
          maxHeight: 400,
          paddingTop: 0,

          border: '1px solid #e0e0e0', // Optional, for visual boundary
          borderRadius: '8px', // Optional, for rounded corners
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional, for shadow effect
          overflow: 'auto', // Enables scroll behavior
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ backgroundColor: '#fff' }}>
            <TableRow>
              {colDefs.map((colDef) => (
                <TableCell
                  key={colDef.field}
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5', // Light background for header
                    padding: '10px',
                  }}
                >
                  {colDef.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              borderRight: '1px solid #ccc',
              '& tr': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& td': {
                padding: '10px', // Cell padding
              },
            }}
          >
            {rowData.length > 0 ? (
              rowData.map((row) => renderRow(row))
            ) : (
              <TableRow>
                <TableCell colSpan={colDefs.length}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GLAccounts;
