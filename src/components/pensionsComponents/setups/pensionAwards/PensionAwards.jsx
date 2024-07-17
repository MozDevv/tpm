"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";
import {
  Button,
  Checkbox,
  Dialog,
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import MapPensionerAwards from "./MapPensionerAwards";
import "./pensionAwards.css";

function PensionAwards() {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page
  const [openAward, setOpenAward] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowClicked, setRowClicked] = useState();
  const [required, setRequired] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]); // [1]
  const { alert, setAlert } = useAlert();
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    id: "",
    prefix: "",
    has_commutation: false,
  });

  const [formDataErrors, setFormDataErrors] = useState({});

  const columnDefs = [
    {
      field: "no",
      headerName: "No",
      headerClass: "prefix-header",
      width: 90,
      filter: true,
    },
    {
      field: "prefix",
      headerName: "Prefix",
      headerClass: "prefix-header",
      filter: true,
    },
    {
      field: "name",
      headerName: "Name",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "pensionCap",
      headerName: "Pension Cap",
      headerClass: "prefix-header",
      filter: true,
    },
    {
      field: "description",
      headerName: "Description",
      headerClass: "prefix-header",
      filter: true,
      width: 250,
    },
    {
      field: "commutable",
      headerName: "Commutable",
      headerClass: "prefix-header",
      filter: false,
      cellRenderer: (params) => {
        const index = params.value;
        const current_data = rowData[index];
        const has_commutation = current_data.has_commutation;

        return (
          <Button
            variant="outlined"
            sx={{
              ml: 3,
              borderColor: has_commutation ? "#3498db" : "#e67e22",
              maxHeight: "22px",
              cursor: "pointer",
              color: has_commutation ? "#3498db" : "#e67e22",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            {has_commutation ? "Yes" : "No"}
          </Button>
        );
      },
    },
    {
      field: "mapDocs",
      headerName: "Map Documents",
      headerClass: "prefix-header",
      filter: false,
      cellRenderer: (params) => {
        const index = params.value;
        const current_data = rowData[index];
        // const id = params[index].value;
        const document_nos = current_data.awardDocuments.length;

        return (
          <Button
            variant="outlined"
            onClick={() => {
              setOpenAward(true);
              setRowClicked(current_data);
            }}
            sx={{
              ml: 3,
              borderColor: "#3498db",
              maxHeight: "22px",
              cursor: "pointer",
              color: "#3498db",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            Map Documents ({document_nos})
          </Button>
        );
      },
    },
    // {
    //   field: "start_date",
    //   headerName: "Start Date",
    //   headerClass: "prefix-header",
    //   filter: true,
    //   width: 100,
    // },
    // {
    //   field: "end_date",
    //   headerName: "End Date",
    //   headerClass: "prefix-header",
    //   filter: true,
    //   width: 100,
    // }
  ];
  useEffect(() => {
    fetchData();
  }, [pageNumber]); // Fetch data whenever pageNumber changes

  const fetchData = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards, {
        paging: { pageNumber, pageSize },
      });
      const { data, totalCount } = res.data;

      const transformedData = transformData(data);
      setRowData(transformedData);
      setTotalRecords(totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1 + (pageNumber - 1) * pageSize,

      prefix: transformString(item.prefix),
      name: item.name,
      pensionCap: item.pensionCap.name,
      id: item.id,
      description: transformString(item.description),
      commutable: index,
      mapDocs: index,
      awardDocuments: item.awardDocuments,
      start_date: item.start_date,
      // end_date: item.end_date,
      has_commutation: item.has_commutation,
    }));
  };

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const handlePaginationChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes);

      console.log(res.data.data);

      setDocumentTypes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFormChange = (evt) => {
    let { name, value, type, checked } = evt.target;

    let errors = { ...formDataErrors };

    if (name == "name" && (value == null || value.length == 0)) {
      errors = { ...errors, [name]: "Name is required" };
    } else if (name == "prefix" && (value == null || value.length == 0)) {
      errors = { ...errors, [name]: "Prefix is required" };
    } else if (name == "description" && (value == null || value.length == 0)) {
      errors = { ...errors, [name]: "Description is required" };
    } else if (name == "has_commutation") {
      value = checked;
    } else {
      errors = { ...errors, [name]: null };
    }

    setEditFormData({ ...editFormData, [name]: value });
    setFormDataErrors({ ...errors });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    Object.keys(formDataErrors).forEach((k) => {
      if (formDataErrors[k] !== null) {
        valid = false;
        return;
      }
    });

    if (valid) {
      console.log(editFormData);

      editFormData.id = rowClicked?.id;

      try {
        const res = await apiService.post(
          `/api/Setups/EditPensionAward`,
          editFormData
        );

        if (res.data.succeeded && res.status === 200) {
          setAlert({
            open: true,
            message: "Pension award updated successfully",
            severity: "success",
          });
          setOpenDialog(false);
          fetchData();
        }

        // fetchAllPreclaims(); // Uncomment if you need to refresh the preclaims list
      } catch (error) {
        console.log("API Error:", error);
      } finally {
      }
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: "75vh", width: "98%" }}>
      {openAward ? (
        <MapPensionerAwards
          setOpenAward={setOpenAward}
          rowClicked={rowClicked}
        />
      ) : (
        <>
          <Dialog
            sx={{
              "& .MuiDialog-paper": {
                padding: "40px",
                maxWidth: "500px",
                width: "100%",
              },
            }}
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              setEditFormData({
                name: "",
                description: "",
                id: "",
                prefix: "",
                has_commutation: false,
              });
            }}
          >
            <div className="flex w-full justify-between max-h-8 mb-3">
              {" "}
              <p className="text-base  text-primary font-semibold mb-5">
                EDIT {rowClicked?.name?.toUpperCase()}
              </p>
            </div>
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Name
                </label>

                <TextField
                  id="name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  error={!!formDataErrors.name}
                  helperText={formDataErrors.name}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="prefix"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Name
                </label>

                <TextField
                  id="prefix"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="prefix"
                  value={editFormData.prefix}
                  onChange={handleEditFormChange}
                  error={!!formDataErrors.prefix}
                  helperText={formDataErrors.prefix}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[13px] text-gray-700"
                >
                  Description
                </label>
                <TextField
                  id="description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  error={!!formDataErrors.description}
                  helperText={formDataErrors.description}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-xs font-medium text-gray-700"
                >
                  Has Commutation?
                </label>

                <div className="flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editFormData.has_commutation}
                        id="has_commutation"
                        name="has_commutation"
                        inputProps={{ "aria-label": "controlled" }}
                        onChange={handleEditFormChange}
                      />
                    }
                    label={
                      editFormData?.has_commutation
                        ? "Commutable"
                        : "Not Commutable"
                    }
                  />
                </div>
              </div>

              <div className="flex w-full">
                <Button
                  variant="contained"
                  type="submit"
                  className="flex-1"
                  color="primary"
                >
                  <p className="text-md"> Save Changes</p>
                </Button>
              </div>
            </form>
          </Dialog>
          <div className="p-3 mb-4">
            <p className="font-semibold text-[25px] text-primary">
              Pension Awards
            </p>
            <p className="text-gray-500 text-sm mt-2">
              List of available pension awards
            </p>
          </div>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            domLayout="autoHeight"
            paginationPageSize={pageSize}
            onPaginationChanged={(params) =>
              handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
            }
            onRowClicked={(e) => {
              setOpenDialog(true);
              setRowClicked(e.data);
              setEditFormData({
                ...editFormData,
                name: e.data.name,
                description: e.data.description,
                id: e.data.id,
                prefix: e.data.prefix,
                has_commutation: e.data.has_commutation,
              });
            }}
            onGridReady={onGridReady}
          />
        </>
      )}
    </div>
  );
}

export default PensionAwards;
