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

function ChartsOfAccounts() {
  const [rowData, setRowData] = useState([]);
  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const colDefs = [
    {
      headerName: "Account No.",
      field: "accountNo",
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
      field: "accountName",

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
    { headerName: "Account Code", field: "accountCode", width: 150 },
    {
      headerName: "Net Amount",
      field: "amount",
      width: 150,
      valueFormatter: (params) => formatNumber(params.value),

      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Budget Amount",
      field: "budgetAmount",
      width: 150,
      valueFormatter: (params) => formatNumber(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Budget Balance",
      field: "budgetBalance",
      width: 150,

      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => formatNumber(params.value),
    },
    { headerName: "Sub Group Name", field: "subGroupName" },
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
      type: "amount",
    },
    {
      name: "budgetAmount",
      label: "Budget Amount",
      type: "amount",
    },
    {
      name: "budgetBalance",
      label: "Budget Balance",
      type: "amount",
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
      name: "accountNo",
      label: "Account No",
      type: "text",
    },
    {
      name: "accountName",
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

  useEffect(() => {
    fetchGlAccounts();
  }, [openBaseCard]);
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
              ? `${clickedItem?.accountNo} - ${clickedItem?.accountName}`
              : "Create New GL Account"
          }
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

        <ListNavigation handlers={handlers} />
        <div className="mt-6 overflow-auto max-h-[100vh] h-full">
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
  );
}

export default ChartsOfAccounts;
