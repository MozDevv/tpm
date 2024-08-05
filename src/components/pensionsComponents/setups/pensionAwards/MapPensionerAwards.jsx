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
  IconButton,
  FormControlLabel,
} from "@mui/material";

import {
  ArrowBack,
  ExpandLess,
  KeyboardArrowRight,
  OpenInFull,
} from "@mui/icons-material";

import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

const MapPensionerAwards = ({ rowClicked, setOpenAward }) => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [initialDocuments, setInitialDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [defaultDocuments, setDefaultDocuments] = useState([]);
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
    console.log("awardDocuments", rowClicked.awardDocuments);
    const selected = rowClicked.awardDocuments.map((_) => _.document);
    setDefaultDocuments([...selected]);

    const initialDocs = rowClicked.awardDocuments.map((doc) => ({
      ...doc,
      required: doc.required || false,
      pensionerUpload: doc.pensioner_upload || false,
      has_two_sides: doc.has_two_sides || false,
      front: doc.front || false,
      back: doc.back || false,
    }));

    setSelectedDocuments(initialDocs);
  }, []);

  useEffect(() => {
    fetchDocumentTypes();
    if (rowClicked.awardDocuments) {
      // const initialDocs = rowClicked.awardDocuments.map((doc) => ({
      //   ...doc,
      //   required: doc.required || false,
      //   pensionerUpload: doc.pensioner_upload || false,
      //   has_two_sides: doc.has_two_sides || false,
      //   front: doc.front || false,
      //   back: doc.back || false,
      // }));
      // debugger
      // setSelectedDocuments(initialDocs);
      // setInitialDocuments(initialDocs);
    }
  }, [rowClicked]);

  const handleDocumentChange = (event, newValue) => {
    debugger;
    // const newDocuments = newValue.filter(
    //   (newDoc) =>
    //     !selectedDocuments.some((doc) => doc.document.id === newDoc.id)
    // );

    const newDocuments = selectedDocuments.filter((s) => {
      let notexists = !newValue.some((n) => n.id === s.document.id);

      return !notexists;
    });

    // const newValues = selectedDocuments.filter(doc => doc.id == newValue.id);

    newValue.forEach((v) => {
      if (!newDocuments.some((s) => s.document.id === v.id)) {
        debugger;

        newDocuments.push({
          document: v,
          required: false,
          pensionerUpload: false,
          has_two_sides: false,
          front: false,
          back: false,
        });
      }
    });

    // const updatedDocuments = newDocuments.map((doc) => ({
    //   document: doc,
    //   required: false,
    //   pensionerUpload: false,
    //   front: false,
    //   back: false,
    // }));

    setDefaultDocuments([...newValue]);

    setSelectedDocuments([...newDocuments]);
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
    debugger;
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
        required: true,
        pensioner_upload: doc.pensionerUpload,
        front: doc.front,
        back: doc.back,
      })),
    };

    console.log("Data to be submitted: ", data);

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
    <div className="mt-4">
      <div className="flex flex-col gap-3">
        <div className="">
          <IconButton
            sx={{
              border: "1px solid #006990",
              borderRadius: "50%",
              padding: "3px",
              marginRight: "10px",
              color: "#006990",
            }}
            onClick={() => setOpenAward(false)}
          >
            <ArrowBack sx={{ color: "#006990" }} />
          </IconButton>
        </div>

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
            defaultValue={defaultDocuments}
            getOptionLabel={(option) => option.name}
            value={defaultDocuments}
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
                  <TableCell align="center">Pensioner Upload</TableCell>
                  <TableCell align="center">Upload Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDocuments.map((doc, index) => (
                  <TableRow key={doc.document.id}>
                    <TableCell>{doc.document.name}</TableCell>
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
                    <TableCell align="center">
                      {doc.document.has_two_sides && (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={doc.front}
                                onChange={handleCheckboxChange(index, "front")}
                                name={`required-${index}`}
                              />
                            }
                            label="Front"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={doc.back}
                                label="back"
                                onChange={handleCheckboxChange(index, "back")}
                                name={`required-${index}`}
                              />
                            }
                            label="Back"
                          />
                        </>
                      )}
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
