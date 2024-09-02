import React from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "requiredLength",
    headerName: "Required Length",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requiredUniqueChars",
    headerName: "Required Unique Chars",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requireNonAlphanumeric",
    headerName: "Require Non Alphanumeric",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requireUppercase",
    headerName: "Require Uppercase",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requireLowercase",
    headerName: "Require Lowercase",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "passExpieryDurationInDays",
    headerName: "Pass Expiery Duration In Days",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requiredUppercaseCount",
    headerName: "Required Uppercase Count",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requiredLowercaseCount",
    headerName: "Required Lowercase Count",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requiredDigitCount",
    headerName: "Required Digit Count",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "requireDigit",
    headerName: "Require Digit",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "isActive",
    headerName: "Is Active",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
  {
    field: "defaultPasswordGracePeriod",
    headerName: "Default Password Grace Period",
    headerClass: "prefix-header",
    filter: true,
    width: 250,
  },
];

const PasswordRules = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.passwordRulesId,
      requiredLength: item.requiredLength,
      requiredUniqueChars: item.requiredUniqueChars,
      requireNonAlphanumeric: item.requireNonAlphanumeric,
      requireUppercase: item.requireUppercase,
      requireLowercase: item.requireLowercase,
      passExpieryDurationInDays: item.passExpieryDurationInDays,
      requiredUppercaseCount: item.requiredUppercaseCount,
      requiredLowercaseCount: item.requiredLowercaseCount,
      requiredDigitCount: item.requiredDigitCount,
      requireDigit: item.requireDigit,
      isActive: item.isActive,
      defaultPasswordGracePeriod: item.defaultPasswordGracePeriod,
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

  const title = clickedItem ? "Password Rule" : "Create New Password Rule";

  const fields = [
    {
      name: "requiredLength",
      label: "Required Length",
      type: "number",
      required: true,
    },
    {
      name: "requiredUniqueChars",
      label: "Required Unique Chars",
      type: "number",
      required: true,
    },
    {
      name: "passExpieryDurationInDays",
      label: "Pass Expiery Duration In Days",
      type: "number",
      required: true,
    },
    {
      name: "defaultPasswordGracePeriod",
      label: "Default Password Grace Period",
      type: "number",
      required: true,
    },
    {
      name: "requiredUppercaseCount",
      label: "Required Uppercase Count",
      type: "number",
      required: true,
    },
    {
      name: "requiredLowercaseCount",
      label: "Required Lowercase Count",
      type: "number",
      required: true,
    },
    {
      name: "requiredDigitCount",
      label: "Required Digit Count",
      type: "number",
      required: true,
    },
    {
      name: "requireDigit",
      label: "Require Digit",
      type: "switch",
      required: true,
    },
    {
      name: "requireNonAlphanumeric",
      label: "Require Non Alphanumeric",
      type: "switch",
      required: true,
    },
    {
      name: "requireUppercase",
      label: "Require Uppercase",
      type: "switch",
      required: true,
    },
    {
      name: "requireLowercase",
      label: "Require Lowercase",
      type: "switch",
      required: true,
    },

    {
      name: "isActive",
      label: "Is Active",
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
        deleteApiEndpoint={endpoints.deletePasswordRules(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updatePasswordRules(clickedItem.id)}
            postApiFunction={apiService.post}
            id={clickedItem?.id}
            idLabel="passwordRulesId"
            clickedItem={clickedItem}
            isBranch={true}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createPasswordRules}
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
        fetchApiEndpoint={endpoints.getPasswordRules}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Password Rules"
        currentTitle="Password Rules"
      />
    </div>
  );
};

export default PasswordRules;
