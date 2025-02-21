'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, TextField } from '@mui/material';
import { Button, Table, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CRMBaseInput from './CRMBaseInput';
import endpoints, { apiService } from '../services/setupsApi';
import { Button as MuiButton } from '@mui/material';

function DependantsEnrollment() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [openPensionerDetails, setOpenPensionerDetails] = useState(false);
  const [details, setDetails] = useState([]);
  const [previewContent, setPreviewContent] = useState(null); // State for preview content
  const [previewOpen, setPreviewOpen] = useState(false); // State for preview dialog

  const fields = [
    {
      name: 'principal_pensioner_id_card_number',
      label: 'Principal Pensioner ID Card Number',
      type: 'text',
      required: true,
    },
  ];

  const fileData = [
    {
      name: 'principal_pensioner_id_card_front',
      description: 'Principal Pensioner ID Card Front',
      required: true,
    },
    {
      name: 'principal_pensioner_id_card_back',
      description: 'Principal Pensioner ID Card Back',
      required: true,
    },
  ];

  const otherFields = [
    {
      name: 'death_certificate_number',
      label: 'Death Certificate Number',
      type: 'text',
    },
    {
      name: 'death_certificate',
      label: 'Death Certificate',
      type: 'file',
    },
    {
      name: 'burial_permit_number',
      label: 'Burial Permit Number',
      type: 'text',
    },
    {
      name: 'burial_permit',
      label: 'Burial Permit',
      type: 'file',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  //   const handleFileChange = (info, fieldName) => {
  //     let fileList = [...info.fileList];
  //     fileList = fileList.slice(-1);
  //     setFileList(fileList);

  //     if (info.file.status === 'done') {
  //       const file = info.file.originFileObj;
  //       const pdfUrl = URL.createObjectURL(file); // Create a preview URL
  //       setPreviewContent(
  //         <embed
  //           src={pdfUrl}
  //           type="application/pdf"
  //           width="100%"
  //           height="600px"
  //         />
  //       );
  //       setFormData({ ...formData, [fieldName]: info.file.response });
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   };

  const handleSave = async () => {
    const validationErrors = {};
    [...fields, ...fileData, ...otherFields].forEach((field) => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${
          field.label || field.description
        } is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('data to be saved', formData);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await apiService.post(
        endpoints.confirmPrincipalPensioner,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.succeeded === true) {
        setOpenPensionerDetails(true);
        message.success('Principal Pensioner details successfully retrieved.');
        setDetails(response.data.data);
        console.log('Response:', response.data);
      } else if (
        response.data.succeeded === false &&
        response.data.message[0]
      ) {
        message.error(response.data.message[0]);
      } else {
        message.error('Error occured while processing your request');
      }
    } catch (error) {
      message.error('Failed to save data');
      console.error('Error:', error);
    }
  };

  const handleFileChange = ({ fileList }, fieldName) => {
    const file = fileList[0]?.originFileObj; // Get the first file
    setFileList(fileList);

    if (file) {
      setFormData({ ...formData, [fieldName]: file }); // Store the file object
    }
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
          onChange={(info) => handleFileChange(info, record.name)}
          fileList={fileList.filter((file) => file.name === record.name)}
          beforeUpload={() => false} // Prevent automatic upload
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

  return (
    <div className="p-4 mr-5 rounded-sm relative bg-white shadow-md">
      <Dialog
        open={openPensionerDetails}
        onClose={() => setOpenPensionerDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-primary mb-6">
            Confirm Pensioner Details
          </h2>

          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            {[
              {
                label: 'Full Name',
                value: `${details.first_name} ${details.middle_name} ${details.surname}`,
              },
              { label: 'Other Name', value: details.other_name || 'N/A' },
              { label: 'Pensioner Number', value: details.pensioner_number },
              {
                label: 'National ID Number',
                value: details.national_id_number,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-[1px]"
              >
                <p className="text-sm font-semibold  text-primary">
                  {item.label}:
                </p>
                <p className="text-base text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6 space-x-3">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setOpenPensionerDetails(false)}
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">
              Confirm Details
            </button>
          </div>
        </div>
      </Dialog>

      <MuiButton
        variant="contained"
        type="primary"
        onClick={handleSave}
        sx={{
          display: 'block',
          //align right
          marginLeft: 'auto',
        }}
      >
        Confirm Pensioner Details
      </MuiButton>
      {fields.map((field, index) => (
        <div
          key={index}
          style={{
            flexDirection: 'column',
            display: field.hide === true ? 'none' : 'flex',
            marginBottom: '16px',
          }}
        >
          {field.type !== 'file' && (
            <label className="text-xs font-semibold text-gray-600 flex gap-1 items-center">
              {field.label}
              <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                *
              </div>
            </label>
          )}
          <TextField
            type={field.type}
            name={field.name}
            variant="outlined"
            size="small"
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            required={field.required}
            fullWidth
          />
        </div>
      ))}

      <div className="mb-6">
        <Table
          columns={fileColumns}
          dataSource={fileData}
          pagination={false}
          rowKey="name"
          className="antcustom-table"
        />
      </div>

      {otherFields.map((field, index) => (
        <div
          key={index}
          style={{
            flexDirection: 'column',
            display: field.hide === true ? 'none' : 'flex',
            marginBottom: '16px',
          }}
        >
          {field.type !== 'file' && (
            <label className="text-xs font-semibold text-gray-600">
              {field.label}
            </label>
          )}
          {field.type === 'file' ? (
            <div className="mb-6">
              <Table
                columns={fileColumns}
                dataSource={[{ name: field.name, description: field.label }]}
                pagination={false}
                rowKey="name"
                className="antcustom-table"
              />
            </div>
          ) : (
            <TextField
              type={field.type}
              name={field.name}
              variant="outlined"
              size="small"
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              required={field.required}
              fullWidth
            />
          )}
        </div>
      ))}

      {/* Preview Section */}
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
