import React, { useEffect, useState } from "react";
import { Table, Upload, Button, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AwardsComponent = ({ award }) => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);

  const [incomingAward, setIncomingAward] = useState();
  const [awardDocs, setAwardDocs] = useState([]);

  useEffect(() => {
    console.log(" AWARD ", award);
    if (award && award.awardDocuments) {
      console.log(" AWARD DOCUMENTS ", award.awardDocuments, " AWARD ", award);
      setIncomingAward(award);
      setAwardDocs(
        award.awardDocuments.map((item) => ({
          description: item.description,
          extensions: item.extenstions,
          id: item.id,
          name: item.name,
          pensioner_upload: item.pensioner_upload,
          required: item.required,
        }))
      );
      fetchUserFiles(award.retiree_id);
    }
  }, [award]);

  useEffect(() => {
    const hasRequiredFields = awardDocs.every((doc) => doc.required);

    setUploadButtonDisabled(
      !hasRequiredFields || fileList.length !== awardDocs.length
    );
  }, [fileList, awardDocs]);

  const fetchUserFiles = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:50120/api/Files/user/${userId}`
      );
      const fetchedFiles = response.data;

      // Update fileList with fetched files
      const updatedFileList = fetchedFiles.map((file) => ({
        uid: file.id,
        name: file.name,
        buffer: file.buffer,
      }));
      setFileList(updatedFileList);

      // Enable preview and disable upload button if files exist
      if (updatedFileList.length > 0) {
        setUploadButtonDisabled(true);
      } else {
        setUploadButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
      message.error("Failed to fetch user files.");
    }
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
          style={{ width: "100%" }}
          src={URL.createObjectURL(file.originFileObj)}
        />
      );
    } else if (fileType === "application/pdf") {
      previewContent = (
        <iframe
          title="preview"
          src={URL.createObjectURL(file.originFileObj)}
          style={{ width: "100%", height: "500px" }}
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

  const handleChange = (info, record) => {
    const { file } = info;

    if (!file.originFileObj) {
      return;
    }

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

    if (updatedFileList.length === awardDocs.length) {
      setUploadButtonDisabled(false);
    } else {
      setUploadButtonDisabled(true);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("UserId", incomingAward.retiree_id);
    fileList.forEach((file) => {
      formData.append("Files", file.originFileObj);
    });

    try {
      const response = await axios.post(
        "https://localhost:50120/api/Files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
      message.success("Files uploaded successfully");
      setFileList([]);
      setUploadButtonDisabled(true);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Files upload failed.");
    }
  };

  const columns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Extensions",
      dataIndex: "extensions",
      key: "extensions",
      // render: (extensions) => extensions,
    },
    {
      title: "Select File",
      dataIndex: "select",
      key: "select",
      render: (text, record) => (
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
      render: (text, record) => {
        const file = fileList.find((f) => f.uid === record.id);
        return file ? file.name : "No file selected";
      },
    },
    {
      title: "Preview File",
      dataIndex: "preview",
      key: "preview",
      render: (text, record) => {
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
      <Table columns={columns} dataSource={awardDocs} pagination={false} />
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={uploadButtonDisabled}
      >
        Upload Selected Files
      </Button>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewContent}
      </Modal>
    </>
  );
};

export default AwardsComponent;
