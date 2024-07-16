import React, { useEffect, useState } from "react";
import { Table, Upload, Button, Modal, message, Tooltip } from "antd";
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

  useEffect(() => {
    const getAwardDocuments = async () => {
      try {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        console.log("Award documents:", res.data?.data[0]);
        const documents =
          res.data?.data[0]?.prospectivePensionerDocumentSelections?.map(
            (selection) => ({
              id: selection.id,
              name: selection.documentType.name,
              description: selection.documentType.description,
              extensions: selection.documentType.extenstions,
              required: selection.required,
              pensioner_upload: selection.pensioner_upload,
            })
          );

        // Filter documents to upload based on pensioner_upload: false
        // const uploadableDocuments = !documents.filter(
        //   (doc) => !doc.pensioner_upload
        // );

        setAwardDocuments(documents);
      } catch (error) {
        console.log("Error fetching award documents:", error);
        message.error("Failed to fetch award documents.");
      } finally {
        setLoading(false);
      }
    };

    getAwardDocuments();
  }, [id]);

  useEffect(() => {
    // Check if all required documents are uploaded
    const requiredDocumentsUploaded = awardDocuments.every(
      (doc) => !doc.required || fileList.some((file) => file.uid === doc.id)
    );

    setUploadButtonDisabled(!requiredDocumentsUploaded);
  }, [fileList, awardDocuments]);

  const handleChange = async (info, record) => {
    const { file } = info;

    if (!file.originFileObj) {
      return;
    }
    if (file.status === "uploading") {
      return;
    }

    /*
    const allowedExtensions = record.extensions.split(","); // Assuming extensions are comma-separated in the extensions field

    const fileExtension =
      `.${file.name.split(".").pop().toLowerCase()}` === ".docx"
        ? ".doc"
        : `.${file.name.split(".").pop().toLowerCase()}`;

    console.log("fileExtension", fileExtension);
    if (!allowedExtensions.includes(fileExtension)) {
      message.error(
        `Invalid file extension. Allowed extensions are: ${record.extensions}`
      );
      return;
    }
*/
    const formData = new FormData();
    formData.append("id", id);
    formData.append("submissions[0].document_selection_id", record.id);
    formData.append("submissions[0].uploaded_file", file.originFileObj);
    formData.append("is_mda", true);

    console.log("formData", formData);
    console.log("file", file.originFileObj);
    console.log("file 2", file);

    try {
      const response = await axios.post(
        "https://pmis.agilebiz.co.ke/api/ProspectivePensioners/ReceiveProspectivePensionerDocuments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
      message.success("File uploaded successfully");

      // Update fileList state if needed
      const updatedFileList = [
        ...fileList.filter((f) => f.uid !== record.id),
        {
          uid: record.id,
          name: `${record.name}_${Date.now()}_${file.name}`,
          status: file.status,
          url: file.url,
          originFileObj: new File(
            [file.originFileObj],
            `${record.name}_${Date.now()}_${file.name}`,
            {
              type: file.originFileObj.type,
            }
          ),
        },
      ];
      setFileList(updatedFileList);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("File upload failed.");
    } finally {
      const updatedFileList = [
        ...fileList.filter((f) => f.uid !== record.id),
        {
          uid: record.id,
          name: `${record.name}_${Date.now()}_${file.name}`,
          status: file.status,
          url: file.url,
          originFileObj: new File(
            [file.originFileObj],
            `${record.name}_${Date.now()}_${file.name}`,
            { type: file.originFileObj.type }
          ),
        },
      ];

      setFileList(updatedFileList);
    }
  };

  const router = useRouter();
  const handleUpload = () => {
    router.push("/pensions/preclaims/listing/");
  };

  const handlePreview = async (file) => {
    if (!file || !file.originFileObj) {
      message.error("File preview is not available.");
      return;
    }

    let previewContent = null;
    const fileType = file.originFileObj.type;

    if (fileType.startsWith("image/")) {
      previewContent = (
        <img
          alt="preview"
          style={{ maxWidth: "100%", maxHeight: "70vh" }}
          src={URL.createObjectURL(file.originFileObj)}
        />
      );
    } else if (fileType === "application/pdf") {
      previewContent = (
        <iframe
          title="preview"
          src={URL.createObjectURL(file.originFileObj)}
          style={{ width: "100%", height: "70vh" }}
        />
      );
    } else if (
      fileType.startsWith("text/") ||
      fileType === "application/msword"
    ) {
      const text = await file.originFileObj.text();
      previewContent = (
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {text}
        </pre>
      );
    } else {
      previewContent = <p>Preview not available for this file type.</p>;
    }

    setPreviewTitle(file.name);
    setPreviewContent(previewContent);
    setPreviewVisible(true);
  };

  const columns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          <Button icon={<UploadOutlined />}>Select File</Button>
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
        const fileName = file ? file.name : "No file selected";
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
      render: (_, record) => {
        const file = fileList.find((f) => f.uid === record.id);
        return (
          <Button
            type="primary"
            onClick={() => handlePreview(file)}
            disabled={!file}
          >
            Preview
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={uploadButtonDisabled}
              style={{
                marginRight: "20px",
                marginBottom: "10px",
              }}
            >
              Upload
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
          >
            {previewContent}
          </Modal>
        </>
      )}
    </>
  );
};

export default AddDocuments;
