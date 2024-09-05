import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import EditableTable from "@/components/baseComponents/EditableTable";

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
    // Assuming you want a checkbox for boolean values
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
  // {
  //   field: "postal_code_id",
  //   headerName: "Postal Code",
  //   width: 120,
  //   filter: true,
  // },
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
    field: "bank_branch_name",
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
      const res = await apiService.get(endpoints.getBanks, {
        "paging.pageSize": 1000,
      });
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
      no: index + 1,
      maintainee_name: item.maintainee_name,
      national_id: item.national_id,
      kra_pin: item.kra_pin,
      email_address: item.email_address,
      phone_number: item.phone_number,
      postal_address: item.postal_address,
      postal_code_id: item.postal_code_id,
      gratuity_rate: item.gratuity_rate,
      monthly_pension_rate: item.monthly_pension_rate,
      bank_branch_name: item.bankBranch.name,
      bank_branch_id: item.bank_branch_id,
      account_number: item.account_number,
      account_name: item.account_name,
      created_date: item.created_date,
      bank_id: item.bankBranch.bank_id,
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

  const fields2 = [
    {
      name: "maintainee_name",
      label: "Name",
      type: "text",
      required: true,
      pinned: "left",
    },
    { name: "national_id", label: "National ID", type: "text", required: true },
    { name: "kra_pin", label: "KRA PIN", type: "text" },
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
      type: "autocomplete",
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
    { name: "bank_id", label: "Bank", type: "autocomplete", options: banks },
    {
      name: "bank_branch_id",
      label: "Bank Branch",
      options: branches.filter((branch) => branch.bankId === selectedBank),
      type: "select",
    },
    {
      name: "phone_number",
      label: "Phone Number",
      type: "string",
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

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getMaintenance(id.id));
      const data = res.data.data;
      setFilteredData(transformData(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);
  useEffect(() => {
    fetchMaintenance();
  }, [openBaseCard]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const saveRow = (data) => {
    console.log("Saved row data:", data);
  };
  const fields = [
    { title: "First Name", value: "firstName", type: "text" },
    { title: "Last Name", value: "lastName", type: "text" },
    { title: "ID", value: "id", type: "number" },
    { title: "Date of Birth", value: "dob", type: "date" },
    {
      title: "Role",
      value: "role",
      type: "select",
      options: ["Admin", "User", "Guest"],
    },
    { title: "Email", value: "email", type: "text" },
  ];

  // Initial row data
  const initialData = [
    {
      firstName: "John",
      lastName: "Doe",
      id: 1,
      dob: new Date(),
      role: 1,
      email: "john.doe@example.com",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      id: 2,
      dob: new Date(),
      role: 2,
      email: "jane.smith@example.com",
    },
  ];

  // Validator functions for each field
  const validators = {
    firstName: (value) => {
      if (!value || value.length < 2)
        return "First Name must be at least 2 characters.";
      return null;
    },
    lastName: (value) => {
      if (!value || value.length < 2)
        return "Last Name must be at least 2 characters.";
      return null;
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format.";
      return null;
    },
    id: (value) => {
      if (!value || isNaN(value)) return "ID must be a number.";
      return null;
    },
    dob: (value) => {
      if (!value || isNaN(new Date(value).getTime())) return "Invalid date.";
      return null;
    },
  };

  // Save function
  const handleSave = (data) => {
    console.log("Data saved:", data);
    // Perform save operation, such as API call or local storage update
  };

  // Update function for handling data changes
  const handleUpdate = (updatedData) => {
    console.log("Data updated:", updatedData);
    // Perform update operation, such as API call or state update
  };

  // Error handling function
  const handleError = (errorMessage, params) => {
    alert(`Error in field "${params.colDef.headerName}": ${errorMessage}`);
    // Additional error handling actions can be added here
  };
  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteMaintenance(id?.id)}
        deleteApiService={apiService.post}
        isSecondaryCard={true}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateMaintenance}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
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
            isBranch={false}
          />
        )}
      </BaseCard>

      <Button
        variant="contained"
        onClick={() => {
          setOpenBaseCard(true);
          setClickedItem(null);
        }}
        sx={{
          my: 2,
        }}
      >
        Add New Maintenance Case
      </Button>

      <div
        className="ag-theme-quartz"
        style={{
          height: "60vh",

          mt: "20px",

          overflowY: "auto",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredData}
          pagination={false}
          domLayout="autoHeight"
          alwaysShowHorizontalScroll={true}
          // paginationPageSize={pageSize}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            // onGridReady(params);
          }}
          // onPaginationChanged={(params) =>
          //   handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
          // }
          onRowClicked={(e) => {
            setOpenBaseCard(true);
            setClickedItem(e.data);
            // setUserClicked(e.data);
            //handleClickUser(e.data);
          }}
        />
      </div>
    </div>
  );
};

export default MaintenanceCase;
