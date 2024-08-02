"use client";
import React, { useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import BankCard from "./BankCard";

const columnDefs = [
  {
    field: "code",
    headerName: "Branch Code",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "name",
    headerName: "name",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "bank_type_name",
    headerName: "Bank Type",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const Banks = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      bank_type_id: item.bankType.id,
      bank_type_name: item.bankType.type,
      swift_code: item.swift_code,
      branches: item.branches.map((branch) => ({
        branch_code: branch.branch_code,
        name: branch.name,
        address: branch.address,
        branch_id: branch.id,
      })),
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

  const [openAction, setOpenAction] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(false);

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
    createBranch: () => {
      setDialogType("branch");
      setOpenAction(true);
    },
    createBankType: () => {
      setDialogType("bankType");
      setOpenAction(true);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? "Bank" : "Create New Bank";

  const [bankTypes, setBankTypes] = React.useState([]);

  const fetchBankTypes = async () => {
    try {
      const response = await apiService.get(endpoints.getBankTypes);
      setBankTypes(response.data.data);
    } catch (error) {
      console.error("Failed to fetch bank types", error);
    }
  };

  useEffect(() => {
    fetchBankTypes();
  }, [openBaseCard]);

  const fields = [
    { name: "code", label: "Bank Code", type: "number", required: true },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    { name: "swift_code", label: "Swift Code", type: "text", required: true },
    {
      name: "bank_type_id",
      label: "Bank Type",
      type: "select",
      options: bankTypes.map((type) => ({ id: type.id, name: type.type })),
    },
  ];

  const branchFields = [
    { name: "branch_code", label: "Branch Code", type: "text", required: true },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
  ];

  const bankTypeFields = [
    { name: "type", label: "Bank Type", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
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
        status={"createBranch"}
        setOpenAction={setOpenAction}
        openAction={openAction}
        fields={branchFields}
        apiEndpoint={endpoints.createBankBranch}
        postApiFunction={apiService.post}
        inputTitle="Create New Branch"
        idLabel="bank_id"
        useRequestBody={true}
        dialogType={dialogType}
        //
        secondaryFields={bankTypeFields}
        secondaryApiEndpoint={endpoints.createBankType}
        secondaryPostApiFunction={apiService.post}
        secondaryInputTitle="Create New Bank Type"
      >
        {clickedItem ? (
          <BankCard
            fields={fields}
            apiEndpoint={endpoints.editPensionAwards}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createBank}
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
        fetchApiEndpoint={endpoints.getBanks}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Banks"
        currentTitle="Banks"
      />
    </div>
  );
};

export default Banks;
