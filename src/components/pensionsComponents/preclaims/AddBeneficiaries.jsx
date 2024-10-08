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
import BaseInputTable from "@/components/baseComponents/BaseInputTable";

const AddBeneficiaries = ({ id }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [departments, setDepartments] = useState([]); // [1]

  const [relationships, setRelationships] = useState([]);

  const fetchRelationships = async () => {
    try {
      const res = await apiService.get(endpoints.getBeneficiariesRelationShips);
      setRelationships(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, []);

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,

      is_spouse: item.is_spouse,
      is_guardian: item.is_guardian,
      prospective_pensioner_id: item.prospective_pensioner_id,
      surname: item.surname,
      first_name: item.first_name,
      other_name: item.other_name,
      identifier: item.identifier,
      identifier_type: item.identifier_type,
      relationship_id: item.relationship_id,
      mobile_number: item.mobile_number,
      address: item.address,
      email_address: item.email_address,
      city: item.city,
      status: item.status,
      guardian_id: item.guardian_id,
      parent_id: item.parent_id,
      dob: item.dob,
      gender: item.gender,
      date_of_death: item.date_of_death,
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

  const title = clickedItem ? "Beneficiary" : "Create a  Beneficiary";

  const fields2 = [
    {
      value: "relationship_id",
      label: "Relationship",
      type: "select",
      options: relationships.map((relationship) => ({
        id: relationship.id,
        name: relationship.name,
      })),
    },
    {
      value: "surname",
      label: "Surname",
      type: "text",
    },
    {
      value: "first_name",
      label: "First Name",
      type: "text",
    },
    {
      value: "other_name",
      label: "Other Name",
      type: "text",
    },
    {
      value: "dob",
      label: "Date of Birth",
      type: "date",
    },
    {
      value: "gender",
      label: "Gender",
      type: "select",
      options: [
        { id: 0, name: "Male" },
        { id: 1, name: "Female" },
      ],
    },

    {
      label: "Type Of Identification",
      value: "identifier_type",
      type: "select",
      options: [
        { id: 0, name: "National ID" },
        { id: 1, name: "Passport No" },
      ],
    },
    {
      value: "identifier",
      label: "National ID/Passport",
      type: "text",
    },
    {
      value: "email_address",
      label: "Email Address",
      type: "text",
    },
    {
      value: "mobile_number",
      label: "Mobile Number",
      type: "text",
    },
    // {
    //   value: "address",
    //   label: "Address",
    //   type: "text",
    // },

    // {
    //   value: "city",
    //   label: "City",
    //   type: "text",
    // },
    // {
    //   value: "status",
    //   label: "Status",
    //   type: "select",
    //   options: [
    //     { id: 0, name: "Active" },
    //     { id: 1, name: "Inactive" },
    //   ],
    // },
  ];

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

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

  return (
    <div className="relative">
      <div
        className="ag-theme-quartz"
        style={{
          height: "60vh",

          mt: "20px",

          overflowY: "auto",
        }}
      >
        <BaseInputTable
          title="Beneficiaries"
          fields={fields2}
          id={id}
          idLabel="prospective_pensioner_id"
          getApiService={apiService.get}
          postApiService={apiService.post}
          putApiService={apiService.put}
          apiService={apiService}
          deleteEndpoint={endpoints.deleteMaintenance(id)}
          getEndpoint={endpoints.getBeneficiaries(id)}
          postEndpoint={endpoints.createBeneficiary}
          putEndpoint={endpoints.updateMaintenance}
          passProspectivePensionerId={true}
        />
      </div>
    </div>
  );
};

export default AddBeneficiaries;
