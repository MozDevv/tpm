import { useAlert } from "@/context/AlertContext";
import { Button, TextareaAutosize, Dialog } from "@mui/material";
import React, { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { message } from "antd";
import workflowsEndpoints, {
  workflowsApiService,
} from "../services/workflowsApi";

function BaseApprovalCard({
  clickedItem,
  openApprove,
  setOpenApprove,
  approvalType,
  documentNo,
}) {
  const [comments, setComments] = useState("");

  const { alert, setAlert } = useAlert();

  const [errors, setErrors] = useState({
    status: false,
    message: "",
  });

  const { auth } = useAuth();
  const userId = auth.user ? auth.user.userId : null;

  const handleApprove = async () => {
    if (!comments || comments.length < 10) {
      setErrors({
        status: true,
        message: "Comments must be atleast 10 characters",
      });

      return;
    }

    const fieldMapping = {
      1: "userId",
      2: "senderId",
      3: "approverId",
    };

    const fieldName = fieldMapping[openApprove] || "userId";
    const data = {
      documentNo,
      comments,
      [fieldName]: userId,
    };

    try {
      const response = await workflowsApiService.post(
        openApprove === 1
          ? workflowsEndpoints.createApprovalRequest
          : openApprove === 2
          ? workflowsEndpoints.cancelApprovalRequest
          : openApprove === 3
          ? workflowsEndpoints.approve
          : openApprove === 4
          ? workflowsEndpoints.reject
          : workflowsEndpoints.delegate,
        data
      );
      console.log(response);
      console.log("data", data);

      if (response.status === 200) {
        message.success(
          openApprove === 1
            ? `Document ${documentNo} sent for approval`
            : openApprove === 2
            ? `Approval Request Cancelled for ${documentNo}`
            : openApprove === 3
            ? `Document ${documentNo} Approved`
            : openApprove === 4
            ? `Document ${documentNo} Rejected`
            : `Approval Delegated for ${documentNo}`
        );

        setComments("");
        setOpenApprove(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const title =
    openApprove === 1
      ? "Send For Approval"
      : openApprove === 2
      ? "Cancel Approval Request"
      : openApprove === 3
      ? "Approve Document"
      : openApprove === 4
      ? "Reject Document Approval"
      : openApprove === 5
      ? "Delegate Approval"
      : "Approve";

  return (
    <Dialog
      open={openApprove}
      onClose={() => setOpenApprove(false)}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <div>
        {" "}
        <div className="p-8 h-[100%]">
          <p className="text-primary relative font-semibold text-lg mb-2">
            {title}
          </p>

          <div>
            <label
              htmlFor="comments"
              className=" text-xs font-medium text-gray-700"
            >
              Add Comments
            </label>
            <TextareaAutosize
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              error={errors.status}
              minRows={3}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid gray",
              }}
            />
          </div>
          <div className="mt-5">
            {" "}
            <Button
              onClick={handleApprove}
              variant="contained"
              fullWidth
              color="primary"
            >
              {title}
            </Button>
          </div>
          {errors.status && (
            <div className="mt-2 text-red-500 text-sm">{errors.message}</div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default BaseApprovalCard;
