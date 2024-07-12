"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

const MapPensionerAwards = ({ rowClicked, setOpenAward }) => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [initialDocuments, setInitialDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { alert, setAlert } = useAlert();

  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes);
      setDocuments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
    if (rowClicked.awardDocuments) {
      const initialDocs = rowClicked.awardDocuments.map((doc) => ({
        ...doc,
        required: doc.required || false,
        pensionerUpload: doc.pensioner_upload || false,
      }));
      setSelectedDocuments(initialDocs);
      setInitialDocuments(initialDocs);
    }
  }, [rowClicked]);

  const handleDocumentChange = (event, newValue) => {
    const newDocuments = newValue.filter(
      (newDoc) =>
        !selectedDocuments.some((doc) => doc.document.id === newDoc.id)
    );

    const updatedDocuments = newDocuments.map((doc) => ({
      document: doc,
      required: false,
      pensionerUpload: false,
    }));

    setSelectedDocuments([...selectedDocuments, ...updatedDocuments]);
  };

  const handleCheckboxChange = (index, field) => (event) => {
    const updatedDocuments = [...selectedDocuments];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: event.target.checked,
    };
    setSelectedDocuments(updatedDocuments);
  };

  const handleSubmit = async () => {
    const newDocuments = selectedDocuments.filter(
      (doc) =>
        !initialDocuments.some(
          (initialDoc) => initialDoc.document.id === doc.document.id
        )
    );

    const data = {
      pension_award_id: rowClicked.id,
      documents: newDocuments.map((doc) => ({
        document_id: doc.document.id,
        required: doc.required,
        pensioner_upload: doc.pensionerUpload,
      })),
    };

    console.log("Data to be submitted:", data);

    try {
      const res = await apiService.post(endpoints.mapPensionerAwards, data);

      if (res.status === 200 && res.data.succeeded) {
        setAlert({
          open: true,
          message: `Documents successfully mapped to ${rowClicked.name}`,
          severity: "success",
        });
        console.log("Response:", res.data);
        setOpenAward(false);
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-3">
        <p className="text-primary text-xl font-semibold">
          Map Documents to {rowClicked?.name}
        </p>
        <p className="text-gray-700 text-sm mb-3">
          Choose the document you wish to map to the selected Award
        </p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={documents}
            getOptionLabel={(option) => option.name}
            onChange={handleDocumentChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Documents"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell align="center">Required</TableCell>
                  <TableCell align="center">Pensioner Upload</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDocuments.map((doc, index) => (
                  <TableRow key={doc.document.id}>
                    <TableCell>{doc.document.name}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={doc.required}
                        onChange={handleCheckboxChange(index, "required")}
                        name={`required-${index}`}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={doc.pensionerUpload}
                        onChange={handleCheckboxChange(
                          index,
                          "pensionerUpload"
                        )}
                        name={`pensionerUpload-${index}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default MapPensionerAwards;
