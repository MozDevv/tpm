"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const OperationsSetups = () => {
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
      pinned: "left",
    },
    {
      field: "productPostingGroupId",
      headerName: "Product Posting Group",
      filter: true,
      valueGetter: (params) => {
        const account = glAccounts?.find(
          (acc) => acc.id === params.data.productPostingGroupId
        );
        return account?.name ?? "N/A";
      },
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
    const account =
      Array.isArray(glAccounts) && glAccounts.find((acc) => acc.id === id);
    return account ? account.name : "";
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      //   {
      //     "defaultBankAccount": "e15fb7e3-0fe0-4025-8d11-f9aee78a1d00",
      //     "defaultAwardPostingGroup": "228b00fb-d9cc-4fc7-b70e-ffc868ba91e1",
      //     "defaultBankPostingGroup": "65d367eb-0b66-4d08-b0d0-dd72404737af",
      //     "defaultGeneralPostingGroup": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //     "defaultVendorPostingGroup": "0fc5d9d1-12ef-4fde-8a2f-1f6529f8914a",
      //     "defaultCustomerPostingGroup": "904306df-901b-400d-a8dc-c7ec95f92e82",
      //     "defaultVatPostingGroup": "284b5c2c-4b1e-4396-bc43-dfb0d4ad3414",
      //     "defaultPaymentMethod": "f8b9fc36-5246-4bca-803a-7f609ad2a1a6"
      //   },

      //     id: item.id,
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
      name: "productPostingGroupId",
      label: "Product Posting Group",
      type: "autocomplete",
      required: false,
      options: glAccounts,
      table: true,
    },
    {
      name: "autoInsert",
      label: "Auto Insert",
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

export default OperationsSetups;
