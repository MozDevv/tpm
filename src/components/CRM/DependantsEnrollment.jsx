import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Popper,
  TextField,
} from '@mui/material';
import { Alert, Button, Table, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CRMBaseInput from './CRMBaseInput';
import endpoints, { apiService } from '../services/setupsApi';
import { Button as MuiButton } from '@mui/material';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { ArrowBack } from '@mui/icons-material';

function DependantsEnrollment() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [openPensionerDetails, setOpenPensionerDetails] = useState(false);
  const [details, setDetails] = useState([]);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { data: documentTypes } = useFetchAsync(
    endpoints.getDependantPensioNiGCDocuments,
    apiService
  );

  const igcTypes = [
    { id: 0, name: 'Dependant Pension' },
    { id: 1, name: 'Killed On Duty' },
    { id: 2, name: 'Injury or Disability Pension' },
    { id: 3, name: 'Revised Disability' },
    { id: 4, name: 'Revised Cases Court Order' },
    { id: 5, name: 'Add Beneficiary Alive' },
    { id: 6, name: 'Add Beneficiary Deceased' },
    { id: 7, name: 'Change of Pay Point' },
    { id: 8, name: 'Revised Computation' },
  ];

  const handleDocumentTypeChange = (value) => {
    const selectedDocument = documentTypes.find(
      (doc) => doc.document_type_id === value
    );
    setFormData((prev) => ({
      ...prev,
      documentType: value,
      documentTypeSetup: selectedDocument.documentTypeSetup,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const renderUploadFields = () => {
    console.log('FormData:', formData); // Log the current formData

    const selectedDocument =
      documentTypes &&
      documentTypes.find(
        (doc) => doc.document_type_id === formData.documentType
      );

    console.log('Selected Document:', selectedDocument); // Log the selected document

    if (!selectedDocument) {
      console.log('No selected document found.'); // Log if no document is selected
      return null;
    }

    const uploadFields = [];
    if (selectedDocument.front) {
      uploadFields.push({
        name: 'front',
        description: `${selectedDocument.documentTypeSetup.name} Front`,
        required: selectedDocument.required,
        documentTypesSetupId: selectedDocument.document_type_id,
      });
    }
    if (selectedDocument.back) {
      uploadFields.push({
        name: 'back',
        description: `${selectedDocument.documentTypeSetup.name} Back`,
        required: selectedDocument.required,
        documentTypesSetupId: selectedDocument.document_type_id,
      });
    }
    if (!selectedDocument.front && !selectedDocument.back) {
      uploadFields.push({
        name: 'single',
        description: `${selectedDocument.documentTypeSetup.name}`,
        required: selectedDocument.required,
        documentTypesSetupId: selectedDocument.document_type_id,
      });
    }

    console.log('Upload Fields:', uploadFields); // Log the upload fields

    return (
      <>
        <div className="my-2">
          <label className="text-xs font-semibold text-gray-600">
            {selectedDocument
              ? `${selectedDocument.documentTypeSetup.name} Number`
              : 'Document Number'}
          </label>
          <TextField
            type="text"
            name="supporting_document_number"
            variant="outlined"
            size="small"
            value={formData['supporting_document_number'] || ''}
            onChange={(e) => handleInputChange(e)}
            error={!!errors['supporting_document_number']}
            helperText={errors['supporting_document_number']}
            required={true}
            fullWidth
          />
        </div>
        <Table
          columns={fileColumns}
          dataSource={uploadFields}
          pagination={false}
          rowKey="name"
          className="antcustom-table"
        />
      </>
    );
  };

  const fileColumns = [
    {
      title: 'File Name',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: 'Upload',
      key: 'upload',
      width: '30%',
      render: (_, record) => (
        <Upload
          name={record.name}
          onChange={(info) =>
            handleFileChange(info, record.name, record.documentTypesSetupId)
          }
          fileList={fileList.filter((file) => file.name === record.name)}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      ),
    },
    {
      title: 'Preview',
      key: 'preview',
      width: '30%',
      render: (_, record) => {
        const file = formData[record.name];
        return file ? (
          <Button
            style={{
              backgroundColor: '#006990',
              color: 'white',
              border: 'none',
            }}
            onClick={() => {
              setPreviewContent(
                <embed
                  src={URL.createObjectURL(file)}
                  type="application/pdf"
                  width="100%"
                  height="1000px"
                />
              );
              setPreviewOpen(true);
            }}
          >
            Preview
          </Button>
        ) : (
          <Button disabled>Preview</Button>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);

  const handleFileChange = ({ fileList }, fieldName, documentTypesSetupId) => {
    if (!fileList.length) return;

    const file = fileList[0]?.originFileObj;
    setFileList(fileList);

    if (file) {
      setFormData((prev) => {
        const existingDocuments = prev.IGC_Supporting_Documents || [];

        // Check if documentType already exists
        const docIndex = existingDocuments.findIndex(
          (doc) => doc.documentTypesSetupId === documentTypesSetupId
        );

        let updatedDocuments;
        if (docIndex !== -1) {
          // Update existing entry
          updatedDocuments = [...existingDocuments];
          updatedDocuments[docIndex].files = [file];
        } else {
          // Add new entry
          updatedDocuments = [
            ...existingDocuments,
            {
              files: [file],

              igc_document_id: documentTypesSetupId,
            },
          ];
        }

        return {
          ...prev,
          [fieldName]: file,
          IGC_Supporting_Documents: updatedDocuments,
        };
      });
    }
  };
  const handleSave = async () => {
    setLoading(true);
    const validationErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'IGC_Supporting_Documents') {
        formData[key].forEach((doc, index) => {
          if (doc.files?.length) {
            doc.files.forEach((file, fileIndex) => {
              formDataToSend.append(
                `IGC_Supporting_Documents[${index}].files`,
                file
              );
            });
          } else {
            // Ensuring that the 'files' key is present even if it's empty to prevent validation errors
            formDataToSend.append(
              `IGC_Supporting_Documents[${index}].files`,
              new Blob(),
              ''
            );
          }

          formDataToSend.append(
            `IGC_Supporting_Documents[${index}].igc_document_id`,
            doc.igc_document_id
          );
        });
      }
    });

    formDataToSend.append(
      'supporting_document_number',
      formData['supporting_document_number'] || ''
    );
    formDataToSend.append(
      'principal_pensioner_id_card_number',
      formData['principal_pensioner_id_card_number'] || ''
    );

    console.log('Final FormData before sending:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log('FormData before sending:', formData);
    console.log('FormDataToSend:', formDataToSend);

    try {
      const response = await apiService.post(
        endpoints.initiateIGC,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.succeeded === true) {
        //  setOpenPensionerDetails(true);
        message.success('Principal Pensioner Initiated Successfully.');
        //  setDetails(response.data.data);
      } else if (
        response.data.succeeded === false &&
        response.data.messages[0]
      ) {
        message.error(response.data.messages[0]);
      } else {
        message.error('Error occurred while processing your request');
      }
    } catch (error) {
      message.error('Failed to save data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'documentType',
      label: 'Select Document Type',
      type: 'select',
      required: true,
      options: documentTypes
        ? documentTypes.map((doc) => {
            const igcType = igcTypes?.find((igc) => igc.id === doc.igC_Type);
            return {
              id: doc.document_type_id,
              name: doc.documentTypeSetup.name,
              igcType: igcType ? igcType.name : 'N/A', // Provide a default value if igcType is undefined
            };
          })
        : [],
    },
  ];
  const renderRequiredDocumentsTable = () => {
    const requiredDocuments = documentTypes
      ? documentTypes.filter((doc) => doc.required)
      : [];

    return (
      <div className="">
        <Table
          columns={fileColumns}
          dataSource={requiredDocuments.map((doc) => ({
            name: doc.document_type_id,
            description: doc.documentTypeSetup.name,
            required: doc.required,
            documentTypesSetupId: doc.document_type_id,
          }))}
          pagination={false}
          rowKey="name"
          className="antcustom-table"
        />
      </div>
    );
  };

  const [pensionerDetails, setPensionerDetails] = useState();

  const handleConfirmPensionerDetails = async () => {
    setLoading(true);

    // Validate input
    if (!formData['principal_pensioner_id_card_number']) {
      setErrors((prev) => ({
        ...prev,
        principal_pensioner_id_card_number:
          'Principal Pensioner ID Card Number is required',
      }));
      setLoading(false); // Stop loading if validation fails
      return;
    }

    // Prepare FormData
    const formData2 = new FormData();
    formData2.append(
      'principal_pensioner_id_card_number',
      formData['principal_pensioner_id_card_number'] || ''
    );

    try {
      // API call
      const res = await apiService.post(
        endpoints.confirmPrincipalPensioner,
        formData2
      );

      // Handle response
      if (res.data.succeeded) {
        setPensionerDetails(res.data.data);
        setOpenPensionerDetails(true); // Open dialog only on success
      } else if (res.data.messages && res.data.messages.length > 0) {
        message.error(res.data.messages[0]);
      } else {
        message.error('Error occurred while fetching pensioner details');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while fetching pensioner details');
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  return (
    <div className="p-4 mr-5 rounded-sm relative bg-white shadow-md">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 999999 }}
          open={loading}
          onClick={() => setLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-base flex items-center">
            Processing your request
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      <Dialog
        open={openPensionerDetails && !loading}
        onClose={() => setOpenPensionerDetails(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            padding: 1,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          },
        }}
      >
        <DialogContent>
          <div className="flex items-center gap-4 mb-4  rounded-md shadow-sm">
            <IconButton
              sx={{
                border: '1px solid #006990',
                borderRadius: '50%',
                padding: '6px',
                color: '#006990',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e0f7fa', // Light hover effect
                },
              }}
              onClick={() => setOpenPensionerDetails(false)}
            >
              <ArrowBack sx={{ color: '#006990', fontSize: '20px' }} />
            </IconButton>
            <h2 className="text-lg font-semibold text-primary">
              Pensioner Details
            </h2>
          </div>
          <div className="my-2">
            <Alert
              message="Please confirm that is the pensioner"
              type="info"
              showIcon
            />
          </div>
          {pensionerDetails ? (
            <div className="space-y-4 p-3 bg-gray-100  rounded-md shadow-sm">
              <p className="text-sm">
                <strong className="text-primary">First Name:</strong>{' '}
                {pensionerDetails.first_name}
              </p>
              <p className="text-sm">
                <strong className="text-primary">Middle Name:</strong>{' '}
                {pensionerDetails.middle_name || 'N/A'}
              </p>
              <p className="text-sm">
                <strong className="text-primary">Other Name:</strong>{' '}
                {pensionerDetails.other_name || 'N/A'}
              </p>
              <p className="text-sm">
                <strong className="text-primary">Surname:</strong>{' '}
                {pensionerDetails.surname}
              </p>
              <p className="text-sm">
                <strong className="text-primary">Pensioner Number:</strong>{' '}
                {pensionerDetails.pensioner_number}
              </p>
              <p className="text-sm">
                <strong className="text-primary">National ID Number:</strong>{' '}
                {pensionerDetails.national_id_number}
              </p>
            </div>
          ) : (
            <p className="text-red-500 text-center mt-4">
              No pensioner details available.
            </p>
          )}
          <div className="flex justify-between w-full items-center mt-5">
            <MuiButton
              variant="outlined"
              type="error"
              onClick={() => setOpenPensionerDetails(false)}
              sx={{}}
            >
              Cancel
            </MuiButton>{' '}
            {/* import {CircularProgress} from '@mui/material'; */}
            <MuiButton
              variant="contained"
              type="primary"
              onClick={() => {
                setBtnLoading(true); // Start loading
                setTimeout(() => {
                  setBtnLoading(false); // Stop loading after 2 seconds
                  setOpenPensionerDetails(false); // Close the dialog
                  setConfirmed(true); // Set confirmed to true
                }, 2500); // 2 seconds delay
              }}
              sx={{}}
            >
              {btnLoading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: '#fff', marginRight: '8px' }}
                />
              ) : (
                'Confirm'
              )}
            </MuiButton>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex gap-2 justify-end">
        {!confirmed ? (
          <MuiButton
            variant="outlined"
            type="primary"
            onClick={handleConfirmPensionerDetails}
            sx={{}}
          >
            Confirm Pensioner Details
          </MuiButton>
        ) : (
          <MuiButton
            variant="contained"
            type="primary"
            onClick={handleSave}
            sx={{}}
          >
            Report Deceased Case
          </MuiButton>
        )}
      </div>

      <div className="flex flex-col mb-3">
        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
          Principal Pensioner ID Card Number
          <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
            *
          </div>
        </label>
        <TextField
          type="text"
          name="principal_pensioner_id_card_number"
          variant="outlined"
          size="small"
          value={formData['principal_pensioner_id_card_number'] || ''}
          onChange={(e) => handleInputChange(e)}
          error={!!errors['principal_pensioner_id_card_number']}
          helperText={errors['principal_pensioner_id_card_number']}
          required={true}
          fullWidth
        />
      </div>

      {confirmed && (
        <>
          <div className="my-2">
            <p className="italic text-primary font-semibold text-[13px] mb-1 flex items-center gap-1">
              These are the required documents:
              <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                *
              </div>
            </p>
            {renderRequiredDocumentsTable()}
          </div>

          <Divider
            sx={{
              my: 4,
            }}
          />
          <p className="italic text-primary font-semibold text-[13px] mb-1 flex items-center gap-1">
            Upload atleast one other document:
          </p>

          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <label className="text-xs font-semibold text-gray-600">
                {field.label}
              </label>
              {field.type === 'text' ? (
                <TextField
                  type={field.type}
                  name={field.name}
                  variant="outlined"
                  size="small"
                  value={formData[field.name] || ''}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  fullWidth
                />
              ) : (
                <Autocomplete
                  options={field.options}
                  getOptionLabel={(option) =>
                    field.searchByAccountNo ? option.accountNo : option.name
                  }
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: newValue ? newValue.id : '', // Ensure empty value if nothing is selected
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      name={field.name}
                    />
                  )}
                  value={
                    (field.options.length > 0 &&
                      field.options.find(
                        (option) => option.id === formData[field.name]
                      )) ||
                    null
                  }
                  renderOption={(props, option, { selected }) => (
                    <div className="">
                      <li
                        {...props}
                        style={{
                          border: 'none',
                          boxShadow: 'none',
                          backgroundColor: selected ? '#B2E9ED' : 'white',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            pr: '40px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 3,
                            }}
                          >
                            <p
                              className="text-primary font-normal text-[12px] items-start"
                              style={{ alignSelf: 'flex-start' }}
                            >
                              {option.igcType}
                            </p>
                            <p
                              className="text-[12px] items-center"
                              style={{ alignSelf: 'flex-center' }}
                            >
                              {option.name}
                            </p>
                          </Box>
                        </Box>
                      </li>
                    </div>
                  )}
                  ListboxProps={{
                    sx: {
                      padding: 0,
                      '& ul': {
                        padding: 0,
                        margin: 0,
                      },
                      // Additional styling for the listbox
                    },
                  }}
                  PopperComponent={(props) => (
                    <Popper {...props}>
                      {/* Header */}
                      <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
                        <p className="text-xs font-normal">Igc Type</p>
                        <p className="text-xs font-normal">Name</p>
                      </li>
                      {props.children}
                    </Popper>
                  )}
                />
              )}
            </div>
          ))}

          {renderUploadFields()}
        </>
      )}

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '90vh',
            minWidth: '55vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        {previewContent}
      </Dialog>
    </div>
  );
}

export default DependantsEnrollment;
