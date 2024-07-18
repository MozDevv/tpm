import { useAlert } from "@/context/AlertContext";
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { message } from "antd";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";

function PostAndNature({ id, loading, setLoading }) {
  const [postAndNatureData, setPostAndNatureData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();
  const [dateOfConfirmation, setDateOfConfirmation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPostandNature = async () => {
    try {
      const res = await axios.get(
        `https://pmis.agilebiz.co.ke/api/ProspectivePensioners/GetProspectivePensionerPostAndNatureofSalaries?prospective_pensioner_id=${id}`
      );
      if (res.status === 200) {
        setPostAndNatureData(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostandNature();
    }
  }, [id]);

  const fetchProspectivePensioners = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      setDateOfConfirmation(dayjs(res.data.data[0].date_of_confirmation));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProspectivePensioners();
  }, []);

  const fields = [
    { label: "Date", value: "date", type: "date" },
    { label: "Post", value: "post" },
    {
      label: "Whether Pensionable(Yes/No)",
      value: "was_pensionable",
      type: "radio",
    },
    {
      label: "Nature of Salary Scale",
      value: "nature_of_salary_scale",
      type: "text",
    },
    {
      label: "Nature of Service",
      value: "nature_of_service",
      type: "select",
      options: [
        { id: "Probation", name: "Probation" },
        { id: "Permanent", name: "Permanent" },
        { id: "Temporary", name: "Temporary" },
        { id: "Contract", name: "Contract" },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? JSON.parse(value) : value,
    });
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
        const data = { ...formattedFormData, id: editId };
        res = await apiService.post(
          preClaimsEndpoints.updatePostAndNature,
          data
        );
      } else {
        res = await apiService.post(
          preClaimsEndpoints.createPostAndNatureOfService,
          formattedFormData
        );
      }

      if (res.status === 200 && res.data.succeeded) {
        fetchPostandNature();
        setAlert({
          open: true,
          message: `Post and Nature of Service ${
            isEditMode ? "updated" : "added"
          } successfully`,
          severity: "success",
        });
        setOpen(false);
      }
      if (res.data.validationErrors) {
        const errors = {};
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
        setValidationErrors(errors);
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
      await apiService.post(preClaimsEndpoints.deletePostAndNature(recordId));
      fetchPostandNature();
      setAlert({
        open: true,
        message: "Post and Nature deleted successfully",
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
        <div className="p-10">
          <h1 className="text-base font-semibold text-primary py-2 mb-3">
            {isEditMode ? "Edit" : "Add"} Post and Nature of Service
          </h1>
          <div className="flex flex-col gap-2">
            {fields.map((field) => (
              <div key={field.value}>
                <label className="text-xs font-semibold text-gray-600">
                  {field.label}
                </label>
                {field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    name={field.value}
                    onChange={handleInputChange}
                    className={`border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm ${
                      validationErrors[field.value] ? "border-red-500" : ""
                    }`}
                  />
                ) : field.type === "radio" ? (
                  <RadioGroup
                    name={field.value}
                    onChange={handleInputChange}
                    value={formData[field.value] ? "true" : "false"}
                    className="flex flex-row gap-2"
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                ) : field.type === "select" ? (
                  <FormControl fullWidth>
                    <TextField
                      select
                      name={field.value}
                      onChange={handleInputChange}
                      value={formData[field.value] || ""}
                      size="small"
                      className={`border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm ${
                        validationErrors[field.value] ? "border-red-500" : ""
                      }`}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.value}
                    value={formData[field.value] || ""}
                    onChange={handleInputChange}
                    className={`border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm ${
                      validationErrors[field.value] ? "border-red-500" : ""
                    }`}
                  />
                )}
                {validationErrors[field.value] && (
                  <span className="text-xs text-red-500">
                    {validationErrors[field.value]}
                  </span>
                )}
              </div>
            ))}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </Dialog>
      <p className="my-2 mt-4 text-primary text-[18px] font-semibold">
        Nature and Post of Service
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
        Add Post and Nature of Service
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Post</TableCell>
              <TableCell>Was Pensionable</TableCell>
              <TableCell>Nature of Salary Scale</TableCell>
              <TableCell>Nature of Service</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postAndNatureData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.post}</TableCell>
                <TableCell>{item.was_pensionable ? "Yes" : "No"}</TableCell>
                <TableCell>{item.nature_of_salary_scale}</TableCell>
                <TableCell>{item.nature_of_service}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenDeleteDialog(item.id);
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

export default PostAndNature;
