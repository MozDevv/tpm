import claimsEndpoints, { apiService } from "@/components/services/claimsApi";
import preClaimsEndpoints from "@/components/services/preclaimsApi";
import { useAlert } from "@/context/AlertContext";
import { Button, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";

function SendForApproval({
  clickedItem,
  setOpenPreclaimDialog,
  setOpenCreateClaim,
}) {
  const [comments, setComments] = useState("");

  const { alert, setAlert } = useAlert();

  const [errors, setErrors] = useState({
    status: false,
    message: "",
  });

  const handleCreateClaim = async () => {
    if (!comments || comments.length < 20) {
      setErrors({
        status: true,
        message: "Comments must be atleast 20 characters",
      });

      return;
    }

    const data = {
      prospective_pensioner_ids: [clickedItem.id],
      comments,
    };

    try {
      const response = await apiService.post(
        preClaimsEndpoints.submitForApproval,
        data
      );
      console.log(response);
      console.log("data", data);
      if (response.status === 200) {
        setAlert({
          open: true,
          message: "Submitted for approval successfully",
          severity: "success",
        });
        setOpenCreateClaim(false);
        setOpenPreclaimDialog(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenCreateClaim(false);
      // setOpenPreclaimDialog(false);
    }
  };

  return (
    <div>
      {" "}
      <div className="p-8 h-[100%]">
        <p className="text-primary relative font-semibold text-lg mb-2">
          Submit for Approval
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
            onClick={handleCreateClaim}
            variant="contained"
            fullWidth
            color="primary"
          >
            Create
          </Button>
        </div>
        {errors.status && (
          <div className="mt-2 text-red-500 text-sm">{errors.message}</div>
        )}
      </div>
    </div>
  );
}

export default SendForApproval;
