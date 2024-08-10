import React, { useEffect, useState } from "react";
import { Button, DialogContent, DialogActions } from "@mui/material";
import EditBeneficiaryDialog from "./EditBeneficiaryDialog";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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

  const columnDefs = [
    {
      headerName: "Relationship",
      field: "relationship.name",
    },
    {
      headerName: "Surname",
      field: "surname",
    },
    {
      headerName: "First Name",
      field: "first_name",
    },
    {
      headerName: "Other Name",
      field: "other_name",
    },
    {
      headerName: "Age",
      field: "age",
    },
    {
      headerName: "Date of Birth",
      field: "dob",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Date of Death",
      field: "date_of_death",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
  ];

  const handleRowClick = (event) => {
    setSelectedBeneficiary(event.data);
    setEditDialogOpen(true);
  };

  return (
    <>
      <p className="text-primary my-5 text-lg px-6 font-bold">
        Beneficiaries & Guardians
      </p>
      <DialogContent>
        <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            rowData={beneficiaries}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            pagination={false}
            rowSelection="single"
            onRowClicked={handleRowClick}
          />
        </div>
      </DialogContent>
      {/* <DialogActions>
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
      </DialogActions> */}
      <EditBeneficiaryDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}

export default ViewBeneficiaries;
