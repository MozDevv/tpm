import React, { useEffect, useState } from "react";
import { DialogContent } from "@mui/material";
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
  const [guardians, setGuardians] = useState([]);

  const getBeneficiaries = async () => {
    try {
      const res = await apiService.get(
        "https://tntportalapi.agilebiz.co.ke/portal/getBeneficiaries/03a7bc99-d03c-4fa1-905c-887792c4eb60"
      );

      const beneficiariesData = res.data;

      // Collect guardians from all children arrays
      const guardiansData = beneficiariesData.reduce((acc, item) => {
        if (item.children && Array.isArray(item.children)) {
          return acc.concat(item.children);
        }
        return acc;
      }, []);

      setBeneficiaries(beneficiariesData);
      setGuardians(guardiansData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [clickedItem]);

  const columnDefs = [
    { headerName: "Relationship", field: "relationship" },
    { headerName: "Surname", field: "surname" },
    { headerName: "First Name", field: "first_name" },
    { headerName: "Other Name", field: "other_name" },
    { headerName: "Percentage", field: "share_percentage" },
    { headerName: "Age", field: "age" },
    {
      headerName: "Date of Birth",
      field: "date_of_birth",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
    {
      headerName: "Date of Death",
      field: "deceased",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "N/A",
    },
  ];

  const handleRowClick = (event) => {
    setSelectedBeneficiary(event.data);
    setEditDialogOpen(true);
  };

  const [isGuardian, setIsGuardian] = useState(false);

  return (
    <>
      <p className="text-primary my-5 text-lg px-6 font-bold">Beneficiaries</p>
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

      <p className="text-primary mt-[-40px] text-lg px-6 font-bold">
        Guardians
      </p>
      <DialogContent>
        <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            rowData={guardians}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            pagination={false}
            rowSelection="single"
            onRowClicked={(e) => {
              setIsGuardian(true);
              setSelectedBeneficiary(e.data);
              setEditDialogOpen(true);
            }}
          />
        </div>
      </DialogContent>

      <EditBeneficiaryDialog
        open={editDialogOpen}
        isGuardian={isGuardian}
        onClose={() => setEditDialogOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}

export default ViewBeneficiaries;
