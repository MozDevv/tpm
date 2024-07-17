"use client";
import preClaimsEndpoints from "@/components/services/preclaimsApi";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useIsLoading } from "@/context/LoadingContext";
import { BASE_CORE_API } from "@/utils/constants";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

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
    country_id: "",
    city_town: "",
    county_id: "",
    // pension_commencement_date: "",
    designation_grade: "",
    authority_for_retirement_reference: "",
    authority_for_retirement_dated: "",
    date_of_first_appointment: "",
    date_from_which_pension_will_commence: "",
    identifier_type: "",
  });
  const router = useRouter();
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    /*  const parsedValueDate =
      type === "date" ? new Date(value).toLocaleDateString() : value;

  
*/
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
    } else if (name === "national_id" && value && !/^\d+$/.test(value)) {
      error = "Must be a valid National ID";
    } else if (
      name === "kra_pin" &&
      value &&
      !/^[A-Z]\d{9}[A-Z]$/.test(value)
    ) {
      error = "Must be a valid KRA PIN";
    } else if (name === "last_basic_salary_amount" && value && isNaN(value)) {
      error = "Must be a valid number";
    } else if (name === "postal_address" && value && isNaN(value)) {
      error = "Postal Address must be a valid number";
    } else if (
      type === "date" &&
      value &&
      name !== "date_from_which_pension_will_commence" &&
      name !== "retirement_date" &&
      dayjs(value).isAfter(dayjs())
    ) {
      error = "Date cannot be in the future";
    } else if (name === "date_of_confirmation" && value && formData.dob) {
      const dobDate = dayjs(formData.dob);
      const confirmationDate = dayjs(value);
      if (confirmationDate.isBefore(dobDate)) {
        error = "Date of confirmation cannot be before date of birth";
      }
    } else if (name === "retirement_date" && value && formData.dob) {
      const dobDate = dayjs(formData.dob);
      const retirementDate = dayjs(value);
      if (retirementDate.isBefore(dobDate)) {
        error = "Date of retirement cannot be before date of birth";
      } else if (
        name === "date_of_first_appointment" &&
        value &&
        formData.dob
      ) {
        const dobDate = dayjs(formData.dob);
        const appointmentDate = dayjs(value);
        if (appointmentDate.isBefore(dobDate)) {
          error = "Date of first appointment cannot be before date of birth";
        }
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

  const { alert, setAlert } = useAlert();
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
          label: "Gender",
          name: "gender",
          type: "select",
          children: [
            {
              id: 0,
              name: "Male",
            },
            {
              id: 1,
              name: "Female",
            },
          ],
        },
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

        {
          label: "National ID/Passport No.",
          name: "national_id",
          type: "text",
        },
        { label: "KRA PIN", name: "kra_pin", type: "text" },
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

        // {
        //   label: "Pension Commencement Date",
        //   name: "pension_commencement_date",
        //   type: "date",
        // },
      ],
    },

    {
      title: "Contact Details",
      state: useState(true),
      fields: [
        { label: "Email Address", name: "email_address", type: "email" },
        { label: "Postal Address", name: "postal_address", type: "text" },
        { label: "Phone Number", name: "phone_number", type: "text" },
        {
          label: "Country",
          name: "country_id",
          type: "select",
          children: countries.map((country) => ({
            id: country.id,
            name: country.country_name,
          })),
        },
        {
          label: "County",
          name: "county_id",
          type: "select",
          children: counties.map((county) => ({
            id: county.id,
            name: county.county_name,
          })),
        },

        { label: "City/Town", name: "city_town", type: "text" },
      ],
    },
    {
      title: "Benefits",
      state: useState(true),
      fields: [
        {
          label: "Pension Award",
          name: "pension_award_id",
          type: "select",
          children: pensionAwards.map((award) => ({
            id: award.id,
            name: award.name,
          })),
        },
        {
          label: "Date of First Appointment",
          name: "date_of_first_appointment",
          type: "date",
        },
        {
          label: "Date of confirmation into pensionable Office",
          name: "date_of_confirmation",
          type: "date",
        },
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
          label: "Retirement Date",
          name: "retirement_date",
          type: "date",
        },
        {
          label: "Date of Which Pension will Commence/Date Of Death ",
          name: "date_from_which_pension_will_commence",
          type: "date",
        },

        {
          label: "Last Basic Salary Amount",
          name: "last_basic_salary_amount",
          type: "number",
        },
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Preclaims Data", formData);

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

    setErrors(newErrors);

    /*  if (Object.keys(newErrors).length > 0) {
      console.log("Errors found", newErrors);
      return; // Don't submit if there are errors
    }
*/
    console.log("Form Data (before formatting):", formData);
    // setIsLoading(true);
    const formattedFormData = { ...formData };
    Object.keys(formattedFormData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    console.log("Formatted Form Data:", formattedFormData);

    try {
      const res = await axios.post(
        `${BASE_CORE_API}api/ProspectivePensioners/CreateProspectivePensioner`,
        formattedFormData
      );

      console.log("API Response:", res.data);
      if (res.data.succeeded && res.status === 200) {
        setAlert({
          open: true,
          message:
            "Prospective pensioner Information & Contact Details added successfully",
          severity: "success",
        });
        router.push(
          `/pensions/preclaims/listing/new/add-payment-details?id=${res.data.data}`
        );
      }

      // fetchAllPreclaims(); // Uncomment if you need to refresh the preclaims list
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      // setOpenCreate(false);
      // setIsLoading(false);
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
        <form onSubmit={handleSubmit}>
          <div className="pt-6 sticky top-0 bg-inherit  pb-2 bg-white z-50">
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
                    // onClick={handleSubmit}
                    type="submit"
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2 p-6">
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
        </form>
      </div>
    </div>
  );
}

export default NewPreclaim;
