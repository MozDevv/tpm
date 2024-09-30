import React, { useEffect, useMemo, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";
import BaseLoadingOverlay from "@/components/baseComponents/BaseLoadingOverlay";
import { Close } from "@mui/icons-material";
import { message } from "antd";
import MapPensionerAwards from "../pensionAwards/MapPensionerAwards";

function ExitGroundsCard({ clickedItem }) {
  const [pensionAwards, setPensionAwards] = useState([]);
  const [pensionAwardsnotMapped, setPensionAwardsnotMapped] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);

  const columnDefs = [
    { field: "prefix", headerName: "Prefix", filter: true },
    { field: "name", headerName: "Name", filter: true },
    {
      field: "pensionCap",
      headerName: "Pension Cap",
      filter: true,
      hide: true,
    },
    { field: "description", headerName: "Description", filter: true },
    { field: "has_commutation", headerName: "Commutable", filter: true },
  ];

  const columnDefsunMapped = [
    {
      field: "prefix",
      headerName: "Prefix",
      filter: true,
      checkboxSelection: true,
    },
    { field: "name", headerName: "Name", filter: true },
    {
      field: "pensionCap",
      headerName: "Pension Cap",
      filter: true,
      hide: true,
    },
    { field: "description", headerName: "Description", filter: true },
  ];

  const fetchPensionAwards = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards, {
        "paging.pageNumber": 1,
        "paging.pageSize": 1000,
      });
      const { data, totalCount } = res.data;
      setPensionAwards(
        data.filter((item) => item.exit_ground_id === clickedItem.id)
      );
      setPensionAwardsnotMapped(
        data.filter((item) => item.exit_ground_id !== clickedItem.id)
      );
      setTotalRecords(totalCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPensionAwards();
  }, []);

  const gridApiRef = useRef(null);

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const mapExitGroundtoPensionAwards = async (selectedRow) => {
    if (gridApiRef.current) {
      gridApiRef.current.showLoadingOverlay();
    }

    const data = {
      exit_ground_id: clickedItem.id,
      pension_award_id: selectedRow && selectedRow?.id,
    };

    try {
      const res = await apiService.post(endpoints.mapPensionerAwards, data);
      if (res.status === 200) {
        console.log("Mapping successful:", res.data.data);
        fetchPensionAwards(); // Refresh the awards list
        message.success(
          `Mapped ${selectedRow.name} to ${clickedItem.name} successfully`
        );
      }
    } catch (e) {
      console.error("Error mapping data:", e);
    } finally {
      if (gridApiRef.current) {
        gridApiRef.current.hideOverlay();
      }
    }
  };

  const handleSelectionChange = (event) => {
    const selectedRow = event.api.getSelectedRows()[0];
    setSelectedAward(selectedRow);
    mapExitGroundtoPensionAwards(selectedRow);
    // fetchPensionAwards();
  };

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "Loading data..." };
  }, []);

  const [documentTypes, setDocumentTypes] = useState([]);
  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes);

      setDocumentTypes(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const documentTypesColdDefs = [
    {
      field: "name",
      headerName: "Name",
      filter: true,
      checkboxSelection: true,
    },
    { field: "description", headerName: "Description", filter: true },
    { field: "extenstions", headerName: "Extensions", filter: true },
    { field: "has_two_sides", headerName: "Has Two Sides", filter: true },
    {
      field: "max_file_size_in_mb",
      headerName: "Max File Size (MB)",
      filter: true,
    },
  ];

  const handleSelectionChange2 = (event) => {
    const selectedRow = event.api.getSelectedRows()[0];
    setSelectedAward(selectedRow);
    mapExitGroundtoPensionAwards(selectedRow);
    // fetchPensionAwards();
  };

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [gridHeight, setGridHeight] = useState(400);
  const rowHeight = 40;

  useEffect(() => {
    const totalHeight = Math.min(
      pensionAwardsnotMapped.length * rowHeight + 50,
      window.innerHeight - 100
    );
    setGridHeight(totalHeight);
  }, [pensionAwardsnotMapped]);
  return (
    <div>
      <div style={{ width: "90%", ml: 2, p: 2 }}>
        {/* <DialogContent>
            <AgGridReact
              columnDefs={documentTypesColdDefs}
              rowData={documentTypes}
              rowSelection="single"
              onSelectionChanged={handleSelectionChange2}
              onGridReady={onGridReady}
              domLayout="autoHeight"
              loadingOverlayComponent={BaseLoadingOverlay}
              loadingOverlayComponentParams={loadingOverlayComponentParams}
            />
          </DialogContent> */}
        <MapPensionerAwards
          rowClicked={clickedItem}
          setOpenAward={setOpenDocumentDialog}
        />
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ px: 4 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="text-primary mt-5 mb-3 px-9 text-lg pt-3">
            Select Pension Award to map to {clickedItem.name}
          </p>
          <IconButton onClick={() => setDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 8, pb: 2 }}>
          <div
            className="ag-theme-quartz"
            style={{
              height: `${gridHeight}px`,
              width: "100%",
              overflow: "auto",
              maxHeight: "1000px",
            }}
          >
            <AgGridReact
              columnDefs={columnDefsunMapped}
              rowData={pensionAwardsnotMapped}
              rowSelection="single"
              onSelectionChanged={handleSelectionChange}
              onGridReady={onGridReady}
              domLayout="normal"
              loadingOverlayComponent={BaseLoadingOverlay}
              loadingOverlayComponentParams={loadingOverlayComponentParams}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExitGroundsCard;
