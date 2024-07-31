"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  MenuItem,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import endpoints from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";
import { useMda } from "@/context/MdaContext";
import { message } from "antd";

function PreclaimsNotifications({
  isSendNotificationEnabled,
  fetchAllPreclaims,
  openNotification,
  setOpenNotification,

  selectedRows,
}) {
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [periodEndDate, setPeriodEndDate] = useState("");
  const [comments, setComments] = useState("");

  const { mdaId } = useMda();

  console.log("selected Rows notifi *******", selectedRows);

  const handleCancel = () => {
    setOpenNotification(false);
  };

  const { setAlert } = useAlert();

  const formatDateToISOString = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas);
      setMdas(res.data.data);
    } catch (error) {
      console.error("Error fetching MDAs:", error);
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []); // [2]

  const handleSend = async () => {
    const ids = selectedRows.map((row) => row.id);
    const currentDate = new Date();
    const oneMinuteLater = new Date(currentDate.getTime() + 60000); // Adding 1 minute

    const formatDateToISOString = (date) => {
      return date.toISOString();
    };

    if (mdaId === "" || mdaId === null) {
      message.error("Login as an MDA user to send notifications");
      return;
    }

    const data = {
      mda_id: mdaId,
      schedule_start_date: formatDateToISOString(currentDate),
      period_end_date: formatDateToISOString(oneMinuteLater),
      comments: comments,
      lines: ids.map((id) => ({ prospective_pensioner_id: id })),
    };

    try {
      const res = await apiService.post(
        preClaimsEndpoints.sendNotifications,
        data
      );

      if (res.data.succeeded === true) {
        await fetchAllPreclaims();
        setAlert({
          message: "Notification sent successfully",
          severity: "success",
          open: true,
        });

        //  message.success("Notification sent successfully");
      } else {
        if (Array.isArray(res.data.messages) && res.data.messages.length > 0) {
          message.error(res.data.messages[0]);
        } else {
          message.error("Failed to send notification");
        }
      }
    } catch (error) {
      console.log(error.response);
      console.log("data", data);
    } finally {
      setOpenNotification(false);
    }
  };

  //const [mdas, setMdas] = useState([]); // [1

  return (
    <Dialog
      open={
        openNotification && isSendNotificationEnabled && selectedRows.length > 0
      }
      onClose={() => setOpenNotification(false)}
      fullWidth
      maxWidth="sm"
      sx={{
        padding: "20px",
      }}
    >
      <div className="p-8">
        {" "}
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h5 className="text-[19px] text-primary font-semibold">
              Send Notifications
            </h5>
          </div>
        </div>
        <div className="p-6">
          {/* <div className="mb-4">
            <label
              htmlFor="scheduleStartDate"
              className="block text-xs font-medium text-gray-700"
            >
              Schedule Start Date
            </label>

            <TextField
              variant="outlined"
              size="small"
              value={scheduleStartDate}
              onChange={(e) => setScheduleStartDate(e.target.value)}
              required
              type="datetime-local"
              fullWidth
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="periodEndDate"
              className=" text-xs font-medium text-gray-700"
            >
              Period End Date
            </label>
            <TextField
              type="datetime-local"
              variant="outlined"
              size="small"
              value={periodEndDate}
              onChange={(e) => setPeriodEndDate(e.target.value)}
              required
              fullWidth
            />
          </div> */}
          <div>
            <label
              htmlFor="comments"
              className=" text-xs font-medium text-gray-700"
            >
              Comments
            </label>
            <TextareaAutosize
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              minRows={3}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid gray",
              }}
            />
          </div>
          {/* <div className="flex flex-col gap-1">
            <label
              htmlFor="comments"
              className=" text-xs font-medium text-gray-700 pt-3 pb-2"
            >
              Select MDA
            </label>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              name="mda_id"
              value={mdaId}
              onChange={(e) => setMdaId(e.target.value)}
              className="mt-1 block w-full bg-gray-100 rounded-md border-gray-400"
            >
              <MenuItem value="">Select Mda</MenuItem>
              {mdas.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>{" "} */}
        </div>
        <div className="flex gap-8 w-full justify-between px-5 mt-3">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default PreclaimsNotifications;
