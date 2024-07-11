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
import { useAuth } from "@/context/AuthContext";

function NewPreclaim({
  openCreate,
  setOpenCreate,
  fetchAllPreclaims,
  permissions,
}) {
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
    country_id: "94ece052-7142-477a-af0f-c3909402d247",
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

  const [counties, setCounties] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchCountiesAndContituencies = async () => {
    try {
      const res = await apiService.get(endpoints.getCounties);
      const rawData = res.data.data;
      setCounties(rawData);

      console.log("first", rawData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCountries = async () => {
    try {
      const res = await apiService.get(endpoints.getCountries);

      setCountries(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchMdas();
    fetchPensionAwards();
    fetchCountiesAndContituencies();
    fetchCountries();
  }, []);

  const sections = [
    {
      title: "General Information",
      state: useState(true),
      fields: [
        { label: "Personal Number", name: "personal_number", type: "text" },

        { label: "First Name", name: "first_name", type: "text" },
        { label: "Surname", name: "surname", type: "text" },
        { label: "Other Name", name: "other_name", type: "text" },
        { label: "Date of Birth", name: "dob", type: "date" },
        {
          label: "Type Of Identification",
          name: "identifier_type",
          type: "select",
          children: [
            {
              id: 0,
              name: "National ID",
            },
            {
              id: 1,
              name: "Passport No",
            },
          ],
        },

        { label: "National ID", name: "national_id", type: "text" },
        {
          label: "Designation and Grade",
          name: "designation_grade",
          type: "text",
        },
        {
          label: "Ministry/Department/Agency",
          name: "mda_id",
          type: "select",
          children: mdas.map((mda) => ({
            id: mda.id,
            name: mda.name,
          })),
        },
        {
          label: "Date of First Appointment",
          name: "date_of_first_appointment",
          type: "date",
        },
        {
          label: "Date of Which Pension will Commence/Date Of Death ",
          name: "date_from_which_pension_will_commence",
          type: "date",
        },
        {
          label: "Pension Award ID",
          name: "pension_award_id",
          type: "select",
          children: pensionAwards.map((award) => ({
            id: award.id,
            name: award.name,
          })),
        },
        { label: "KRA PIN", name: "kra_pin", type: "text" },
        {
          label: "Authority of retirement Ref No.",
          name: "authority_for_retirement_reference",
          type: "text",
        },
        {
          label: "Authority of retirement Date",
          name: "authority_for_retirement_dated",
          type: "date",
        },

        {
          label: "Date of confirmation into pensionable Office",
          name: "date_of_confirmation",
          type: "date",
        },

        {
          label: "Last Basic Salary Amount",
          name: "last_basic_salary_amount",
          type: "number",
        },
      ],
    },
    {
      title: "Payment Details",
      state: useState(true),
      fields: [
        {
          label: "Bank code",
          name: "bank_code",
          placeholder: "",
          type: "text",
        },
        {
          label: "Bank Name",
          name: "bank_name",
          placeholder: "",
          type: "text",
        },
        {
          label: "Bank Branch code",
          name: "bank_branch_code",
          placeholder: "",
          type: "text",
        },
        {
          label: "Bank Branch name",
          name: "bank_branch_name",
          placeholder: "",
          type: "text",
        },

        {
          label: "Account Number",
          name: "account_number",
          placeholder: "",
          type: "text",
        },
      ],
    },
    {
      title: "Contact Details",
      state: useState(true),
      fields: [
        { label: "Postal Address", name: "phone_number", type: "text" },
        { label: "County", name: "county", type: "text" },
        { label: "City/Town", name: "city", type: "text" },
      ],
    },
  ];

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === undefined ||
        formData[key] === null ||
        formData[key] === "" ||
        formData[key] === false
      ) {
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
    <div className="w-full p-2 mt-3 mr-1 h-[95vh] grid grid-cols-12 gap-2">
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
                Data Capture
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
  );
}

export default NewPreclaim;
