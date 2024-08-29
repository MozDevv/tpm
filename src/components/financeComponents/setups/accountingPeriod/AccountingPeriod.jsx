import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "finYearName",
    headerName: "Accounting Period Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "fromDate",
    headerName: "From Date",
    headerClass: "prefix-header",
    valueFormatter: (params) => formatDate(params.value),
    filter: true,
    width: 250,
  },

  {
    field: "toDate",
    headerName: "To Date",
    headerClass: "prefix-header",
    valueFormatter: (params) => formatDate(params.value),
    filter: true,
    width: 250,
  },
  {
    field: "isClosed",
    headerName: "Is Closed",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
];

const AccountingPeriod = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      toDate: item.toDate,
      fromDate: item.fromDate,
      finYearName: item.finYearName,
      isClosed: item.isClosed,

      // roles: item.roles,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => console.log("Notify clicked"),
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

  const title = clickedItem
    ? "Accounting Period"
    : "Create New Accounting Period";

  const fields = [
    {
      name: "finYearName",
      label: "Accounting Period Name",
      type: "text",
      required: true,
    },
    {
      name: "fromDate",
      label: "From Date",
      type: "date",
      required: true,
    },
    {
      name: "toDate",
      label: "To Date",
      type: "date",
      required: true,
    },
    {
      name: "isClosed",
      label: "Is Closed",
      type: "switch",
      required: true,
    },
  ];

  return (
    <div className="">
      {/* <div className="relative">
        <BaseCard
          openBaseCard={openSubGroup}
          setOpenBaseCard={setOpenSubGroup}
          title={clickedSubGroup ? "Edit SubGroup" : "Create New SubGroup"}
          clickedItem={clickedSubGroup}
          isUserComponent={false}
          deleteApiEndpoint={financeEndpoints.deleteAccountSubGroup(
            clickedSubGroup?.id
          )}
          deleteApiService={apiService.delete}
          isSecondaryCard={true}
        >
          {clickedSubGroup ? (
            <div className="">
              <BaseInputCard
                fields={subgroupFields}
                apiEndpoint={financeEndpoints.updateAccountSubGroup}
                postApiFunction={apiService.post}
                clickedItem={clickedSubGroup}
                setOpenBaseCard={setOpenSubGroup}
                useRequestBody={true}
              />{" "}
              <div className="text-primary font-semibold text-base my-2 px-3">
                {clickedItem?.groupName} Categories
              </div>
              <Button
                variant="text"
                startIcon={<Add />}
                sx={{ my: 2, ml: 1 }}
                onClick={() => setOpenSubGroup(true)}
              >
                New SubGroup
              </Button>
              <div
                className="ag-theme-quartz"
                style={{
                  height: "60vh",

                  mt: "20px",
                  px: "10px",

                  overflowY: "auto",
                }}
              >
                <AgGridReact
                  columnDefs={subGroupColumnDefs}
                  rowData={subGroups}
                  pagination={false}
                  domLayout="autoHeight"
                  alwaysShowHorizontalScroll={true}
                  onGridReady={(params) => {
                    params.api.sizeColumnsToFit();
                  }}
                  onRowClicked={(e) => {
                    console.log("Row clicked", e.data);
                    setClickedSubGroup(e.data);
                    setOpenSubGroup(true);
                  }}
                />
              </div>
            </div>
          ) : (
            <BaseInputCard
              id={clickedItem?.id}
              idLabel="accountGroupId"
              fields={subgroupFields}
              apiEndpoint={financeEndpoints.addAccountSubGroup}
              postApiFunction={apiService.post}
              clickedItem={clickedSubGroup}
              setOpenBaseCard={setOpenSubGroup}
              useRequestBody={true}
              isBranch={true}
            />
          )}
        </BaseCard>
      </div> */}
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteAccountingPeriod(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateAccountingPeriod}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addAccountingPeriod}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={financeEndpoints.getAccountingPeriods}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Accounting Period"
        currentTitle="Accounting Period"
      />
    </div>
  );
};

export default AccountingPeriod;
