"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

import { API_BASE_URL } from "@/components/services/setupsApi";

import axios from "axios";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "customerEmail",
    headerName: "Customer Email",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "customerPhoneNumber",
    headerName: "Customer Phone Number",
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

const Customers = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      customerName: item.customerName,
      customerEmail: item.customerEmail,
      customerPhoneNumber: item.customerPhone,
      countryId: item.customerCountry,
      cityId: item.customerCity,

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
  const [countries, setCountries] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Setups/GetCountries`, {
        "paging.pageSize": 100,
      });

      setCountries(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Setups/GetCity`, {
        "paging.pageSize": 100,
      });

      setCities(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchCities();
  }, []);

  const title = clickedItem ? clickedItem?.customerName : "Create New Customer";

  const [vendorPG, setVendorPG] = React.useState([]);

  const fetchPostingGroups = async () => {
    try {
      const res = await apiService.get(
        financeEndpoints.getCustomerPostingGroup,
        {
          "paging.pageSize": 1000,
        }
      );
      setVendorPG(
        res.data.data.map((item) => {
          return {
            id: item.id,
            name: item.groupCode,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostingGroups();
  }, []);

  const fields = [
    {
      name: "customerName",
      label: "Customer Name",
      type: "text",
      required: true,
    },
    {
      name: "customerEmail",
      label: "Customer Email",
      type: "text",
      required: true,
    },

    {
      name: "customerPhoneNumber",
      label: "Customer Phone Number",
      type: "text",
    },
    {
      name: "customerPostingGroupId",
      label: "Customer Posting Group",
      type: "select",
      required: true,
      options: vendorPG,
    },
    {
      name: "countryId",
      label: "Country",
      type: "select",
      options: countries.map((type) => ({
        id: type.id,
        name: type.country_name,
      })),
    },
    {
      name: "cityId",
      label: "City",
      type: "select",
      options: cities.map((type) => ({
        id: type.id,
        name: type.city_name,
      })),
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
        deleteApiEndpoint={financeEndpoints.deleteCustomer(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateCustomer}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addCustomer}
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
        fetchApiEndpoint={financeEndpoints.getCustomers}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Customers"
        currentTitle="Customers"
      />
    </div>
  );
};

export default Customers;
