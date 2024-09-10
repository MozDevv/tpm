import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import financeEndpoints, { apiService } from "@/components/services/financeApi";
import "./chartsOfAccounts.css"; // Import the stylesheet
import ListNavigation from "@/components/baseComponents/ListNavigation";
import BaseCard from "@/components/baseComponents/BaseCard";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

function GLAccounts({ clickedBudget }) {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    { headerName: "Account No.", field: "accountNo" },
    { headerName: "Account Name", field: "accountName" },
    { headerName: "Budgeted Amount", field: "budgetedAmount" },
  ]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        "paging.pageSize": 1000,
      });

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

    const newColDefs = [...colDefs]; // Start with existing column definitions

    // Check and add startDate column if it exists
    if (clickedBudget?.startDate) {
      const startDateYear = new Date(clickedBudget.startDate).getFullYear();
      if (!newColDefs.find((col) => col.field === "startDate")) {
        newColDefs.push({
          headerName: startDateYear, // Set headerName to the year
          field: "budgetAmount",
          editable: true,
          width: 100,
        });
      }
    }

    // Check and add endDate column if it exists
    if (clickedBudget?.endDate) {
      const endDateYear = new Date(clickedBudget.endDate).getFullYear();
      if (!newColDefs.find((col) => col.field === "endDate")) {
        newColDefs.push({
          headerName: `Financial Year(${endDateYear})`, // Set headerName to the year
          field: "endDate",
          editable: true,
          width: 100,
        });
      }
    }

    setColDefs(newColDefs); // Update the column definitions
  }, [clickedBudget]);

  const handlers = {
    filter: () => setOpenFilter((prevOpenFilter) => !prevOpenFilter),
    openInExcel: () => exportData(),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => setOpenNotification(true),
  };

  // Fixed variable name typo
  const [loading, setLoading] = useState(false); // To manage loading state

  const renderTableCell = (colDef, row) => {
    const { field, editable } = colDef;
    const value = row[field];
    const isAccountName = field === "accountName";
    const isPostingType = row.accountTypeName === "POSTING";
    const isAccountNo = field === "accountNo";
    const formattedValue =
      typeof value === "number" && value === 0 ? "0.00" : value;
    const isBudgetedAmount = field === "budgetedAmount";
    const budgetAmountValue = row.budgetAmount || 0;
    const endDateValue = row.endDate || 0;
    const cumulativeBudgetAmount = budgetAmountValue * 1 + endDateValue * 1;

    const isEndTotal = row.accountTypeName === "END_TOTAL";

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
          await apiService.post(financeEndpoints.updateBudgetLine, data);
        } else {
          await apiService.post(financeEndpoints.addBudgetLines, data);
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
          fontWeight: isAccountName && !isPostingType ? "bold" : "normal",
          fontSize: isAccountName && !isPostingType ? "14px" : "13px",
          paddingTop: 0,
          paddingBottom: 0,
          position: "relative", // Required to position CircularProgress
          borderRight: "1px solid #ccc", // Add a border on the right
        }}
        key={field}
      >
        {editable && isPostingType ? (
          <>
            <input
              type="text"
              value={value || ""}
              onChange={handleInputChange}
              onBlur={() => {
                if (value !== "" || value !== null) {
                  saveOrUpdateBudgetAmount();
                }
              }} // Trigger save on blur
              style={{
                width: "100%",
                padding: "5px",

                outlineWidth: "3px",
                marginTop: "-15px",
                marginBottom: "-15px",

                //border: "1px solid #ddd",
              }}
            />
            {loading[row.id] && (
              <CircularProgress
                size={24}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  marginTop: -12, // Center spinner vertically
                }}
              />
            )}
          </>
        ) : isAccountNo && !isPostingType ? (
          <p className="underline text-primary font-semibold">
            {formattedValue}
          </p>
        ) : isBudgetedAmount ? (
          <p className=" text-primary ">{cumulativeBudgetAmount * 1}</p>
        ) : typeof value === "boolean" ? (
          value ? (
            "Yes"
          ) : (
            "No"
          )
        ) : (
          formattedValue
        )}
      </TableCell>
    );
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    setClickedItem(row);
    setOpenBaseCard(true);
  };

  const renderRow = (row) => (
    <TableRow
      key={row.id}
      className="table-row cursor-pointer"
      onDoubleClick={() => handleRowClick(row)}
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
      name: "accountCode",
      label: "Account Code",
      type: "text",
    },
    {
      name: "accountName",
      label: "Account Name",
      type: "text",
    },
    {
      name: "accountNo",
      label: "Account No",
      type: "text",
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
    },
    {
      name: "subGroupName",
      label: "Sub Group Name",
      type: "text",
    },
    {
      name: "glAccountType",
      label: "GL Account Type",
      type: "text",
    },
    {
      name: "accountTypeName",
      label: "Account Type Name",
      type: "text",
    },
    {
      name: "isDirectPosting",
      label: "Direct Posting",
      type: "switch",
    },
    {
      name: "isReconciliation",
      label: "Reconciliation",
      type: "switch",
    },
  ];

  const inputFields = [
    {
      name: "glAccountNo",
      label: "Account No",
      type: "text",
    },
    {
      name: "glAccountName",
      label: "Account Name",
      type: "text",
    },

    {
      name: "group",
      label: "Category",
      type: "select",
      options: groupTypes?.map((type) => ({
        id: type.id,
        name: type.groupName,
      })),
    },
    {
      name: "accountSubgroupId",
      label: "Sub Category",
      type: "select",
      options:
        groupTypes
          ?.find((group) => group.id === selectedGroup)
          ?.subgroups.map((subgroup) => ({
            id: subgroup.id,
            name: subgroup.subGroupName,
          })) || [],
    },
    {
      name: "glAccountType",
      label: "GL Account Type",
      type: "autocomplete",
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
    },
    {
      name: "isDirectPosting",
      label: "Direct Posting",
      type: "switch",
    },
    {
      name: "isReconciliation",
      label: "Reconciliation",
      type: "switch",
    },
  ];

  return (
    <div className="mt-[-30px] overflow-auto mr-5 px-12">
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
            selectedLabel={"group"}
            setSelectedValue={setSelectedGroup}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            apiEndpoint={financeEndpoints.createGlAccount}
            postApiFunction={apiService.post}
          />
        )}
      </BaseCard>
      <TableContainer className="table-container ">
        <Table className="table pl-2">
          <TableHead className="table-head">
            <TableRow>
              {colDefs.map((colDef) => (
                <TableCell key={colDef.field} className="table-header py-2">
                  {colDef.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
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
