import React, { useEffect, useState } from "react";
import { Table, Button as AntButton } from "antd";
import { Button, DialogContent, DialogActions } from "@mui/material";
import EditBeneficiaryDialog from "./EditBeneficiaryDialog";

import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";

function ViewBeneficiaries({
  viewBeneficiaries,
  setViewBeneficiaries,
  clickedItem,
}) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const getBeneficiaries = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getBeneficiaries(clickedItem.id)
      );
      setBeneficiaries(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [clickedItem]);

  const columns = [
    {
      title: "Relationship",
      dataIndex: ["relationship", "name"],
      key: "relationship_name",
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Other Name",
      dataIndex: "other_name",
      key: "other_name",
    },
    {
      title: "Identifier",
      dataIndex: "identifier",
      key: "identifier",
    },
    {
      title: "Identifier Type",
      dataIndex: "identifier_type",
      key: "identifier_type",
      render: (text) => (text === 0 ? "National ID" : "Passport No."),
    },
    {
      title: "National ID",
      dataIndex: "national_id",
      key: "national_id",
    },

    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email Address",
      dataIndex: "email_address",
      key: "email_address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Date of Death",
      dataIndex: "date_of_death",
      key: "date_of_death",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Guardian Surname",
      dataIndex: ["guardian", "surname"],
      key: "guardian_surname",
    },
    {
      title: "Guardian First Name",
      dataIndex: ["guardian", "first_name"],
      key: "guardian_first_name",
    },
    {
      title: "Guardian Identifier",
      dataIndex: ["guardian", "identifier"],
      key: "guardian_identifier",
    },
    {
      title: "Guardian Mobile Number",
      dataIndex: ["guardian", "mobile_number"],
      key: "guardian_mobile_number",
    },
    {
      title: "Guardian Address",
      dataIndex: ["guardian", "address"],
      key: "guardian_address",
    },
    {
      title: "Guardian Email Address",
      dataIndex: ["guardian", "email_address"],
      key: "guardian_email_address",
    },
    {
      title: "Guardian City",
      dataIndex: ["guardian", "city"],
      key: "guardian_city",
    },
    {
      title: "Guardian Relationship",
      dataIndex: ["guardian", "relationship_id"],
      key: "guardian_relationship_id",
    },
  ];

  const expandedRowRender = (record) => {
    const childColumns = [
      {
        title: "Surname",
        dataIndex: "surname",
        key: "surname",
      },
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Other Name",
        dataIndex: "other_name",
        key: "other_name",
      },
      {
        title: "Identifier",
        dataIndex: "identifier",
        key: "identifier",
      },
      {
        title: "Identifier Type",
        dataIndex: "identifier_type",
        key: "identifier_type",
        render: (text) => (text === 0 ? "National ID" : "Other"),
      },
      {
        title: "National ID",
        dataIndex: "national_id",
        key: "national_id",
      },
      {
        title: "Relationship",
        dataIndex: ["relationship", "name"],
        key: "relationship_name",
        //render: (text) => <Button variant="outlined" sx={{color: text ? 'Wife' : '#f39c12'? text ? 'Husband': "#970FF2" ? text=== 'Son' ? "#1abc9c"  }}>{text}</Button>,
      },
      {
        title: "Mobile Number",
        dataIndex: "mobile_number",
        key: "mobile_number",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Email Address",
        dataIndex: "email_address",
        key: "email_address",
      },
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Date of Birth",
        dataIndex: "dob",
        key: "dob",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Date of Death",
        dataIndex: "date_of_death",
        key: "date_of_death",
        render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
      },
      {
        title: "Guardian Surname",
        dataIndex: ["guardian", "surname"],
        key: "guardian_surname",
      },
      {
        title: "Guardian First Name",
        dataIndex: ["guardian", "first_name"],
        key: "guardian_first_name",
      },
      {
        title: "Guardian Identifier",
        dataIndex: ["guardian", "identifier"],
        key: "guardian_identifier",
      },
      {
        title: "Guardian Mobile Number",
        dataIndex: ["guardian", "mobile_number"],
        key: "guardian_mobile_number",
      },
      {
        title: "Guardian Address",
        dataIndex: ["guardian", "address"],
        key: "guardian_address",
      },
      {
        title: "Guardian Email Address",
        dataIndex: ["guardian", "email_address"],
        key: "guardian_email_address",
      },
      {
        title: "Guardian City",
        dataIndex: ["guardian", "city"],
        key: "guardian_city",
      },
      {
        title: "Guardian Relationship",
        dataIndex: ["guardian", "relationship_id"],
        key: "guardian_relationship_id",
      },
    ];

    return (
      <Table
        columns={childColumns}
        dataSource={record.children}
        pagination={false}
        rowKey="id"
        onRow={(childRecord) => ({
          onClick: () => handleChildRowClick(childRecord),
        })}
      />
    );
  };

  const handleChildRowClick = (childRecord) => {
    setSelectedBeneficiary(childRecord);
    setEditDialogOpen(true);
  };

  return (
    <>
      <p className="text-primary my-5 text-lg px-6 font-bold">Beneficiaries</p>
      <DialogContent>
        <Table
          columns={columns}
          dataSource={beneficiaries}
          expandable={{ expandedRowRender }}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleChildRowClick(record),
          })}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f00",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#f00",
            },
          }}
          onClick={() => setViewBeneficiaries(false)}
        >
          Close
        </Button>
      </DialogActions>
      <EditBeneficiaryDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}

export default ViewBeneficiaries;
