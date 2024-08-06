"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button } from "@mui/material";
import PensionAwardCard from "./PensionAwardCard";

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
  {
    field: "has_commutation",
    headerName: "Commutable",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },

  {},
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

  const pageSize = 100;
  const pageNumber = 1;

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      prefix: transformString(item.prefix),
      name: item.name,
      pensionCap: item.pensionCap.id,
      id: item.id,
      description: transformString(item.description),
      commutable: index,
      mapDocs: index,
      awardDocuments: item.awardDocuments,
      start_date: item.start_date,
      end_date: item.end_date,
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

  const title = clickedItem ? "Pension Award" : "Create New Pension Award";

  const [pensionCaps, setPensionCaps] = React.useState([]);

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps);
      if (res.status === 200) {
        setPensionCaps(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []);
  const fields = [
    { name: "prefix", label: "Prefix", type: "text", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "pensionCap",
      label: "Pension Cap",
      type: "select",
      required: true,
      options: pensionCaps.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      //  required: true,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      // required: true,
    },
    {
      name: "has_commutation",
      label: "Commutable",
      type: "switch",
      required: true,
    },
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
          <PensionAwardCard
            fields={fields}
            apiEndpoint={endpoints.editPensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.pensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
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
        fetchApiEndpoint={endpoints.pensionAwards}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Pension Awards"
        currentTitle="Pension Awards"
      />
    </div>
  );
};

export default PensionAwards;
