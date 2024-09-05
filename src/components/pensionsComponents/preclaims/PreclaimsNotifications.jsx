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
import { List, message } from "antd";
import { useAuth } from "@/context/AuthContext";

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

  const { auth } = useAuth();

  const handleSend = async () => {
    setComments(
      `Notification sent to prospective retiree at ${new Date().toLocaleString()} by ${
        auth?.user?.email
      }`
    );
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

  const [mdas, setMdas] = useState([]); // [1

  const [awardDocuments, setAwardDocuments] = useState([]);

  const fetchAwardDocuments = async (ids) => {
    try {
      const allDocuments = [];

      for (const id of ids.map((row) => row.id)) {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        const documents =
          res.data?.data[0]?.prospectivePensionerDocumentSelections
            ?.map((selection) => ({
              id: selection.id,
              name: selection.documentType.name,
              description: selection.documentType.description,
              required: selection.required,
              pensioner_upload: selection.pensioner_upload,
            }))
            .filter((doc) => doc.pensioner_upload) || [];

        allDocuments.push(...documents);
      }

      console.log("allDocuments", allDocuments);
      setAwardDocuments(allDocuments);
    } catch (error) {
      console.error("Error fetching award documents:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      fetchAwardDocuments(selectedRows);
      console.log(
        "prospectivePensionerDocumentSelections",
        selectedRows.map((r) => r.id)
      );
    }
  }, [selectedRows]);

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
        maxHeight: "90vh",
      }}
    >
      {/* {JSON.stringify(awardDocuments)} */}
      <div className="p-8">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h5 className="text-[19px] text-primary font-semibold">
              Notify Prospective Retiree(s)
            </h5>
          </div>
        </div>

        {awardDocuments.length > 0 && (
          <div className="py-3 mx-5">
            <div className="text-primary mt-5 text-[15px] font-normal mb-4">
              List of documents to be uploaded by the retiree(s)
            </div>
            <List
              size="small"
              bordered
              style={{
                overflowY: "auto",
                mx: "20px",
              }}
              dataSource={awardDocuments}
              renderItem={(doc) => (
                <List.Item>
                  <p className="font-montserrat">{doc.name}</p>
                </List.Item>
              )}
            />
          </div>
        )}
        {/* <div className="p-6">
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
        </div> */}
        <div className="flex gap-8 w-full justify-between px-5 mt-7">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSend}>
            Notify
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default PreclaimsNotifications;
