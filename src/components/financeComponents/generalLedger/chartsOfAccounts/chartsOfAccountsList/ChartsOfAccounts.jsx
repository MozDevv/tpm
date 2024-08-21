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

  const processRowData = (data) => {
    const hierarchy = [];
    data.forEach((account) => {
      if (account.accountTypeName === "HEADING") {
        hierarchy.push({ ...account, children: [] });
      } else if (account.accountTypeName === "BEGIN_TOTAL") {
        const parent = hierarchy[hierarchy.length - 1];
        if (parent) parent.children.push({ ...account, children: [] });
      } else if (account.accountTypeName === "POSTING") {
        const parent = hierarchy[hierarchy.length - 1];
        const child = parent?.children[parent.children.length - 1];
        if (child) child.children.push(account);
      } else if (account.accountTypeName === "END_TOTAL") {
        const parent = hierarchy[hierarchy.length - 1];
        parent?.children.push(account);
      }
    });
    return hierarchy;
  };

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts);
      const flattenedData = processRowData(response.data.data);
      setRowData(flattenedData);
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
    // create: () => router.push("/pensions/preclaims/listing/new"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => setOpenNotification(true),
  };

  const renderTableCell = (field, value, indentLevel, accountTypeName) => {
    const isAccountName = field === "accountName";
    const isPostingType = accountTypeName === "POSTING";
    const isAccountNo = field === "accountNo";
    const formattedValue =
      typeof value === "number" && value === 0 ? "0.00" : value;

    //////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////
    return (
      <TableCell
        className={`table-cell`}
        style={{
          fontWeight: isAccountName && !isPostingType ? "bold" : "normal", // Bold only if accountName and not POSTING
          paddingLeft: isAccountName ? `${indentLevel * 20}px` : undefined,
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
  const renderRow = (row, indentLevel = 0) => (
    <React.Fragment key={row.id}>
      <TableRow
        className="table-row cursor-pointer"
        onClick={() => handleRowClick(row)}
      >
        {colDefs.map((colDef) =>
          renderTableCell(
            colDef.field,
            row[colDef.field],
            colDef.field === "accountCode" ? 0 : indentLevel,
            row.accountTypeName // Pass the accountTypeName here
          )
        )}
      </TableRow>
      {row.children?.map((child) => renderRow(child, indentLevel + 1))}
    </React.Fragment>
  );

  const [openBaseCard, setOpenBaseCard] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);

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

  useEffect(() => {
    fetchAccountTypes();
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
      label: "Category ",
      type: "text",
    },
    {
      name: "subGroupName",
      label: "Sub Category ",
      type: "text",
    },
    {
      name: "glAccountType",
      label: "GL Account Type",
      type: "select",
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
        title={"Create New GL Account"}
        isUserComponent={false}
        clickedItem={clickedItem}
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
          />
        ) : (
          <BaseInputCard
            fields={inputFields}
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
            {rowData.map((row) => renderRow(row))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ChartsOfAccounts;
