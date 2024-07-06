"use client";
import preClaimsEndpoints from "@/components/services/preclaimsApi";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useIsLoading } from "@/context/LoadingContext";
import {
  ExpandLess,
  KeyboardArrowRight,
  OpenInFull,
} from "@mui/icons-material";
import {
  Collapse,
  Dialog,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Icon,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

function CreatePreclaim({ openCreate, setOpenCreate, fetchAllPreclaims }) {
  const { isLoading, setIsLoading } = useIsLoading();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    surname: "",
    first_name: "",
    other_name: "",
    kra_pin: "",
    date_of_confirmation: "",
    dob: "",
    national_id: "",
    email_address: "",
    phone_number: "",
    gender: "",
    personal_number: "",
    last_basic_salary_amount: "",
    retirement_date: "",
    pension_award_id: "",
    mda_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;

    setFormData({ ...formData, [name]: parsedValue });

    // Validation logic
    let error = "";
    if (
      type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email format";
    } else if (type === "number" && value && isNaN(parsedValue)) {
      error = "Must be a number";
    } else if (name === "phone_number" && value && !/^\d+$/.test(value)) {
      error = "Must be a valid phone number";
    } else if (name === "dob" && value) {
      const dobDate = dayjs(value);
      const age = dayjs().diff(dobDate, "year");
      if (age < 18) {
        error = "User must be at least 18 years old";
      }
    } else if (name === "date_of_confirmation" && value && formData.dob) {
      const confirmationDate = dayjs(value);
      const dobDate = dayjs(formData.dob);
      const diff = confirmationDate.diff(dobDate, "year");
      if (diff < 18) {
        error =
          "Date of Confirmation must be at least 18 years after Date of Birth";
      }
    }

    setErrors({ ...errors, [name]: error });
  };

  const [mdas, setMdas] = useState([]);
  const [pensionAwards, setPensionAwards] = useState([]);

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas);
      setMdas(res.data.data);
    } catch (error) {
      console.error("Error fetching MDAs:", error);
    }
  };

  const fetchPensionAwards = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards);
      setPensionAwards(res.data.data);
    } catch (error) {
      console.error("Error fetching Pension Awards:", error);
    }
  };

  useEffect(() => {
    fetchMdas();
    fetchPensionAwards();
  }, []);

  const sections = [
    {
      title: "General Information",
      state: useState(true),
      fields: [
        { label: "Surname", name: "surname", type: "text" },
        { label: "First Name", name: "first_name", type: "text" },
        { label: "Other Name", name: "other_name", type: "text" },
        { label: "KRA PIN", name: "kra_pin", type: "text" },
        {
          label: "Date of Confirmation",
          name: "date_of_confirmation",
          type: "date",
        },
        { label: "Date of Birth", name: "dob", type: "date" },
        { label: "National ID", name: "national_id", type: "text" },
      ],
    },
    {
      title: "Contact Details",
      state: useState(true),
      fields: [
        { label: "Email Address", name: "email_address", type: "email" },
        { label: "Phone Number", name: "phone_number", type: "text" },
        {
          label: "Gender",
          name: "gender",
          type: "select",
          children: [
            {
              id: 1,
              name: "Male",
            },
            {
              id: 0,
              name: "Female",
            },
          ],
        },
        { label: "Personal Number", name: "personal_number", type: "text" },
      ],
    },
    {
      title: "Payment Details",
      state: useState(true),
      fields: [
        {
          label: "Last Basic Salary Amount",
          name: "last_basic_salary_amount",
          type: "number",
        },
        { label: "Retirement Date", name: "retirement_date", type: "date" },
        {
          label: "Pension Award ID",
          name: "pension_award_id",
          type: "select",
          children: pensionAwards.map((award) => ({
            id: award.id,
            name: award.name,
          })),
        },
        {
          label: "MDA ID",
          name: "mda_id",
          type: "select",
          children: mdas.map((mda) => ({
            id: mda.id,
            name: mda.name,
          })),
        },
      ],
    },
  ];

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.dob) {
      const dobDate = dayjs(formData.dob);
      const age = dayjs().diff(dobDate, "year");
      if (age < 18) {
        newErrors.dob = "User must be at least 18 years old";
      }
    }

    if (formData.date_of_confirmation && formData.dob) {
      const confirmationDate = dayjs(formData.date_of_confirmation);
      const dobDate = dayjs(formData.dob);
      const diff = confirmationDate.diff(dobDate, "year");
      if (diff < 18) {
        newErrors.date_of_confirmation =
          "Date of Confirmation must be at least 18 years after Date of Birth";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Don't submit if there are errors
    }

    console.log("Form Data:", formData);
    setIsLoading(true);

    try {
      const res = await apiService.post(
        preClaimsEndpoints.createPreclaim,
        formData
      );

      console.log(res.data);
      fetchAllPreclaims();
    } catch (error) {
      console.log(error.response);
    } finally {
      setOpenCreate(false);

      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={openCreate}
      onClose={() => setOpenCreate(false)}
      fullWidth
      maxWidth="lg"
    >
      <div className="w-full p-2 mt-3 mr-1 h-[75vh] grid grid-cols-12 gap-2">
        <IconButton
          sx={{
            ml: "auto",
            position: "fixed",
            zIndex: 899999999,
            right: 1,
            top: "3px",
          }}
        >
          <Tooltip title="Expand">
            {" "}
            <OpenInFull sx={{ color: "primary.main", fontSize: "18px" }} />
          </Tooltip>{" "}
        </IconButton>
        <div className="col-span-12 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
          <div className="pt-6 sticky top-0 bg-inherit z-50 pb-2">
            <div className="flex items-center justify-between px-6 w-[100%]">
              <div className="flex items-center gap-2">
                <h5 className="text-[17px] text-primary font-semibold">
                  User Information
                </h5>
              </div>
              <div className="flex ">
                {" "}
                <div className="flex gap-8 mr-4">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpenCreate(false);
                      setErrors({});
                    }}
                    sx={{ maxHeight: "40px", mt: "5px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ maxHeight: "40px", mt: "5px" }}
                  >
                    Save
                  </Button>{" "}
                </div>
              </div>
            </div>
            <hr className="border-[1px] border-black-900 my-2" />
          </div>
          <div className="p-6 mt-[-15px]">
            {sections.map((section, index) => {
              const [open, setOpen] = section.state;
              return (
                <div key={index} className="gap-3 my-3">
                  <div className="flex items-center gap-2">
                    <h6 className="font-semibold text-primary text-sm">
                      {section.title}
                    </h6>
                    <IconButton
                      sx={{ ml: "-5px", zIndex: 1 }}
                      onClick={() => setOpen((prevOpen) => !prevOpen)}
                    >
                      {!open ? (
                        <KeyboardArrowRight
                          sx={{ color: "primary.main", fontSize: "14px" }}
                        />
                      ) : (
                        <ExpandLess
                          sx={{ color: "primary.main", fontSize: "14px" }}
                        />
                      )}
                    </IconButton>
                    <hr className="flex-grow border-blue-500 border-opacity-20" />
                  </div>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-2">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-600">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <TextField
                              select
                              variant="outlined"
                              size="small"
                              fullWidth
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              error={!!errors[field.name]} // Show error style if there is an error
                              helperText={errors[field.name]} // Display the error message
                            >
                              <MenuItem value="">Select {field.label}</MenuItem>
                              {field.children.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <TextField
                              type={field.type}
                              name={field.name}
                              variant="outlined"
                              size="small"
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              error={!!errors[field.name]} // Show error style if there is an error
                              helperText={errors[field.name]} // Display the error message
                              required
                              fullWidth
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default CreatePreclaim;
