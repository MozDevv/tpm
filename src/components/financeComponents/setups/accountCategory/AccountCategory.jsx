import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "groupName",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const AccountCategory = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item?.id,
      groupName: item?.groupName,

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
  const [openSubGroup, setOpenSubGroup] = React.useState(false);
  const [clickedSubGroup, setClickedSubGroup] = React.useState(null);

  const title = clickedItem
    ? clickedItem?.groupName
    : "Create New Account Category";

  const fields = [
    { name: "groupName", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
  ];

  const [subGroups, setSubGroups] = React.useState([]);

  const fetchSubGroups = async () => {
    try {
      const res = await apiService.get(financeEndpoints.getAccountSubGroups);
      const { data } = res.data;
      setSubGroups(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSubGroups();
  }, []);

  const subgroupFields = [
    { name: "subGroupName", label: "Name", type: "text", required: true },
    {
      name: "groupOrder",
      label: "Group Order",
      type: "number",
      required: true,
    },
  ];

  const subGroupColumnDefs = [
    // {
    //   field: "no",
    //   headerName: "Code",
    //   headerClass: "prefix-header",
    //   width: 90,
    //   filter: true,
    // },
    {
      field: "subGroupName",
      headerName: "SubGroup Name",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "groupOrder",
      headerName: "Group Order",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
  ];

  useEffect(() => {
    fetchSubGroups();
  }, [openSubGroup]);
  return (
    <div className="">
      <div className="relative">
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
            <BaseInputCard
              fields={subgroupFields}
              apiEndpoint={financeEndpoints.updateAccountSubGroup}
              postApiFunction={apiService.post}
              clickedItem={clickedSubGroup}
              setOpenBaseCard={setOpenSubGroup}
              useRequestBody={true}
            />
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
      </div>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteAccountGroup(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <div>
            <BaseInputCard
              fields={fields}
              apiEndpoint={financeEndpoints.updateAccountGroup}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
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
            fields={fields}
            apiEndpoint={financeEndpoints.addAccountGroup}
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
        fetchApiEndpoint={financeEndpoints.getAccountGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Account Category"
        currentTitle="Account Category"
      />
    </div>
  );
};

export default AccountCategory;
