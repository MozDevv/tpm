import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";
import { Button } from "@mui/material";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
  },
  {
    field: "maintainee_name",
    headerName: "Name",
    width: 150,
    filter: true,
  },
  {
    field: "national_id",
    headerName: "National ID",
    width: 150,
    filter: true,
  },
  {
    field: "kra_pin",
    headerName: "KRA PIN",
    width: 120,
    filter: true,
    cellRenderer: "checkboxRenderer", // Assuming you want a checkbox for boolean values
  },
  {
    field: "email_address",
    headerName: "Email Address",
    width: 200,
    filter: true,
  },
  {
    field: "phone_number",
    headerName: "Phone Number",
    width: 150,
    filter: true,
  },
  {
    field: "postal_address",
    headerName: "Postal Address",
    width: 200,
    filter: true,
  },
  {
    field: "postal_code_id",
    headerName: "Postal Code",
    width: 120,
    filter: true,
  },
  {
    field: "gratuity_rate",
    headerName: "Gratuity Rate",
    width: 120,
    filter: true,
    cellRenderer: "checkboxRenderer", // Checkbox for boolean values
  },
  {
    field: "monthly_pension_rate",
    headerName: "Monthly Pension Rate",
    width: 150,
    filter: true,
  },
  {
    field: "bank_branch_id",
    headerName: "Bank Branch",
    width: 150,
    filter: true,
  },
  {
    field: "account_number",
    headerName: "Account Number",
    width: 150,
    filter: true,
  },
  {
    field: "account_name",
    headerName: "Account Name",
    width: 150,
    filter: true,
  },
];

const MaintenanceCase = (id) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks);
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log("Error fetching banks and branches:", error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,
      //   no: index + 1 + (pageNumber - 1) * pageSize,
      maintainee_name: item.maintainee_name,
      national_id: item.national_id,
      kra_pin: item.kra_pin,
      email_address: item.email_address,
      phone_number: item.phone_number,
      postal_address: item.postal_address,
      postal_code_id: item.postal_code_id,
      gratuity_rate: item.gratuity_rate,
      monthly_pension_rate: item.monthly_pension_rate,
      bank_branch_id: item.bank_branch_id,
      account_number: item.account_number,
      account_name: item.account_name,
      created_date: item.created_date,
    }));
  };

  //

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [selectedBank, setSelectedBank] = React.useState(null);
  const [postalAddress, setPostalAddress] = useState([]);

  const fetchPostalAddress = async () => {
    try {
      const res = await apiService.get(endpoints.getPostalCodes, {
        "paging.pageSize": 1000,
      });
      setPostalAddress(res.data.data);
    } catch (error) {
      console.error("Error fetching Postal Address:", error);
    }
  };

  useEffect(() => {
    fetchPostalAddress();
  }, []);

  const title = clickedItem ? "Maintenance Case" : "Create a  Maintenance Case";

  const fields = [
    {
      name: "maintainee_name",
      label: "Name",
      type: "text",
      required: true,
      pinned: "left",
    },
    { name: "national_id", label: "National ID", type: "text", required: true },
    { name: "kra_pin", label: "KRA PIN", type: "number" },
    {
      name: "email_address",
      label: "Email Address",
      type: "email",
      required: true,
    },
    // {
    //   name: "phone_number",
    //   label: "Phone Number",
    //   type: "number",
    //   required: true,
    // },
    { name: "postal_address", label: "Postal Address", type: "number" },
    {
      name: "postal_code_id",
      label: "Postal Code",
      type: "select",
      options: postalAddress.map((address) => ({
        id: address.id,
        name: address.code,
      })),
    },
    { name: "gratuity_rate", label: "Gratuity Rate", type: "number" },
    {
      name: "monthly_pension_rate",
      label: "Monthly Pension Rate",
      type: "number",
    },
    { name: "bank_id", label: "Bank", type: "select", options: banks },
    {
      name: "bank_branch_id",
      label: "Bank Branch",
      options: branches.filter((branch) => branch.bankId === selectedBank),
      type: "select",
    },
    {
      name: "account_number",
      label: "Account Number",
      type: "text",
      required: true,
    },
    {
      name: "account_name",
      label: "Account Name",
      type: "text",
      required: true,
    },
  ];

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="mt-[-60px] relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteMaintenance(clickedItem?.id)}
        deleteApiService={apiService.post}
        isSecondaryCard={true}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateMaintenance(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={false}
          />
        ) : (
          <BaseInputCard
            id={id}
            idLabel="prospective_pensioner_id"
            fields={fields}
            setSelectedBank={setSelectedBank}
            apiEndpoint={endpoints.createMaintenance}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        )}
      </BaseCard>

      <Button
        variant="contained"
        onClick={() => {
          setOpenBaseCard(true);
          setClickedItem(null);
        }}
        sx={{ position: "absolute", top: 65, left: 0 }}
      >
        Add New Maintenance Case
      </Button>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        handlers={{}}
        isMaintenance={true}
        id={id}
        fetchApiEndpoint={endpoints.maintenanceCase}
        fetchApiService={apiService.post}
        transformData={transformData}
        isSecondaryTable={true}
        pageSize={30}
      />
    </div>
  );
};

export default MaintenanceCase;
