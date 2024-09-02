"use client";
import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
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
    field: "vendorName",
    headerName: "Vendor Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "vendorEmail",
    headerName: "Vendor Email",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "vendorPhoneNumber",
    headerName: "Vendor Phone Number",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "countryId",
    headerName: "Country",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "cityId",
    headerName: "City",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
];

const Vendor = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.departmentId,
      vendorName: item.vendorName,
      vendorEmail: item.vendorEmail,
      vendorPhoneNumber: item.vendorPhoneNumber,
      countryId: item.countryId,
      cityId: item.cityId,

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

  const title = clickedItem ? clickedItem?.vendorName : "Create New Vendor";

  const fields = [
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text",
      required: true,
    },
    {
      name: "vendorEmail",
      label: "Vendor Email",
      type: "text",
      required: true,
    },
    {
      name: "vendorPhoneNumber",
      label: "Vendor Phone Number",
      type: "text",
      required: true,
    },
    {
      name: "countryId",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "cityId",
      label: "City",
      type: "text",
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
        deleteApiEndpoint={financeEndpoints.deleteVendor(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateVendor(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addVendor}
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
        fetchApiEndpoint={endpoints.getVendors}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Vendor"
        currentTitle="Vendor"
      />
    </div>
  );
};

export default Vendor;
