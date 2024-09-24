"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const GeneralPostingGroups = () => {
  const [generalProductAcc, setGeneralProductAcc] = React.useState([]);
  const [generalBusinessAcc, setGeneralBusinessAcc] = React.useState([]);
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
      field: "generalProductPostingGroupId",
      headerName: "General Product Posting Group",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueFormatter: (params) =>
        generalProductAcc && generalProductAcc.length > 0
          ? generalProductAcc.find(
              (acc) => acc.id === params.data.generalProductPostingGroupId
            ).name
          : "N/A",
    },
    {
      field: "generalBusinessPostingGroupId",
      headerName: "General Business Posting Group",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueFormatter: (params) =>
        generalBusinessAcc && generalBusinessAcc.length > 0
          ? generalBusinessAcc.find(
              (acc) => acc.id === params.data.generalBusinessPostingGroupId
            ).name
          : "N/A",
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
      field: "salesAccount",
      headerName: "Sales Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.salesAccount),
    },
    {
      field: "salesCreditMemoAccount",
      headerName: "Sales Credit Memo Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getAccountName(params.data.salesCreditMemoAccount),
    },
    {
      field: "purchaseAccount",
      headerName: "Purchase Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) => getAccountName(params.data.purchaseAccount),
    },
    {
      field: "purchaseCreditMemoAccount",
      headerName: "Purchase Credit Memo Account",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
      valueGetter: (params) =>
        getAccountName(params.data.purchaseCreditMemoAccount),
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
      description: transformString(item.description),
      blocked: item.blocked,
      viewAll: item.viewAll,
      salesAccount: item.salesAccount,
      salesCreditMemoAccount: item.salesCreditMemoAccount,
      purchaseAccount: item.purchaseAccount,
      purchaseCreditMemoAccount: item.purchaseCreditMemoAccount,
      generalProductPostingGroupId: item.generalProductPostingGroupId,
      generalBusinessPostingGroupId: item.generalBusinessPostingGroupId,
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

  useEffect(() => {
    const fetchGeneralPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getGeneralProductPostingGroups,
          {
            "paging.pageSize": 150,
          }
        );

        const data = response.data.data;

        setGeneralProductAcc(
          data.map((acc) => ({
            id: acc.id,
            name: acc.name,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGeneralBusinessPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getGeneralBusinessPostingGroups,
          {
            "paging.pageSize": 150,
          }
        );

        const data = response.data.data;

        setGeneralBusinessAcc(
          data.map((acc) => ({
            id: acc.id,
            name: acc.name,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchGeneralPostingGroups();
    fetchGeneralBusinessPostingGroups();
  }, []);

  const title = clickedItem
    ? "General Posting Group"
    : "Create New General Posting Group";

  const fields = [
    {
      name: "generalProductPostingGroupId",
      label: "General Product Posting Group",
      type: "select",
      required: true,
      options: generalProductAcc,
    },
    {
      name: "generalBusinessPostingGroupId",
      label: "General Business Posting Group",
      type: "select",
      required: true,
      options: generalBusinessAcc,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },

    {
      name: "salesAccount",
      label: "Sales Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "salesCreditMemoAccount",
      label: "Sales Credit Memo Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "purchaseAccount",
      label: "Purchase Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "purchaseCreditMemoAccount",
      label: "Purchase Credit Memo Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },

    { name: "viewAll", label: "View All", type: "switch", required: true },
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
        deleteApiEndpoint={financeEndpoints.deleteGeneralPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateGeneralPostingGroup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addGeneralPostingGroup}
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
        fetchApiEndpoint={financeEndpoints.getGeneralPostingGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="General Posting Groups"
        currentTitle="General Posting Groups"
      />
    </div>
  );
};

export default GeneralPostingGroups;
