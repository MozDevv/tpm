"use client";
import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },

  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },
  {
    field: "parliament_number",
    headerName: "Parliament Number",
    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },
  {
    field: "start_year",
    headerName: "Start Year",

    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },
  {
    field: "end_year",
    headerName: "End Year",
    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },

  {
    field: "specific_start_month",
    headerName: "Specific Start Month",
    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },
  {
    field: "specific_end_month",
    headerName: "Specific End Month",
    headerClass: "prefix-header",
    filter: true,
    flex: 1,
  },
];

const ParliamentaryTerms = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,

      id: item.id,
      start_year: item.start_year,
      end_year: item.end_year,
      parliament_number: item.parliament_number,
      specific_start_month: item.specific_start_month,
      specific_end_month: item.specific_end_month,
      name: item.name,
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
    ? "Parliamentary Terms"
    : "Create New Parliamentary Terms";

  const months = [
    {
      id: 1,
      name: "January",
    },
    {
      id: 2,
      name: "February",
    },
    {
      id: 3,
      name: "March",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "May",
    },
    {
      id: 6,
      name: "June",
    },
    {
      id: 7,
      name: "July",
    },
    {
      id: 8,
      name: "August",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "October",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "December",
    },
  ];

  const startYear = 1920;
  const endYear = 2099;

  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => {
      const year = startYear + index;
      return { id: year, name: year.toString() };
    }
  );
  console.log(yearOptions);

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "start_year",
      label: "Start Year",
      type: "autocomplete",
      required: true,
      options: yearOptions,
    },
    {
      name: "end_year",
      label: "End Year",
      type: "autocomplete",
      required: true,
      options: yearOptions,
    },
    {
      name: "parliament_number",
      label: "Parliament Number",
      type: "text",
      required: true,
    },
    {
      name: "specific_start_month",
      label: "Specific Start Month",
      type: "select",

      required: true,
      options: months,
    },
    {
      name: "specific_end_month",
      label: "Specific End Month",
      type: "select",

      required: true,
      options: months,
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
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createParliamentaryTerms}
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
        fetchApiEndpoint={endpoints.getParliamentaryTermsSetups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Parliamentary Terms"
        currentTitle="Parliamentary Terms"
      />
    </div>
  );
};

export default ParliamentaryTerms;
