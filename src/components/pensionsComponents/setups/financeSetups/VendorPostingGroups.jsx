"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const VendorPostingGroups = () => {
  const columnDefs = [
    {
      field: "no",
      headerName: "No",
      headerClass: "prefix-header",
      width: 90,
      filter: true,
    },
    {
      field: "groupName",
      headerName: "Group Name",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "description",
      headerName: "Description",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "viewAll",
      headerName: "View All",
      headerClass: "prefix-header",
      filter: true,
      width: 100,
    },
    {
      field: "payableAccount",
      headerName: "Payable Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.payableAccount),
    },

    {
      field: "serviceChargeAccount",
      headerName: "Service Charge Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.serviceChargeAccount),
    },
    {
      field: "invoiceRoundingAccount",
      headerName: "Invoice Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getAccountName(params.data.invoiceRoundingAccount),
    },
    {
      field: "drCurrencyRoundingAccount",
      headerName: "Debit Currency Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getAccountName(params.data.drCurrencyRoundingAccount),
    },
    {
      field: "crCurrencyRoundingAccount",
      headerName: "Credit Currency Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getAccountName(params.data.crCurrencyRoundingAccount),
    },
    {
      field: "drRoundingAccount",
      headerName: "Debit Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.drRoundingAccount),
    },
    {
      field: "crRoundingAccount",
      headerName: "Credit Rounding Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.crRoundingAccount),
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
      groupName: item.groupName,
      description: transformString(item.description),
      viewAll: item.viewAll,
      payableAccount: item.payableAccount,
      serviceChargeAccount: item.serviceChargeAccount,
      invoiceRoundingAccount: item.invoiceRoundingAccount,
      drCurrencyRoundingAccount: item.drCurrencyRoundingAccount,
      crCurrencyRoundingAccount: item.crCurrencyRoundingAccount,
      drRoundingAccount: item.drRoundingAccount,
      crRoundingAccount: item.crRoundingAccount,
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
    ? "Vendor Posting Group"
    : "Create New Vendor Posting Group";

  const fields = [
    { name: "groupName", label: "Group Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    { name: "viewAll", label: "View All", type: "switch", required: true },
    {
      name: "payableAccount",
      label: "Payable Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "serviceChargeAccount",
      label: "Service Charge Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "invoiceRoundingAccount",
      label: "Invoice Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "drCurrencyRoundingAccount",
      label: "Dr Currency Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "crCurrencyRoundingAccount",
      label: "Cr Currency Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "drRoundingAccount",
      label: "Dr Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
    },
    {
      name: "crRoundingAccount",
      label: "Cr Rounding Account",
      type: "select",
      required: true,
      options: glAccounts,
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
        deleteApiEndpoint={financeEndpoints.deleteVendorPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateVendorPostingGroup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addVendorPostingGroup}
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
        fetchApiEndpoint={financeEndpoints.getVendorPostingGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Vendor Posting Group"
        currentTitle="Vendor Posting Group"
      />
    </div>
  );
};

export default VendorPostingGroups;
