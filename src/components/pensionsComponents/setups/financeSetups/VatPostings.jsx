"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const VatPostings = () => {
  const columnDefs = [
    {
      field: "no",
      headerName: "No",
      headerClass: "prefix-header",
      width: 90,
      filter: true,
    },

    {
      field: "description",
      headerName: "Description",
      filter: true,
    },
    {
      field: "vatIdentifier",
      headerName: "Vat Identifier",
      filter: true,
    },
    {
      field: "vatPercentage",
      headerName: "Vat Percentage",
      filter: true,
    },
    {
      field: "vatCalculationType",
      headerName: "Vat Calculation Type",
      filter: true,
    },
    {
      field: "salesVATAccountId",
      headerName: "Sales Vat Account",
      filter: true,
      valueGetter: (params) => getAccountName(params.data.salesVATAccountId),
    },
    {
      field: "purchaseVATAccountId",
      headerName: "Purchase Vat Account",
      filter: true,
      valueGetter: (params) => getAccountName(params.data.purchaseVATAccountId),
    },
    {
      field: "reverseChargeVATAccountId",
      headerName: "Reverse Charge Vat Account",
      filter: true,
      valueGetter: (params) =>
        getAccountName(params.data.reverseChargeVATAccountId),
    },
    {
      field: "vatClauseCode",
      headerName: "Vat Clause Code",
      filter: true,
    },
    {
      field: "taxCategory",
      headerName: "Tax Category",
      filter: true,
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

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
          name: account.accountName,
          accountNo: account.accountNo,
          amount: account.amount,
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

      description: item.description,
      vatIdentifier: item.vatIdentifier,
      vatPercentage: item.vatPercentage,
      vatCalculationType: item.vatCalculationType,
      salesVATAccountId: item.salesVATAccountId,
      purchaseVATAccountId: item.purchaseVATAccountId,
      reverseChargeVATAccountId: item.reverseChargeVATAccountId,
      vatClauseCode: item.vatClauseCode,
      taxCategory: item.taxCategory,
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

  const title = clickedItem ? "VAT Posting " : "Create New VAT Posting Group";

  const fields = [
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },

    {
      name: "vatIdentifier",
      label: "VAT Identifier",
      type: "text",
      required: true,
    },
    {
      name: "vatPercentage",
      label: "VAT Percentage",
      type: "text",
      required: true,
    },
    {
      name: "vatCalculationType",
      label: "VAT Calculation Type",
      type: "number",
      required: true,
    },
    {
      name: "salesVATAccountId",
      label: "Sales Vat Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "purchaseVATAccountId",
      label: "Purchase VAT Account",
      type: "select",
      required: true,
      options: glAccounts.map((account) => ({
        id: account.id,
        name: account.name,
        accountNo: account.accountNo,
        amount: account.amount,
      })),
      table: true,
    },
    {
      name: "reverseChargeVATAccountId",
      label: "Reverse Charge Vat Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "vatClauseCode",
      label: "Vat Clause Code",
      type: "text",
      required: true,
    },
    {
      name: "taxCategory",
      label: "Tax Category",
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
        deleteApiEndpoint={financeEndpoints.deleteVatSetup(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateVatSetup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addVatSetup}
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
        fetchApiEndpoint={financeEndpoints.getVatSetups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="VAT Posting Group"
        currentTitle="VAT Posting Group"
      />
    </div>
  );
};

export default VatPostings;
