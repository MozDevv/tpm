"use client";
import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate, parseDate } from "@/utils/dateFormatter";

const PensionFactor = () => {
  const [pensionCaps, setPensionCaps] = useState([]);

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps, {
        paging: { pageNumber: 1, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setPensionCaps(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []);

  const columnDefs = [
    {
      field: "start_date",
      headerName: "Start Date",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
      pinned: "left",
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: "end_date",
      headerName: "End Date",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: "pension_cap_id",
      headerName: "Pension Cap ID",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        const pensionCap = pensionCaps.find(
          (pensionCap) => pensionCap.id === params.value
        );

        return pensionCap?.name || "";
      },
    },
    {
      field: "factor",
      headerName: "Factor",
      headerClass: "prefix-header",
      filter: true,
      flex: 1,
    },
  ];
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.roleId,

      start_date: item.start_date,
      end_date: item.end_date,
      pension_cap_id: item.pension_cap_id,
      factor: item.factor,
      // roles: item.roles,
    }));
  };

  const handlers = {
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
    ? "Pension Factor "
    : "Create a New Pension Factor ";

  const fields = [
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date", required: true },
    {
      name: "pension_cap_id",
      label: "Pension Cap",
      type: "select",
      required: true,
      options: pensionCaps.map((pensionCap) => ({
        id: pensionCap.id,
        name: pensionCap.name,
      })),
    },
    { name: "factor", label: "Factor", type: "number", required: true },
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
        deleteApiEndpoint={endpoints.deletePensionFactor(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updatePensionFactor}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createPensionFactor}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getPensionFactor}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Pension Factor Setups"
        currentTitle="Pension Factor Setups"
      />
    </div>
  );
};

export default PensionFactor;
