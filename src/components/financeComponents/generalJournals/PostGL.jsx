import { parseDate } from "@/utils/dateFormatter";
import { Button, DialogActions, IconButton, Typography } from "@mui/material";
import { Alert, List, message } from "antd";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { formatNumber } from "@/utils/numberFormatters";
import financeEndpoints, { apiService } from "@/components/services/financeApi";
import { CheckCircleOutline } from "@mui/icons-material";

function PostGL({
  selectedRows,
  setSelectedRows,
  setOpenPostGL,
  setOpenBaseCard,
  clickedItem,
}) {
  const getDocumentName = (documentType) => {
    const options = [
      { id: 0, name: "Payment Voucher" },
      { id: 1, name: "Purchase Invoice" },
      { id: 2, name: "Sales Invoice" },
      { id: 3, name: "Receipt" },
      { id: 4, name: "Purchase Credit Memo" },
      { id: 5, name: "Sales Credit Memo" },
      { id: 6, name: "Journal Voucher" },
    ];

    const selectedOption = options.find((option) => documentType === option.id);
    return selectedOption ? selectedOption.name : "";
  };

  const [errors, setErrors] = React.useState({
    status: false,
    message: "",
  });

  useEffect(() => {
    if (clickedItem) {
      setSelectedRows([clickedItem]);
    }
  }, [clickedItem, setSelectedRows]);
  const handlePostToGL = async () => {
    const selectedJournals = selectedRows.map((journal) => {
      return {
        journalId: journal.id,
        documentType: journal.documentType,
        documentNo: journal.documentNo,
      };
    });

    const data = {
      journals: selectedJournals,
    };

    try {
      const res = await apiService.post(
        financeEndpoints.postGeneralJournalsToLedger,
        data
      );

      if (res.data.succeeded && res.status === 200) {
        setSelectedRows([]);
        setOpenPostGL(false);
        setOpenBaseCard && setOpenBaseCard(false);
        message.success("General Journal(s) posted to GL successfully");
      } else if (res.data.messages.length > 0 && res.data.succeeded === false) {
        setErrors({
          status: true,
          message: res.data.messages[0],
        });
        message.error(res.data.messages[0]);
      } else {
        message.error("Failed to post General Journal(s) to GL");
      }
    } catch (error) {
      console.error("Error posting to GL:", error);
    }
  };
  return (
    <div className="p-5">
      <div className="flex  px-3 flex-col">
        <div className="flex items-center gap-2">
          <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
            Post to Ledger(s)
          </h5>
        </div>
        {errors.status && (
          <div className="w-full mt-2">
            <Alert message={errors.message} type="error" showIcon closable />
          </div>
        )}
        {selectedRows.length > 0 && (
          <div className="py-3 mx-5 flex flex-col">
            <div className="text-primary mt-3 text-[15px] font-normal mb-6">
              List of General Journal(s) to be posted
            </div>
            <TableContainer sx={{ maxHeight: "400px" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Type</TableCell>
                    <TableCell>Posting Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRows.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: "bold" }}
                      >
                        {getDocumentName(doc.documentType)}
                      </TableCell>

                      <TableCell>{parseDate(doc.postingDate)}</TableCell>

                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatNumber(doc.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
      <DialogActions
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          px: "25px",
          mt: "20px",
        }}
      >
        <Button
          onClick={() => {
            setOpenPostGL(false);
            setSelectedRows([]);
          }}
          color="error"
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePostToGL}
          color="primary"
          variant="contained"
          size="small"
          startIcon={<CheckCircleOutline />}
        >
          Post Journal
        </Button>
      </DialogActions>
    </div>
  );
}

export default PostGL;
