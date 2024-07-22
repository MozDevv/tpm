import React, { useEffect, useState } from "react";
import { Table, Upload, Modal, message, Tooltip } from "antd";
import { Button, Chip } from "@mui/material";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import Spinner from "@/components/spinner/Spinner";
import { useRouter } from "next/navigation";

const AddDocuments = ({ id }) => {
  const [awardDocuments, setAwardDocuments] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAwardDocuments = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getAwardDocuments(id)
      );
      const documents =
        res.data?.data[0]?.prospectivePensionerDocumentSelections
          ?.map((selection) => ({
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
          }))
          .filter((doc) => !doc.pensioner_upload) || [];

      setAwardDocuments(documents);
    } catch (error) {
      console.log("Error fetching award documents:", error);
      message.error("Failed to fetch award documents.");
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

  // Handle file change and upload
  const handleChange = async (info, record) => {
    const { file } = info;

    if (file.status === "uploading") return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("submissions[0].document_selection_id", record.id);
    formData.append("submissions[0].uploaded_file", file.originFileObj);
    formData.append("is_mda", true);

    try {
      const res = await axios.post(
        "https://tntportalapi.agilebiz.co.ke/api/ProspectivePensioners/ReceiveProspectivePensionerDocuments",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        message.success("File uploaded successfully");
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
        // window.location.reload();
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("File upload failed.");
    }
  };

  // Handle file preview
  const handlePreview = async (record) => {
    setLoading(true);
    try {
      const res = await apiService.get(
        `https://tntportalapi.agilebiz.co.ke/api/ProspectivePensioners/getUploadedPensionerSelectionFile?document_selection_id=${record.id}`
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
        message.error("No preview available for this document.");
      }
    } catch (error) {
      console.log("Error fetching document:", error);
      message.error("Failed to fetch document.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    router.push("/pensions/preclaims/listing/");
  };

  const columns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <>
          {name}{" "}
          {record.has_two_sides && (
            <Chip
              label={record.side}
              size="small"
              variant="contained"
              sx={{
                maxHeight: "20px",
                fontSize: "10px",
                mb: "8px",
                borderWidth: "2px",
              }}
              color={record.side === "Front" ? "primary" : "secondary"}
            />
          )}
        </>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "uploaded",
      key: "uploaded",
      render: (_, record) =>
        record.edms_id ? (
          <Button sx={{ color: "green", fontSize: "12px" }}>Uploaded</Button>
        ) : (
          <Button sx={{ color: "red", fontSize: "12px" }}>Not Uploaded</Button>
        ),
    },
    {
      title: "Extensions",
      dataIndex: "extensions",
      key: "extensions",
    },
    {
      title: "Select File",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Upload
          name="file"
          showUploadList={false}
          onChange={(info) => handleChange(info, record)}
        >
          <Button
            startIcon={<UploadOutlined />}
            variant="outlined"
            size="small"
          >
            Select File
          </Button>
        </Upload>
      ),
    },
    {
      title: "Selected File",
      dataIndex: "selectedFile",
      key: "selectedFile",
      width: 250,
      ellipsis: true,
      render: (_, record) => {
        const file = fileList.find((f) => f.uid === record.id);
        const fileName = file
          ? file.name
          : record?.uploadedDetails || "No file selected";
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
      title: "Preview File",
      dataIndex: "preview",
      key: "preview",
      render: (_, record) => (
        <Button
          variant="contained"
          onClick={() => handlePreview(record)}
          disabled={!record.edms_id}
          size="small"
        >
          Preview
        </Button>
      ),
    },
  ];

  const handlePrevious = () => {
    router.push(`/pensions/preclaims/listing/new/add-work-history?id=${id}`);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center gap-8 mb-3 justify-end mr-8">
            <Button variant="outlined" onClick={handlePrevious}>
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploadButtonDisabled}
              sx={{
                backgroundColor: uploadButtonDisabled ? "#ccc" : undefined,
              }}
            >
              Finish
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={awardDocuments}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width="80%"
            bodyStyle={{ height: 800, overflowY: "auto" }}
            style={{ top: 20 }}
          >
            {previewContent}
          </Modal>
        </>
      )}
    </>
  );
};

export default AddDocuments;
