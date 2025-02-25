'use client';
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControlLabel,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useAlert } from '@/context/AlertContext';
import { Add } from '@mui/icons-material';
import { Checkbox } from 'antd';

const MapPensionerAwards = ({ rowClicked, setOpenAward }) => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [defaultDocuments, setDefaultDocuments] = useState([]);
  const { setAlert } = useAlert();
  const [openDialog, setOpenDialog] = useState(false);

  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes, {
        'paging.pageSize': 200,
      });
      setDocuments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

    console.log('initialDocs', initialDocs);
    console.log('rowClicked', rowClicked);
    console.log('defaultDocuments', defaultDocuments);
    setSelectedDocuments(initialDocs);
  }, [rowClicked]);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const handleDocumentChange = (event, newValue) => {
    const newDocuments = selectedDocuments.filter((s) => {
      return newValue.some((n) => n.id === s.document.id);
    });

    newValue.forEach((v) => {
      if (!newDocuments.some((s) => s.document.id === v.id)) {
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
    const newDocuments = selectedDocuments.filter(
      (doc) =>
        !rowClicked.awardDocuments.some(
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

    try {
      const res = await apiService.post(endpoints.mapPensionerAwards, data);

      if (res.status === 200 && res.data.succeeded) {
        setAlert({
          open: true,
          message: `Documents successfully mapped to ${rowClicked.name}`,
          severity: 'success',
        });
        setOpenAward(false);
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
    }
  };

  /**************************************************
   *
   *
   *
   * IMPLIMENTING FIELDS SETUPS FOR WHERE DOCUMENTS ARE MAPPED TO FIELDS
   *
   *
   *
   */

  const [allFields, setAllFields] = useState([]);

  const [selectedFields, setSelectedFields] = useState([]);

  const fetchCurrentExitGround = async () => {
    try {
      const res = await apiService.get(
        endpoints.getExitGroundbyId(rowClicked?.id)
      );
      if (res.data.succeeded) {
        const documents = res.data.data[0].awardDocuments.map((doc) => ({
          ...doc,
          document: doc.document,
          required: doc.required,
          pensionerUpload: doc.pensioner_upload,
          has_two_sides: doc.has_two_sides,
          front: doc.front,
          back: doc.back,

          verificationSections: doc.verificationSections,
        }));

        setSelectedDocuments(documents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [clickedDocumentTypeDetails, setClickedDocumentTypeDetails] = useState(
    []
  );

  const handleToggleDocumentType = async () => {
    const updatedFields = selectedFields.map((field) => ({
      field_name: field,
    }));

    for (const field of selectedFields) {
      const data = {
        documentTypeId: clickedDocumentTypeDetails.document.id,
        fieldName: field,
      };

      try {
        const res = await apiService.post(
          endpoints.toggleDocumentFieldMapping,
          data
        );

        if (res.status === 200 && res.data.succeeded) {
          setAlert({
            open: true,
            message: `Field ${field} successfully mapped to ${clickedDocumentTypeDetails.document.name}`,
            severity: 'success',
          });
          setOpenDialog(false);
        }
      } catch (error) {
        console.error('Error submitting fields:', error);
        setAlert({
          open: true,
          message: `Failed to map field ${field}.`,
          severity: 'error',
        });
      }
    }

    // Update the corresponding document in selectedDocuments
    await fetchCurrentExitGround();
    setSelectedFields([]); // Reset selected fields
    setOpenDialog(false); // Close dialog after toggling fields
  };

  // Ensure you reset when dialog closes
  const handleDialogClose = () => {
    setSelectedFields([]);
    setClickedDocumentTypeDetails([]);
    setOpenDialog(false);
  };

  const fetchAllFieldNames = async () => {
    try {
      const res = await apiService.get(endpoints.getDocumentFieldsNames, {
        'paging.pageSize': 200,
      });

      if (res.status === 200 && res.data.succeeded) {
        setAllFields(res.data.data.map((doc) => ({ name: doc, id: doc })));
      }
    } catch (error) {
      console.error('Error fetching document fields:', error);
    }
  };

  useEffect(() => {
    fetchAllFieldNames();
  }, []);
  const preclaimsStatus = {
    0: { name: 'UNNOTIFIED', color: '#e74c3c' }, // Light Red
    1: { name: 'SCHEDULED', color: '#f39c12' }, // Bright Orange
    2: { name: 'NOTIFIED', color: '#3498db' }, // Light Blue
    3: { name: 'SUBMITTED', color: '#970FF2' }, // Amethyst
    4: { name: 'IN REVIEW', color: '#970FF2' }, // Carrot Orange
    5: { name: 'PENDING APPROVAL', color: '#1abc9c' }, // Light Turquoise
    6: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
    7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
  };

  const claimsStatus = {
    0: { name: 'VERIFICATION', color: '#3498db' }, // Light Red
    1: { name: 'VALIDATION', color: '#f39c12' }, // Bright Orange
    2: { name: 'APPROVAL', color: '#2ecc71' }, // Light Blue
    3: { name: 'ASSESSMENT DATA CAPTURE', color: '#f39c12' }, // Bright Orange
    4: { name: 'ASSESSMENT APPROVAL', color: '#2ecc71' }, // Light Blue
    5: { name: 'DIRECTORATE', color: '#f39c12' }, // Bright Orange
    6: { name: 'Controller of Budget', color: '#f39c12' }, // Bright Orange
    7: { name: 'Finance', color: '#2ecc71' }, // Light Blue
    8: { name: 'Voucher Preparation', color: '#f39c12' }, // Bright Orange
    9: { name: 'Voucher Approval', color: '#3498db' }, // Light Blue
    10: { name: 'Voucher Scheduled', color: '#f39c12' }, // Bright Orange
    11: { name: 'Voucher Paid', color: '#8b4513' }, // Light Blue
  };

  const [selectedPreclaimsSections, setSelectedPreclaimsSections] = useState(
    []
  );
  const [selectedClaimsSections, setSelectedClaimsSections] = useState([]);

  const toggleDocumentSections = async () => {
    const documentId = clickedDocumentTypeDetails.id;

    // Prepare data for preclaims sections
    const preclaimsData = selectedPreclaimsSections.map((status) => ({
      exit_ground_document_id: documentId,
      prospectivePensionerNotificationStatus: status * 1,
      claimStage: null,
    }));

    // Prepare data for claims sections
    const claimsData = selectedClaimsSections.map((stage) => ({
      exit_ground_document_id: documentId,
      prospectivePensionerNotificationStatus: null,
      claimStage: stage * 1,
    }));

    // Combine both preclaims and claims data
    const dataToSend = [...preclaimsData, ...claimsData];

    try {
      for (const data of dataToSend) {
        const res = await apiService.post(
          endpoints.toggleDocumentVerificationSection,
          data
        );

        if (res.status === 200 && res.data.succeeded) {
          setAlert({
            open: true,
            message: `Section successfully mapped to ${clickedDocumentTypeDetails.document.name}`,
            severity: 'success',
          });
          await fetchCurrentExitGround();
          setOpenDialog(false); // Close dialog after toggling sections
        }
      }
    } catch (error) {
      console.error('Error submitting sections:', error);
      setAlert({
        open: true,
        message: 'Failed to map sections.',
        severity: 'error',
      });
    }
  };

  return (
    <div className="mt-4 px-4 ">
      <div className="flex flex-col gap-3">
        <div className="px-5 mb-5">
          <div className="flex flex-row gap-3 justify-between items-center">
            <p className="text-primary mb-2 text-lg font-semibold font-montserrat">
              Documents Required under {rowClicked.name}
            </p>
            <Button
              variant="contained"
              color="primary"
              sx={{ boxShadow: 'none', textTransform: 'none', mr: '-40px' }}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Autocomplete
        multiple
        options={documents}
        defaultValue={defaultDocuments}
        getOptionLabel={(option) => option.name}
        value={defaultDocuments}
        onChange={handleDocumentChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Documents" variant="outlined" />
        )}
        sx={{
          '& .MuiOutlinedInput-root': {
            boxShadow: 'none',
          },
        }}
      />
      <Dialog
        open={openDialog === 1}
        onClose={handleDialogClose}
        sx={{
          '& .MuiDialog-paper': {
            //  borderRadius: '8px',
            //add a max height to the dialog
            maxHeight: '500px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            padding: '20px',
            color: '#006990',
            alignItems: 'center',
          }}
        >
          Select Fields to Map to {clickedDocumentTypeDetails?.document?.name}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-wrap justify-between">
            {allFields.map((col, index) => {
              const isSelected = selectedFields.includes(col.name);

              return (
                <div key={index} className="w-[48%] mb-2">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFields((prev) => [...prev, col.name]);
                      } else {
                        setSelectedFields((prev) =>
                          prev.filter((field) => field !== col.name)
                        );
                      }
                    }}
                  >
                    {col.name}
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <Button onClick={handleDialogClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleToggleDocumentType}
            color="primary"
            variant="contained"
          >
            Add Fields(s)
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog === 2}
        onClose={handleDialogClose}
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '500px',
            width: '600px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            padding: '20px',
            color: '#006990',
            alignItems: 'center',
          }}
        >
          Select where {clickedDocumentTypeDetails?.document?.name} verification
          is required
        </DialogTitle>
        <DialogContent>
          <div className="flex justify-between gap-4">
            {/* Preclaims Section */}
            <div className="w-1/2">
              <Typography variant="h6" mb={2} gutterBottom>
                Preclaims Sections
              </Typography>
              {Object.entries(preclaimsStatus).map(([key, value]) => {
                const isSelected = selectedPreclaimsSections.includes(key);

                return (
                  <div key={key} className="mb-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPreclaimsSections((prev) => [
                            ...prev,
                            key,
                          ]);
                        } else {
                          setSelectedPreclaimsSections((prev) =>
                            prev.filter((field) => field !== key)
                          );
                        }
                      }}
                    />
                    <span style={{ paddingLeft: '10px', fontSize: '12px' }}>
                      {value.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Claims Section */}
            <div className="w-1/2">
              <Typography variant="h6" gutterBottom mb={2}>
                Claims Sections
              </Typography>
              {Object.entries(claimsStatus).map(([key, value]) => {
                const isSelected = selectedClaimsSections.includes(key);

                return (
                  <div key={key} className="mb-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClaimsSections((prev) => [...prev, key]);
                        } else {
                          setSelectedClaimsSections((prev) =>
                            prev.filter((field) => field !== key)
                          );
                        }
                      }}
                    />
                    <span style={{ paddingLeft: '10px', fontSize: '12px' }}>
                      {
                        /**change to Proper case */
                        value.name
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <Button onClick={handleDialogClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={toggleDocumentSections}
            color="primary"
            variant="contained"
          >
            Add Section(s)
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mt-5 shadow-none max-h-[350px] overflow-auto">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'semibold',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                Document
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'semibold',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                Pensioner Upload
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'semibold',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                Upload Details
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'semibold',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                Fields Mapping
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'semibold',
                  backgroundColor: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                Document Verification Sections
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {selectedDocuments.map((doc, index) => (
              <TableRow
                key={doc.document.id}
                sx={{
                  height: 'auto', // dynamically adjust row height
                  '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                }}
              >
                <TableCell>{doc.document.name}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={doc.pensionerUpload}
                    onChange={handleCheckboxChange(index, 'pensionerUpload')}
                  />
                </TableCell>
                <TableCell align="center">
                  {doc.document.has_two_sides && (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={doc.front}
                            onChange={handleCheckboxChange(index, 'front')}
                          />
                        }
                        sx={{
                          fontSize: '10px',
                          pl: '10px',
                        }}
                        label="Front"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={doc.back}
                            onChange={handleCheckboxChange(index, 'back')}
                          />
                        }
                        sx={{
                          fontSize: '10px',
                          pl: '10px',
                        }}
                        label="Back"
                      />
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {doc.document?.documentTypeFields?.map((field) => (
                    <Chip
                      key={field.field_name}
                      label={field.field_name}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{
                        marginRight: '4px',
                        marginBottom: '4px',
                        borderColor: '#006990',
                      }}
                    />
                  ))}
                  <Chip
                    label="Add Fields"
                    size="small"
                    sx={{ marginRight: '4px', marginBottom: '4px' }}
                    icon={<Add />}
                    onClick={() => {
                      setOpenDialog(1);
                      setClickedDocumentTypeDetails(doc);
                      // Handle the add fields action here
                    }}
                  />
                </TableCell>
                <TableCell>
                  {doc?.verificationSections?.map((section, index) => {
                    const claimStageName =
                      section.claim_stage !== null
                        ? claimsStatus[section.claim_stage]?.name
                        : null;

                    const preclaimStatusName =
                      section.prospective_pensioner_notification_status !== null
                        ? preclaimsStatus[
                            section.prospective_pensioner_notification_status
                          ]?.name
                        : null;

                    return (
                      <React.Fragment key={index}>
                        {preclaimStatusName && (
                          <Chip
                            label={preclaimStatusName}
                            color="primary"
                            variant="contained"
                            size="small"
                            sx={{
                              marginRight: '4px',
                              fontSize: '11px',
                              marginBottom: '4px',
                              // // backgroundColor: '#3498db', // Blue for preclaims
                              // color: '#fff',
                            }}
                          />
                        )}
                        {claimStageName && (
                          <Chip
                            label={claimStageName}
                            color="success"
                            variant="contained"
                            size="small"
                            sx={{
                              marginRight: '4px',
                              fontSize: '11px',
                              marginBottom: '4px',

                              // //  backgroundColor: '#2ecc71', // Green for claims
                              // color: '#fff',
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}

                  <Chip
                    label="Add Sections"
                    size="small"
                    sx={{ marginRight: '4px', marginBottom: '4px' }}
                    icon={<Add />}
                    onClick={() => {
                      setOpenDialog(2);
                      setClickedDocumentTypeDetails(doc);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MapPensionerAwards;
