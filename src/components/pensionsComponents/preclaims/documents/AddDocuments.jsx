import React, { useEffect, useState } from 'react';
import { Table, Upload, Modal, message, Tooltip, Empty } from 'antd';
import { Backdrop, Button, Chip, Dialog, IconButton } from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import Spinner from '@/components/spinner/Spinner';
import { useRouter } from 'next/navigation';
import { BASE_CORE_API } from '@/utils/constants';
import BaseLoadingBackdrop from '@/components/baseComponents/BaseLoadingBackdrop';
import { Cancel, GetApp, Refresh } from '@mui/icons-material';

const AddDocuments = ({ id, moveToPreviousTab, status, clickedItem2 }) => {
  const [awardDocuments, setAwardDocuments] = useState([]);

  //const [awardDocumentsFromPortal, setAwardDocumentsFromPortal] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [clickedDocument, setClickedDocument] = useState(null);
  const router = useRouter();

  const getAwardDocuments = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getAwardDocuments(id)
      );
      const documents =
        res.data?.data[0]?.prospectivePensionerDocumentSelections?.map(
          (selection) => ({
            id: selection.id,
            name: selection.documentType.name,
            description: selection.documentType.description,
            extensions: selection.documentType.extenstions,
            required: selection.required,
            pensioner_upload: selection.pensioner_upload,
            edms_id: selection.edms_id,
            side: selection.side,
            has_two_sides: selection.documentType.has_two_sides,
            uploadedDetails: selection?.uploadedDocumentDetails?.document_name,
          })
        );

      //  .filter((doc) => !doc.pensioner_upload) || [];
      const sortedDocuments = documents.sort(
        (a, b) => a.pensioner_upload - b.pensioner_upload
      );

      setAwardDocuments(sortedDocuments);
      // setAwardDocuments(documents);
    } catch (error) {
      console.log('Error fetching award documents:', error);
      //message.error("Failed to fetch award documents.");
    } finally {
      setLoading(false);
    }
  };
  // Fetch award documents
  useEffect(() => {
    getAwardDocuments();
  }, [id]);

  // Update upload button disabled state
  useEffect(() => {
    const requiredDocumentsUploaded = awardDocuments.every(
      (doc) => !doc.required || doc.edms_id
    );
    setUploadButtonDisabled(!requiredDocumentsUploaded);
  }, [awardDocuments]);

  const handleChange = async (info, record) => {
    setUploading(true);
    const { file } = info;

    const maxSize = 2 * 1024 * 1024; // 2MB size limit

    if (file.status === 'uploading') {
      console.log('Uploading file:', file);
      // return;
    }

    // Validate file size
    if (file.size > maxSize) {
      message.error('File size exceeds 2MB. Please upload a smaller file.');
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('submissions[0].document_selection_id', record.id);
    formData.append('submissions[0].uploaded_file', file.originFileObj);
    formData.append('is_mda', true);

    try {
      const res = await axios.post(
        `${BASE_CORE_API}api/ProspectivePensioners/ReceiveProspectivePensionerDocuments`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.status === 200 && res.data.succeeded) {
        message.success('File uploaded successfully');
        setFileList((prevFileList) => [
          ...prevFileList.filter((f) => f.uid !== record.id),
          {
            uid: record.id,
            name: file.name,
            status: file.status,
            url: file.url,
            originFileObj: file.originFileObj,
          },
        ]);
        getAwardDocuments();
      } else {
        message.error('File upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (record) => {
    setLoading(true);
    try {
      const res = await apiService.get(
        `${BASE_CORE_API}api/ProspectivePensioners/getUploadedPensionerSelectionFile?document_selection_id=${record.id}`
      );
      const base64Data = res.data?.messages[0];
      if (base64Data) {
        setPreviewContent(
          <embed
            src={`data:application/pdf;base64,${base64Data}`}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        );
        setPreviewTitle(record.name);
        setPreviewVisible(true);
      } else {
        message.error('No preview available for this document.');
      }
    } catch (error) {
      console.log('Error fetching document:', error);
      message.error('Failed to fetch document.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    // router.push("/pensions/preclaims/listing/");
  };

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <>
          {name}{' '}
          {record.has_two_sides && record.side && (
            <Chip
              label={record.side}
              size="small"
              variant="contained"
              sx={{
                maxHeight: '20px',
                fontSize: '10px',
                mb: '8px',
                borderWidth: '2px',
              }}
              color={record.side === 'Front' ? 'primary' : 'secondary'}
            />
          )}
        </>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (_, record) =>
        record.edms_id ? (
          record.pensioner_upload ? (
            <Button sx={{ color: 'green', fontSize: '12px', fontWeight: 500 }}>
              Uploaded by retiree
            </Button>
          ) : (
            <Button sx={{ fontSize: '12px', fontWeight: 500 }}>
              Uploaded by MDA user
            </Button>
          )
        ) : (
          <Button sx={{ color: 'red', fontSize: '12px', fontWeight: 500 }}>
            Not Uploaded
          </Button>
        ),
    },
    {
      title: 'Extensions',
      dataIndex: 'extensions',
      key: 'extensions',
    },

    clickedItem2?.notification_status === 2 ||
    clickedItem2?.notification_status === null ||
    clickedItem2?.notification_status === 0 ||
    clickedItem2?.notification_status === 3
      ? {
          title: 'Select File',
          dataIndex: 'select',
          key: 'select',
          render: (_, record) => (
            <Upload
              name="file"
              showUploadList={false}
              onChange={(info) => handleChange(info, record)}
              disabled={record.pensioner_upload}
            >
              <Button
                startIcon={<UploadOutlined />}
                variant="outlined"
                size="small"
                disabled={record.pensioner_upload}
              >
                {record.edms_id ? 'Update File' : 'Select File'}
              </Button>
            </Upload>
          ),
        }
      : {},
    {
      title: 'Uploaded File',
      dataIndex: 'selectedFile',
      key: 'selectedFile',
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const file = fileList.find((f) => f.uid === record.id);
        const fileName = file
          ? file.name
          : record?.uploadedDetails || 'No file uploaded';
        return (
          <Tooltip title={fileName}>
            <span>
              {fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Preview File',
      dataIndex: 'preview',
      key: 'preview',
      render: (_, record) => (
        <Button
          variant="contained"
          onClick={() => {
            handlePreview(record);
            setClickedDocument(record);
          }}
          disabled={!record.edms_id}
          size="small"
        >
          Preview
        </Button>
      ),
    },
  ];

  const handleDownload = () => {
    if (!previewContent) {
      message.error('No preview content available for download.');
      return;
    }

    try {
      // Extract Base64 string from the embed source
      const base64String = previewContent.props.src.split(',')[1];

      // Convert Base64 to a Blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a downloadable link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${clickedDocument?.name || 'document'}.pdf`;
      document.body.appendChild(link);

      // Programmatically trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error during download:', error);
      message.error('Failed to download file.');
    }
  };

  useEffect(() => {
    let timer;
    if (loading || uploading) {
      timer = setTimeout(() => {
        message.error('Failed to load resource');
        setLoading(false);
        setUploading(false);
      }, 60000); // 1 minute
    }

    return () => clearTimeout(timer);
  }, [loading, uploading]);

  return (
    <>
      <div>
        {uploading && (
          <BaseLoadingBackdrop
            open={uploading}
            onClose={() => setUploading(false)}
            message="Document upload in progress, please hold on"
          />
        )}
        {loading && (
          <BaseLoadingBackdrop
            open={loading}
            onClose={() => setLoading(false)}
            message="Loading Files, please hold on"
          />
        )}
      </div>
      <>
        <Table
          columns={columns}
          dataSource={awardDocuments}
          pagination={false}
          scroll={{ x: 'max-content' }}
          style={{
            borderCollapse: 'collapse',
            marginTop: '40px',
          }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    ...props.style,

                    color: '#333', // Header text color
                    fontWeight: 'bold', // Header font weight
                  }}
                />
              ),
            },
            body: {
              row: (props) => (
                <tr
                  {...props}
                  style={{
                    ...props.style,
                    height: '40px', // Adjust row height
                  }}
                />
              ),
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    ...props.style,
                    padding: '8px', // Adjust cell padding
                  }}
                />
              ),
            },
          }}
        />

        <Dialog
          open={previewVisible}
          onClose={() => setPreviewVisible(false)}
          sx={{
            '& .MuiPaper-root': {
              minHeight: '75vh',
              maxHeight: '85vh',
              minWidth: '60vw',
              maxWidth: '35vw',
            },
          }}
        >
          <div
            className="bg-white h-[90px] flex flex-row justify-between pt-2 items-center  px-4 w-full"
            style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mt-1">
                {clickedDocument?.name}
              </h2>
              <p className="text-sm text-gray-500 py-2">
                {clickedDocument?.description}
              </p>
            </div>
            <div className="space-x-4">
              <IconButton onClick={handlePreview}>
                <Refresh />
              </IconButton>
              <Button
                onClick={handleDownload}
                variant="contained"
                color="primary"
                startIcon={<GetApp />}
                className="px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Download PDF
              </Button>
              <Button
                onClick={() => setPreviewVisible(false)}
                variant="outlined"
                color="primary"
                startIcon={<Cancel />}
                className="px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
          {previewContent ? (
            <div className="h-[100vh] overflow-auto">{previewContent}</div>
          ) : (
            <div className="flex items-center justify-center min-h-[65vh]">
              <div className="text-center">
                <Empty description="No PDF available to display." />
              </div>
            </div>
          )}
        </Dialog>
        {/* <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={1000}
          height={800}
          bodyStyle={{ height: '80vh', overflowY: 'auto' }}
          style={{ top: 40, height: '80vh', overflowY: 'auto', zIndex: 2000 }} // Increased zIndex value
          zIndex={2000} // Also add zIndex to Modal
        >
          {previewContent}
        </Modal> */}
      </>
    </>
  );
};

export default AddDocuments;
