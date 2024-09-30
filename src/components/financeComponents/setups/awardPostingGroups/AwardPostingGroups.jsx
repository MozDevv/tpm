"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import { apiService } from "@/components/services/financeApi";
import { formatDate } from "@/utils/dateFormatter";
import financeEndpoints from "@/components/services/financeApi";

const AwardPostingGroups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [pensionAwards, setPensionAwards] = React.useState([]);

  const [glAccounts, setGlAccounts] = React.useState([]);
  const columnDefs = [
    {
      field: "code",
      headerName: "Code",
      filter: true,
      flex: 1,
      pinned: "left",
    },
    {
      field: "description",
      headerName: "Description",
      filter: true,
      flex: 1,
    },
    {
      field: "pensionAwardId",
      headerName: "Pension Award",
      filter: true,
      flex: 1,
      valueGetter: (params) => {
        const account = pensionAwards?.find(
          (acc) => acc.id === params.data.pensionAwardId
        );
        return account?.name ?? "N/A";
      },
    },
    {
      field: "pensionExpenseAccount",
      headerName: "Pension Expense Account",
      filter: true,
      flex: 1,
      valueGetter: (params) =>
        getAccountName(params.data.pensionExpenseAccount),
    },
    {
      field: "gratiutyExpenseAccount",
      headerName: "Gratiuty Expense Account",
      filter: true,
      flex: 1,
      valueGetter: (params) =>
        getAccountName(params.data.gratiutyExpenseAccount),
    },
    {
      field: "pensionLiabilityAccount",
      headerName: "Pension Liability Account",
      filter: true,
      flex: 1,
      valueGetter: (params) =>
        getAccountName(params.data.pensionLiabilityAccount),
    },
    {
      field: "gratiutyLiabilityAccount",
      headerName: "Gratiuty Liability Account",
      filter: true,
      flex: 1,
      valueGetter: (params) =>
        getAccountName(params.data.gratiutyLiabilityAccount),
    },
  ];

  const fetchGlAccounts = async () => {
    try {
      const response = await apiService.get(financeEndpoints.fetchGlAccounts, {
        "paging.pageSize": 1000,
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

  const fetchPensionAwards = async () => {
    try {
      const response = await apiService.get(financeEndpoints.getPensionAwards, {
        "paging.pageSize": 200,
      });

      const awards = response.data.data.map((ac) => ({
        id: ac.id,
        name: ac.prefix,
      }));
      setPensionAwards(awards);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlAccounts();
    fetchPensionAwards();
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
      code: item.code,
      description: item.description,
      pensionAwardId: item.pensionAwardId,
      pensionExpenseAccount: item.pensionExpenseAccount,
      gratiutyExpenseAccount: item.gratiutyExpenseAccount,
      pensionLiabilityAccount: item.pensionLiabilityAccount,
      gratiutyLiabilityAccount: item.gratiutyLiabilityAccount,
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
    ? "Award Posting Group"
    : "Create New Award Posting Group";

  const fields = [
    {
      name: "code",
      label: "Code",
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
      name: "pensionExpenseAccount",
      label: "Pension Expense Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "pensionAwardId",
      label: "Pension Award",
      type: "select",
      required: true,
      options: pensionAwards,
    },
    {
      name: "gratiutyExpenseAccount",
      label: "Gratuity Expense Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "pensionLiabilityAccount",
      label: "Pension Liability Account",
      type: "select",
      required: true,
      options: glAccounts,
      table: true,
    },
    {
      name: "gratiutyLiabilityAccount",
      label: "Gratiuty Liability Account",
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
        deleteApiEndpoint={financeEndpoints.deleteAwardPostingGroup(
          clickedItem?.id
        )}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.updateAwardPostingGroup}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addAwardPostingGroup}
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
        fetchApiEndpoint={financeEndpoints.getAwardPostingGroups}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Award Posting Groups"
        currentTitle="Award Posting Groups"
      />
    </div>
  );
};

export default AwardPostingGroups;
