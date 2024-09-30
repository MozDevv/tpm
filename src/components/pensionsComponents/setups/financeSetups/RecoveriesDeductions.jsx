"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";
import { name } from "dayjs/locale/en-au";

const RecoveriesDeductions = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const columnDefs = [
    {
      field: "itemName",
      headerName: "Item Name",
      headerClass: "prefix-header",
      filter: true,
      pinned: "left",
    },
    {
      field: "description",
      headerName: "Description",
      headerClass: "prefix-header",
      filter: true,
    },
    {
      field: "type",
      headerName: "Type",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => {
        const values = [
          { id: 0, name: "Refund" },
          { id: 1, name: "Deduction" },
        ];

        return values.find((val) => val.id === params.data.type)?.name;
      },
    },
    {
      field: "glAccountId",
      headerName: "GL Account",
      headerClass: "prefix-header",
      filter: true,
      valueGetter: (params) => getAccountName(params.data.glAccountId),
    },
    {
      field: "isMdaRecovery",
      headerName: "Is MDA Recovery",
      headerClass: "prefix-header",
      filter: true,
    },
    {
      field: "isPensioner",
      headerName: "Is Pensioner",
      headerClass: "prefix-header",
      filter: true,
    },
  ];

  const [glAccounts, setGlAccounts] = React.useState([]);

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        "paging.pageSize": 150,
      });

      const accounts = response.data.data.filter(
        (acc) => acc.accountTypeName === "POSTING"
      );

      setGlAccounts(
        accounts.map((account) => ({
          id: account.id,
          name: account.accountNo,
          accountNo: account.accountName,
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
      id: item.id,
      itemName: item.itemName,
      description: item.description,
      glAccountId: item.glAccountId,
      isMdaRecovery: item.isMdaRecovery,
      isPensioner: item.isPensioner,
      type: item.type,
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
    ? "Recovery/Deduction"
    : "Create New Recovery/Deduction";

  const fields = [
    {
      name: "itemName",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },

    {
      name: "glAccountId",
      label: "GL Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { id: 0, name: "Refund" },
        { id: 1, name: "Deduction" },
      ],
    },
    {
      name: "isMdaRecovery",
      label: "Is MDA Recovery",
      type: "switch",
      required: true,
    },
    {
      name: "isPensioner",
      label: "Is Pensioner",
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
        deleteApiEndpoint={financeEndpoints.deleteRecoveryDeduction(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateRecoveryDeduction}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addRecoveryDeduction}
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
        fetchApiEndpoint={financeEndpoints.getRecoveryDeductions}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Recoveries & Deductions"
        currentTitle="Recoveries & Deductions"
      />
    </div>
  );
};

export default RecoveriesDeductions;
