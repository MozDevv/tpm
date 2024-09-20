"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const GeneralProductPostingGroups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

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
      width: 250,
    },
    {
      field: "description",
      headerName: "Description",
      filter: true,
    },
    {
      field: "autoInsert",
      headerName: "Auto Insert",
      filter: true,
    },
    {
      field: "prodPostingGroupId",
      headerName: "Business Posting Group",
      filter: true,
      valueGetter: (params) => {
        const account = glAccounts?.find(
          (acc) => acc.id === params.data.prodPostingGroupId
        );
        return account?.name ?? "N/A";
      },
    },
  ];

  const [glAccounts, setGlAccounts] = React.useState([]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getProductPostingGroups,
        {
          "paging.pageSize": 150,
        }
      );

      setGlAccounts(
        response.data.data.map((ac) => ({
          id: ac.id,
          name: ac.name,
          description: ac.description,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts();
  }, []);

  const getAccountName = (id) => {
    return Array.isArray(glAccounts) && glAccounts
      ? glAccounts?.find((acc) => acc.id === id).name
      : "";
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      name: item.name,
      description: item.description,
      autoInsert: item.autoInsert,
      prodPostingGroupId: item.prodPostingGroupId,
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
    ? "General Product Posting Group"
    : "Create New General Product Posting Group";

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "autoInsert",
      label: "Auto Insert",
      type: "switch",
      required: true,
    },
    {
      name: "prodPostingGroupId",
      label: "Product Posting Group",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
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
        deleteApiEndpoint={financeEndpoints.deleteGeneralProductPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateGeneralProductPostingGroup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addGeneralProductPostingGroup}
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
        fetchApiEndpoint={financeEndpoints.getGeneralProductPostingGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Product Posting Groups"
        currentTitle="General Product Posting Groups"
      />
    </div>
  );
};

export default GeneralProductPostingGroups;
