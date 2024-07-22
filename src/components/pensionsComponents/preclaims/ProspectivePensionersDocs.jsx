import {
  Typography,
  Box,
  List,
  ListItem,
  Modal,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";

function ProspectivePensionersDocs({ clickedItem }) {
  const id = clickedItem?.id;
  const [awardDocuments, setAwardDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getAwardDocuments = async () => {
      try {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        const documents =
          res.data?.data[0]?.prospectivePensionerDocumentSelections
            .filter((selection) => selection.edms_id !== null)
            .map((selection) => ({
              id: selection.id,
              name: selection.documentType.name,
              description: selection.documentType.description,
              extensions: selection.documentType.extenstions,
              required: selection.required,
              pensioner_upload: selection.pensioner_upload,
            }));
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

  const handleDocumentClick = async (docId) => {
    setLoading(true);
    try {
      const res = await apiService.get(
        `https://tntportalapi.agilebiz.co.ke/api/ProspectivePensioners/getUploadedPensionerSelectionFile?document_selection_id=${docId}`
      );
      setPdfData(res.data?.messages[0]);
      setModalOpen(true);
    } catch (error) {
      console.log("Error fetching document:", error);
      message.error("Failed to fetch document.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPdfData(null);
  };

  return (
    <Box p={1} sx={{ width: "100%", mt: 2, pl: 3 }}>
      <Typography variant="h6" sx={{ color: "primary.main" }} mb={1}>
        Submitted Documents
      </Typography>

      <List sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
        {awardDocuments.map((doc, index) => (
          <ListItem
            key={index}
            sx={{ pl: 3, cursor: "pointer" }}
            onClick={() => handleDocumentClick(doc.id)}
          >
            <p className="text-sm text-gray-700 text-medium underline">
              {doc.name}
            </p>
          </ListItem>
        ))}
      </List>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            padding: 2,
            overflow: "auto",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            pdfData && (
              <embed
                src={`data:application/pdf;base64,${pdfData}`}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            )
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default ProspectivePensionersDocs;
