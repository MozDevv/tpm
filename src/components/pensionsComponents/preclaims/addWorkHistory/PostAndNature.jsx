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
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";

function PostAndNature({ id }) {
  const [postAndNatureData, setPostAndNatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { alert, setAlert } = useAlert();

  const fetchPostandNature = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPostandNatureofSalaries(id)
      );
      setPostAndNatureData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostandNature();
  }, [id]);

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
    const { name, value, type, checked } = e.target;
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
     const res= await apiService.post(
        preClaimsEndpoints.createPostAndNatureOfService,
        formattedFormData
      );

      if (res.status === 200) {
        fetchPostandNature();

        setAlert({
          open: true,
          message: "Post and Nature of Service added successfully",
          severity: "success",
        });

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-10">
          <h1 className="text-base font-semibold text-primary py-2 mb-3">
            Add Post and Nature of Service
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
                    className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
                  />
                ) : field.type === "radio" ? (
                  <RadioGroup
                    name={field.value}
                    onChange={handleInputChange}
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
                      defaultValue=""
                      size="small"
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
                    onChange={handleInputChange}
                    className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
                  />
                )}
              </div>
            ))}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
              Submit
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
        onClick={() => setOpen(true)}
      >
        Add Post and Nature of Service
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Post</TableCell>
              <TableCell>Was Pensionable</TableCell>
              <TableCell>Nature of Salary Scale</TableCell>
              <TableCell>Nature of Service</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postAndNatureData.map((item, index) => (
              <TableRow key={item.prospective_pensioner_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.post}</TableCell>
                <TableCell>{item.was_pensionable ? "Yes" : "No"}</TableCell>
                <TableCell>{item.nature_of_salary_scale}</TableCell>
                <TableCell>{item.nature_of_service}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PostAndNature;
