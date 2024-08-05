"use client";
import React, { use, useEffect } from "react";

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
    field: "code",
    headerName: "Postal Code",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "name",
    headerName: "Name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "county_name",
    headerName: "County Name",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
  },
  {
    field: "county_code",
    headerName: "County Code",
    headerClass: "prefix-header",
    filter: true,
    width: 100,
    hide: true,
  },
];

const PostalCodes = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      code: item.code,
      name: item.name,
      county_name: item.county.county_name,
      county_code: item.county.county_code,
      countyId: item.countyId,
      //  constituency: item?.constituencies[0]?.constituency_name,
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
  const [counties, setCounties] = React.useState([]);

  const title = clickedItem ? "Postal Code" : "Create New Postal Address";

  const fetchCounties = async () => {
    try {
      const response = await apiService.get(endpoints.getCounties, {
        "paging.pageSize": 1000,
      });
      setCounties(response.data.data);
    } catch (error) {
      console.log("Error fetching counties", error);
    }
  };
  useEffect(() => {
    fetchCounties();
  }, []);

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "code", label: "Postal Code", type: "text", required: true },
    {
      name: "countyId",
      label: "County",
      type: "select",
      required: true,
      options: counties.map((county) => ({
        id: county.id,
        name: county.county_name,
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
        deleteApiEndpoint={endpoints.deletePostalCode(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.editPostalCode}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createPostalCode}
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
        fetchApiEndpoint={endpoints.getPostalCodes}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Postal Codes"
        currentTitle="Postal Codes"
      />
    </div>
  );
};

export default PostalCodes;
