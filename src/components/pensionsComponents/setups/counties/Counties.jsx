"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import BankCard from "../banks/BankCard";
import CountyCard from "./CountyCard";

const columnDefs = [
  {
    field: "county_code",
    headerName: "County Code",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "county_name",
    headerName: "County Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const Counties = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      county_code: item.county_code,
      county_name: item.county_name,
      constituencies: item.constituencies.map((constituency) => ({
        constituency_name: constituency.constituency_name,
        constituency_id: constituency.id,
      })),
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

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);

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
    createConstituency: () => {
      setDialogType("branch");
      setOpenAction(true);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? "County" : "Create New County";

  const [bankTypes, setBankTypes] = React.useState([]);
  const [countries, setCountries] = React.useState([]);

  const fetchCountries = async () => {
    try {
      const res = await apiService.get(endpoints.getCountries);

      setCountries(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const fields = [
    {
      name: "county_code",
      label: "County Code",
      type: "number",
      required: true,
    },
    {
      name: "county_name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "country_id",
      label: "Country",
      type: "select",
      options: countries.map((type) => ({
        id: type.id,
        name: type.country_name,
      })),
    },
  ];

  const branchFields = [
    {
      name: "constituency_name",
      label: "Constituency Name",
      type: "text",
      required: true,
    },
    {
      name: "country_id",
      label: "Country",
      type: "select",
      options: countries.map((type) => ({
        id: type.id,
        name: type.country_name,
      })),
    },
  ];

  const bankTypeFields = [
    { name: "type", label: "Bank Type", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
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
        status={"createConstituency"}
        setOpenAction={setOpenAction}
        openAction={openAction}
        fields={branchFields}
        apiEndpoint={endpoints.createConstituency}
        postApiFunction={apiService.post}
        inputTitle="Create New Constituency"
        idLabel="county_id"
        useRequestBody={true}
        dialogType={dialogType}
        // //
        // secondaryFields={bankTypeFields}
        // secondaryApiEndpoint={endpoints.createBankType}
        // secondaryPostApiFunction={apiService.post}
        // secondaryInputTitle="Create New Bank Type"
      >
        {clickedItem ? (
          <CountyCard
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
            apiEndpoint={endpoints.createCounty}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>
      <BaseTable
        openAction={openAction}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getCounties}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Counties"
        currentTitle="Counties"
      />
    </div>
  );
};

export default Counties;
