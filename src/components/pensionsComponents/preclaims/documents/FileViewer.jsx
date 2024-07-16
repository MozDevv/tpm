import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { Viewer } from "react-doc-viewer";

const FileViewer = ({ fileBase64 }) => {
  const [fileType, setFileType] = useState("");

  const handleFileLoad = () => {
    // Determine the file type based on the base64 data
    if (fileBase64.startsWith("data:application/pdf")) {
      setFileType("pdf");
    } else if (
      fileBase64.startsWith(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) ||
      fileBase64.startsWith("data:application/msword")
    ) {
      setFileType("doc");
    } else {
      // Handle other file types as needed
      setFileType("");
    }
  };

  return (
    <div>
      {fileType === "pdf" && (
        <Document file={{ data: fileBase64 }}>
          <Page pageNumber={1} />
        </Document>
      )}
      {fileType === "doc" && (
        <Viewer
          documents={[
            { uri: "data:application/pdf;base64," + fileBase64, type: "doc" },
          ]}
          pluginRendered={() => {
            handleFileLoad();
          }}
        />
      )}
      {/* Add other file type handlers as needed */}
    </div>
  );
};

export default FileViewer;
