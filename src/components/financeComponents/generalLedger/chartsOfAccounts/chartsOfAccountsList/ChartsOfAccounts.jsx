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
} from "@mui/material";
import financeEndpoints, { apiService } from "@/components/services/financeApi";
import "./chartsOfAccounts.css"; // Import the stylesheet
import ListNavigation from "@/components/baseComponents/ListNavigation";
import BaseCard from "@/components/baseComponents/BaseCard";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";

function ChartsOfAccounts() {
  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    { headerName: "Account No.", field: "accountNo" },
    { headerName: "Account Name", field: "accountName" },
    { headerName: "Account Code", field: "accountCode" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Sub Group Name", field: "subGroupName" },
    { headerName: "Account Type Name", field: "accountTypeName" },
    { headerName: "Direct Posting", field: "isDirectPosting" },
    { headerName: "Reconciliation", field: "isReconciliation" },
  ]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts);

      setRowData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

  const renderTableCell = (field, value, accountTypeName) => {
    const isAccountName = field === "accountName";
    const isPostingType = accountTypeName === "POSTING";
    const isBeginTotalorEndTotal =
      accountTypeName === "END_TOTAL" || accountTypeName === "BEGIN_TOTAL";
    const isAccountNo = field === "accountNo";
    const formattedValue =
      typeof value === "number" && value === 0 ? "0.00" : value;

    const getCellPadding = (
      isAccountName,
      isPostingType,
      isBeginTotalorEndTotal
    ) => {
      if (isAccountName && isPostingType) return "25px";
      if (isBeginTotalorEndTotal && isAccountName) return "15px";
      return "4px";
    };

    return (
      <TableCell
        className="table-cell"
        style={{
          paddingLeft: getCellPadding(
            isAccountName,
            isPostingType,
            isBeginTotalorEndTotal
          ),
          fontWeight: isAccountName && !isPostingType ? "bold" : "normal",
          fontSize: isAccountName && !isPostingType ? "14px" : "13px",
        }}
        key={field}
      >
        {isAccountNo && !isPostingType ? (
          <p className="underline text-primary font-semibold">
            {formattedValue}
          </p>
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
    console.log("Row clicked:", row); // Handle row click and access row data here
    setClickedItem(row);
    setOpenBaseCard(true);
  };

  const renderRow = (row) => (
    <TableRow
      key={row.id}
      className="table-row cursor-pointer"
      onClick={() => handleRowClick(row)}
    >
      {colDefs.map((colDef) =>
        renderTableCell(
          colDef.field,
          row[colDef.field],
          row.accountTypeName // Pass the accountTypeName here
        )
      )}
    </TableRow>
  );

  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

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
    <div className="mt-[-5px] overflow-hidden mr-5">
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
      <Divider sx={{ my: 2 }} />
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

export default ChartsOfAccounts;
