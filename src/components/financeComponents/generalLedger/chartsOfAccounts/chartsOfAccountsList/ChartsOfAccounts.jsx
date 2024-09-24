import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // Import Ag-Grid
import "ag-grid-community/styles/ag-grid.css"; // Import Ag-Grid CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Import Ag-Grid Theme CSS
import financeEndpoints, { apiService } from "@/components/services/financeApi";
import "./chartsOfAccounts.css"; // Import the stylesheet
import ListNavigation from "@/components/baseComponents/ListNavigation";
import BaseCard from "@/components/baseComponents/BaseCard";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
import { formatNumber } from "@/utils/numberFormatters";
import BaseAutoSaveInputCard from "@/components/baseComponents/BaseAutoSaveInputCard";

function ChartsOfAccounts() {
  const [rowData, setRowData] = useState([]);
  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);

  function calculateTotals(data) {
    let totals = {};
    let currentTotal = 0;
    let currentBudgetTotal = 0;
    let sectionKey = null;

    data.forEach((item) => {
      if (item.accountTypeName === "BEGIN_TOTAL") {
        // Initialize totals when encountering a BEGIN_TOTAL
        sectionKey = item.id;
        currentTotal = 0;
        currentBudgetTotal = 0;
      }

      if (item.accountTypeName === "POSTING" && sectionKey) {
        // Accumulate totals for POSTING accounts
        currentTotal += item.amount || 0;
        currentBudgetTotal += item.budgetAmount || 0;
      }

      if (item.accountTypeName === "END_TOTAL" && sectionKey) {
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

  const colDefs = [
    {
      headerName: "Account No.",
      field: "glAccountNo",
      width: 120,
      pinned: "left",

      cellStyle: ({ data }) => ({
        paddingLeft: "10px",
        textDecoration:
          data.accountTypeName !== "POSTING" ? "underline" : "none",
        color: data.accountTypeName !== "POSTING" ? "#006990" : "inherit",

        fontWeight: data.accountTypeName !== "POSTING" ? 700 : 600,
      }),
    },
    {
      headerName: "Account Name",
      field: "glAccountName",

      width: 350,
      cellStyle: ({ data }) => ({
        paddingLeft:
          data.accountTypeName === "POSTING"
            ? "25px"
            : data.accountTypeName === "BEGIN_TOTAL" ||
              data.accountTypeName === "END_TOTAL"
            ? "15px"
            : "4px",
        fontWeight: data.accountTypeName !== "POSTING" ? "bold" : "normal",
        fontSize: "14px",
      }),
    },
    // { headerName: "Account Code", field: "accountCode", width: 150 },
    {
      headerName: "Net Amount",
      field: "amount",
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === "END_TOTAL") {
          return formatNumber(totals[rowId]?.totalAmount || 0);
        }

        return accountType === "BEGIN_TOTAL" || accountType === "HEADING"
          ? ""
          : formatNumber(params.value);
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== "POSTING" ? "bold" : "normal",
        textAlign: "right",
      }),
    },
    {
      headerName: "Budget Amount",
      field: "budgetAmount",
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === "END_TOTAL") {
          return formatNumber(totals[rowId]?.totalBudget || 0);
        }

        return accountType === "BEGIN_TOTAL" || accountType === "HEADING"
          ? ""
          : formatNumber(params.value);
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== "POSTING" ? "bold" : "normal",
        textAlign: "right",
      }),
    },
    {
      headerName: "Budget Balance",
      field: "budgetBalance",
      width: 150,
      valueFormatter: (params) => {
        const accountType = params.data.accountTypeName;
        const rowId = params.data.id;

        if (accountType === "END_TOTAL") {
          const totalAmount = totals[rowId]?.totalAmount || 0;
          const totalBudget = totals[rowId]?.totalBudget || 0;
          return formatNumber(totalBudget - totalAmount);
        }

        return accountType === "BEGIN_TOTAL" || accountType === "HEADING"
          ? ""
          : formatNumber(params.value);
      },
      cellStyle: ({ data }) => ({
        fontWeight: data.accountTypeName !== "POSTING" ? "bold" : "normal",
        textAlign: "right",
      }),
    },
    { headerName: "Account Category", field: "subGroupName" },
    { headerName: "Account Type Name", field: "accountTypeName" },
    { headerName: "Direct Posting", field: "isDirectPosting", width: 90 },
    { headerName: "Reconciliation", field: "isReconciliation", width: 90 },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        "paging.pageSize": 1000,
      });

      const accounts = response.data.data.map((account) => ({
        ...account,
        glAccountName: account.accountName,
        glAccountNo: account.accountNo,
        budgetBalance: (account.budgetAmount || 0) - (account.amount || 0),
      }));
      setRowData(accounts);
    } catch (error) {
      console.log(error);
    }
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
          groupId: group.id, // Attach the groupId to each subgroup
        }))
      );

      console.log(
        "flattenedData.map((subgroup) => subgroup.subGroupName",
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
          };
        })
      );
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
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => setOpenNotification(true),
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row); // Handle row click and access row data here
    setClickedItem(row);
    setOpenBaseCard(true);
  };
  const fields = [
    {
      name: "glAccountName",
      label: "Account Name",
      type: "text",
    },
    {
      name: "glAccountNo",
      label: "Account No",
      type: "text",
    },
    {
      name: "amount",
      label: "Amount",
      type: "amount",
      disabled: true,
    },
    {
      name: "budgetAmount",
      label: "Budget Amount",
      type: "amount",
      disabled: true,
    },

    {
      name: "budgetBalance",
      label: "Budget Balance",
      type: "amount",
      disabled: true,
    },
    {
      name: "subGroupName",
      label: "Account Category",
      type: "text",
    },
    {
      name: "glAccountType",
      label: "Account Sub Category",
      type: "autocomplete",
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
      required: true,
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

  const [filteredData, setFilteredData] = useState([]);

  const inputFields = [
    {
      name: "accountNo",
      label: "Account No",
      type: "text",
      required: true,
    },
    {
      name: "accountName",
      label: "Account Name",
      type: "text",
      required: true,
    },

    {
      name: "group",
      label: "Category",
      type: "select",
      options: groupTypes?.map((type) => ({
        id: type.id,
        name: type.groupName,
      })),
      required: true,
    },
    {
      name: "accountSubgroupId",
      label: "Sub Category",
      type: "select",
      options:
        filteredData && filteredData.length > 0 ? filteredData : subGroups,
      required: true,
    },
    {
      name: "glAccountType",
      label: "Account Sub Category",
      type: "autocomplete",
      options: accountTypes.map((type) => ({
        id: type.value,
        name: type.name,
      })),
      required: true,
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

  return (
    <div className="flex flex-col">
      <CustomBreadcrumbsList currentTitle="Chart of Accounts" />
      <div
        className="ag-theme-quartz mt-[15px] mr-5"
        style={{ height: "75vh", width: "100%", overflowY: "hidden" }}
      >
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
              ? `${clickedItem?.glAccountNo} - ${clickedItem?.glAccountName}`
              : "Create New GL Account"
          }
        >
          {clickedItem ? (
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
            />
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

        <ListNavigation handlers={handlers} />
        <div className="mt-6 overflow-auto max-h-[100vh] h-full flex-grow">
          <div className=" max-h-[1800px] h-[1800px]">
            <AgGridReact
              columnDefs={colDefs}
              rowData={rowData}
              onRowClicked={(e) => {
                setOpenBaseCard(true);
                setClickedItem(e.data);
              }}
              onGridReady={onGridReady}
              domLayout="autoHeight"
              rowHeight={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsOfAccounts;
