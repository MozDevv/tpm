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
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";

function PensionableSalary({ id }) {
  const [pensionableSalary, setPensionableSalary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();

  const fetchPensionableSalary = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPensionableSalary(id)
      );
      setPensionableSalary(res.data.data);
      setLoading(false);
      console.log("Pensionable Salary", res.data.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPensionableSalary();
  }, [id]);

  const fields = [
    { label: "Start Date", value: "start_date", type: "date" },
    { label: "End Date", value: "end_date", type: "date" },
    { label: "Salary", value: "salary" },
    { label: "Pensionable Allowance", value: "pensionable_allowance" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formattedFormData = { ...formData, prospective_pensioner_id: id };
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      let res;
      if (isEditMode) {
        res = await apiService.post(
          preClaimsEndpoints.updatePensionableSalary,
          {
            ...formattedFormData,
            id: editId,
          }
        );

        if (res.status === 200) {
          fetchPensionableSalary();
          setOpen(false);
          setAlert({
            open: true,
            message: "Pensionable Salary updated successfully",
            severity: "success",
          });
        }
      } else {
        res = await apiService.post(
          preClaimsEndpoints.createPensionableSalary,
          formattedFormData
        );
      }

      if (res.status === 200) {
        fetchPensionableSalary();
        setOpen(false);
        setAlert({
          open: true,
          message: `Pensionable Salary ${
            isEditMode ? "updated" : "added"
          } successfully`,
          severity: "success",
        });
      }
      if (res?.data?.validationErrors?.length > 0) {
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(
        preClaimsEndpoints.deletePensionableSalary(recordId)
      );
      fetchPensionableSalary();
      setAlert({
        open: true,
        message: "Pensionable Salary deleted successfully",
        severity: "success",
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();

  return (
    <div>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <div className="p-6">
          <h1 className="text-base font-semibold text-primary py-2 mb-3">
            Delete Confirmation
          </h1>
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this record?
          </p>
          <div className="flex justify-between w-full mt-5">
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteDialog(false)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{ backgroundColor: "crimson", color: "white" }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-6">
          <h1 className="text-base font-semibold text-primary py-2 mb-3">
            {isEditMode ? "Edit" : "Add"} Pensionable Salary
          </h1>
          <div className="flex flex-col gap-3">
            {fields.map((field) => (
              <div key={field.value}>
                <label className="text-xs font-semibold text-gray-600">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.value}
                  value={formData[field.value] || ""}
                  onChange={handleInputChange}
                  className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
                />
              </div>
            ))}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </Dialog>
      <p className="my-2 mt-4 text-primary text-[18px] font-semibold">
        Pensionable Salary
      </p>
      <Button
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
        }}
        onClick={() => {
          setFormData({});
          setIsEditMode(false);
          setOpen(true);
        }}
      >
        Add Pensionable Salary
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Pensionable Allowance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pensionableSalary.map((item, index) => (
              <TableRow key={item.prospective_pensioner_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(item.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.salary}</TableCell>
                <TableCell>{item.pensionable_allowance}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenDeleteDialog(true);
                      setRecordId(item.id);
                    }}
                  >
                    <Delete sx={{ color: "crimson" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PensionableSalary;
