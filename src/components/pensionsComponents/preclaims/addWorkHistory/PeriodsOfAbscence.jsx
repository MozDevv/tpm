"use client";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";
import { message } from "antd";
import { useMda } from "@/context/MdaContext";
import EditableTable from "@/components/baseComponents/EditableTable";

function PeriodsOfAbsence({ id, status }) {
  const [periodsOfAbsence, setPeriodsOfAbsence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { alert, setAlert } = useAlert();

  const fetchPeriodsOfAbsence = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPeriodsOfAbsence(id)
      );
      setPeriodsOfAbsence(res.data.data);
      setLoading(false);
      console.log("Period of Absence", res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodsOfAbsence();
  }, [id]);

  const fields = [
    { label: "Start Date", value: "start_date", type: "date" },
    { label: "End Date", value: "end_date", type: "date" },
    {
      label: "Cause Of Absence",
      value: "cause_of_absence",
      type: "select",
      options: [
        "Absenteeism",
        "Suspension",
        "Interdiction",
        "Unpaid Maternity Leave",
        "Study Leave",
        "Sick Leave",
        "Condoned Leave",
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (data) => {
    const formattedFormData = { ...data, prospective_pensioner_id: id };
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      if (data.id) {
        const res = await apiService.post(
          preClaimsEndpoints.UpdatePeriodsOfAbsence,
          {
            ...formattedFormData,
            id: editId,
          }
        );

        if (res.status === 200 && res.data.succeeded) {
          fetchPeriodsOfAbsence();
          setOpen(false);
          message.success("Period of Absence updated successfully");
        } else if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.message.length > 0
        ) {
          message.error(res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await apiService.post(
          preClaimsEndpoints.createPeriodsOfAbsence,
          formattedFormData
        );

        if (res.status === 200 && res.data.succeeded) {
          fetchPeriodsOfAbsence();
          setOpen(false);

          message.success("Period of Absence added successfully");
        }
        if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
          throw new Error("An error occurred while submitting the data.");
        }
      }
    } catch (error) {
      throw error;
      console.log(error);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState();

  const handleEdit = (item) => {
    const formattedItem = {
      ...item,
      start_date: dayjs(item.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(item.end_date).format("YYYY-MM-DD"),
    };

    setFormData(formattedItem);
    setOpen(true);
    setEditId(item.id);
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(
        preClaimsEndpoints.deletePeriodsOfAbsence(recordId)
      );
      fetchPeriodsOfAbsence();
      setAlert({
        open: true,
        message: "Periods of abscence deleted successfully",
        severity: "success",
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();
  const { activeCapName } = useMda();

  return (
    <div className="">
      <div className="mt-4">
        <EditableTable
          fetchData={fetchPeriodsOfAbsence}
          fields={fields}
          initialData={periodsOfAbsence}
          title="Periods of Absence"
          handleSave={handleSubmit}
          handleUpdate={handleSubmit}
        />
      </div>
    </div>
  );
}

export default PeriodsOfAbsence;
