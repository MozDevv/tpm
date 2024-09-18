"use client";
import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";
import NoSeriesCard from "./NoSeriesCard";
import NumberingSections from "./NumberingSections";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "code",
    headerName: "Code",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },

  {
    field: "description",
    headerName: "Description",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const NoSeries = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      code: item.code,
      id: item.id,
      // name: item.name,
      description: transformString(item.description),
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
    numberingSections: () => setOpenNumberingSections(true),
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
    //  numberSeriesLine: () => setOpenAction(true),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [openNumberingSections, setOpenNumberingSections] =
    React.useState(false);

  const title = clickedItem
    ? "No. Series Details"
    : "Create New No. Series Details";

  const fields = [
    { name: "code", label: "Code", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
  ];

  const updatedFields = [
    ...fields,
    {
      name: "starting_no",
      label: "Starting No",
      type: "text",
    },
    {
      name: "ending_no",
      label: "Ending No",
      type: "text",
    },
    {
      name: "increment_by",
      label: "Increment By",
      type: "text",
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
    },
  ];

  const [openAction, setOpenAction] = React.useState(false);

  const numberSeriesLinefields = [
    {
      name: "startingDate",
      label: "Starting Date",
      type: "date",
    },
    {
      name: "startingNumber",
      label: "starting No",
      type: "text",
    },
    {
      name: "endingNumber",
      label: "End Number",
      type: "text",
    },
    {
      name: "lastDateUsed",
      label: "Last Date Used",
      type: "date",
    },
    {
      name: "lastNumberUsed",
      label: "Last Number Used",
      type: "number",
    },
    {
      name: "incrementByNumber",
      label: "Increment By",
      type: "number",
    },

    {
      name: "warningNumber",
      label: "Warning Number",
      type: "text",
    },

    {
      name: "allowGapsInNumbers",
      label: "Allow Gaps In Numbers",
      type: "switch",
      default: true,
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
        status={"numberSeriesLine"}
        setOpenAction={setOpenAction}
        openAction={openAction}
        fields={numberSeriesLinefields}
        apiEndpoint={endpoints.createNumberSeriesLine}
        postApiFunction={apiService.post}
        inputTitle="Create New Number Series Line"
        idLabel="numberSeriesId"
        useRequestBody={true}
      >
        {clickedItem ? (
          <NoSeriesCard
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
            apiEndpoint={endpoints.createNumberSeries}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseCard
        openBaseCard={openNumberingSections}
        setOpenBaseCard={setOpenNumberingSections}
        ///handlers={handlers}
        title={"Numbering Sections"}
        clickedItem={clickedItem}
        isUserComponent={false}
        fields={numberSeriesLinefields}
        apiEndpoint={endpoints.createNumberSeriesLine}
        postApiFunction={apiService.post}
        inputTitle="Create New Number Series Line"
        id={clickedItem?.id}
        idLabel="numberSeriesId"
        useRequestBody={true}
      >
        <NumberingSections />
      </BaseCard>
      <BaseTable
        openAction={openAction}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getNumberSeries}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="No. Series"
        currentTitle="No. Series"
      />
    </div>
  );
};

export default NoSeries;
