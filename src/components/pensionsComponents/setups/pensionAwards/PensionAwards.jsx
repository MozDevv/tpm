"use client";
import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button } from "@mui/material";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "prefix",
    headerName: "Prefix",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "pensionCap",
    headerName: "Pension Cap",
    headerClass: "prefix-header",
    filter: true,
  },
  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  // {
  //   field: "commutable",
  //   headerName: "Commutable",
  //   headerClass: "prefix-header",
  //   filter: false,
  //   cellRenderer: (params) => {
  //     const index = params.value;
  //     const current_data = rowData[index];
  //     const has_commutation = current_data.has_commutation;

  //     return (
  //       <Button
  //         variant="outlined"
  //         sx={{
  //           ml: 3,
  //           borderColor: has_commutation ? "#3498db" : "#e67e22",
  //           maxHeight: "22px",
  //           cursor: "pointer",
  //           color: has_commutation ? "#3498db" : "#e67e22",
  //           fontSize: "10px",
  //           fontWeight: "bold",
  //         }}
  //       >
  //         {has_commutation ? "Yes" : "No"}
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   field: "mapDocs",
  //   headerName: "Map Documents",
  //   headerClass: "prefix-header",
  //   filter: false,
  //   cellRenderer: (params) => {
  //     const index = params.value;
  //     const current_data = rowData[index];
  //     // const id = params[index].value;
  //     const document_nos = current_data.awardDocuments.length;

  //     return (
  //       <Button
  //         variant="outlined"
  //         onClick={() => {
  //           setOpenAward(true);
  //           setRowClicked(current_data);
  //         }}
  //         sx={{
  //           ml: 3,
  //           borderColor: "#3498db",
  //           maxHeight: "22px",
  //           cursor: "pointer",
  //           color: "#3498db",
  //           fontSize: "10px",
  //           fontWeight: "bold",
  //         }}
  //       >
  //         Map Documents ({document_nos})
  //       </Button>
  //     );
  //   },
  // },
];

const PensionAwards = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1 + (pageNumber - 1) * pageSize,

      prefix: transformString(item.prefix),
      name: item.name,
      pensionCap: item.pensionCap.name,
      id: item.id,
      description: transformString(item.description),
      commutable: index,
      mapDocs: index,
      awardDocuments: item.awardDocuments,
      start_date: item.start_date,
      // end_date: item.end_date,
      has_commutation: item.has_commutation,
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

  const title = clickedItem ? "Department" : "Create New Department";

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "email",
      required: true,
    },
    { name: "isMda", label: "Is Mda", type: "switch", required: true },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.pensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.pensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.pensionAwards}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Pensioner Awards"
        currentTitle="Pensioner Awards"
      />
    </div>
  );
};

export default PensionAwards;
