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
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { message } from "antd";
import { useMda } from "@/context/MdaContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/en-au";

dayjs.extend(isSameOrBefore);

function NewPreclaim({
  openCreate,
  setOpenCreate,
  moveToNextTab,
  fetchAllPreclaims,
  permissions,
  retireeId,
  setRetireeId,
}) {
  const { isLoading, setIsLoading } = useIsLoading();
  const [errors, setErrors] = useState({});

  const { mdaId } = useMda();
  const [retiree, setRetiree] = useState({});
  const [editMode, setEditMode] = useState(false);
  //const [hasId, setHasId] = useState(false);

  useEffect(() => {
    if (retireeId) {
      fetchRetiree();
    }
  }, [retireeId]);

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(retireeId)
      );
      const retiree = res.data.data[0];
      setRetiree(retiree);
      setFormData({
        personal_number: retiree?.personal_number ?? "",
        first_name: retiree?.first_name ?? "",
        surname: retiree?.surname ?? "",
        other_name: retiree?.other_name ?? "",
        dob: retiree?.dob
          ? new Date(retiree.dob).toISOString().split("T")[0]
          : "",
        gender: retiree?.gender ?? "",
        postal_code: retiree?.postal_code ?? "",
        notification_status: retiree?.notification_status ?? "",

        identifier_type: retiree?.identifier_type ?? "",
        national_id: retiree?.national_id ?? "",
        kra_pin: retiree?.kra_pin ?? "",
        designation_grade: retiree?.designation_grade ?? "",
        mortality_status: retiree?.mortality_status ?? "",
        marital_status: retiree?.marital_status ?? "",
        email_address: retiree?.email_address ?? "",
        postal_address: retiree?.postal_address ?? "",
        postal_code: retiree?.postal_code_id ?? "",
        phone_number: retiree?.phone_number ?? "",
        grade_id: retiree?.grade_id ?? "",
        designation_id: retiree?.designation_id ?? "",
        country_id:
          retiree?.country?.id ?? "94ece052-7142-477a-af0f-c3909402d247",
        county_id: retiree?.constituency?.county_id ?? "",
        constituency_id: retiree?.constituency?.id ?? "",
        city_town: retiree?.city_town ?? "",
        pension_award_id: retiree?.pensionAward?.id ?? "",
        date_of_first_appointment: retiree?.date_of_first_appointment
          ? new Date(retiree.date_of_first_appointment)
              .toISOString()
              .split("T")[0]
          : "",
        date_of_confirmation: retiree?.date_of_confirmation
          ? new Date(retiree.date_of_confirmation).toISOString().split("T")[0]
          : "",
        authority_for_retirement_reference:
          retiree?.authority_for_retirement_reference ?? "",
        authority_for_retirement_dated: retiree?.authority_for_retirement_dated
          ? new Date(retiree.authority_for_retirement_dated)
              .toISOString()
              .split("T")[0]
          : "",
        retirement_date: retiree?.retirement_date
          ? new Date(retiree.retirement_date).toISOString().split("T")[0]
          : "",
        date_from_which_pension_will_commence:
          retiree?.date_from_which_pension_will_commence
            ? new Date(retiree.date_from_which_pension_will_commence)
                .toISOString()
                .split("T")[0]
            : "",
        last_basic_salary_amount: retiree?.last_basic_salary_amount ?? "",
      });
      console.log("retiree ********", retiree);
    } catch (error) {
      console.log(error);
    }
  };

  const [formData, setFormData] = useState({
    personal_number: retiree?.personal_number ?? "",
    first_name: retiree?.first_name ?? "",
    surname: retiree?.surname ?? "",
    other_name: retiree?.other_name ?? "",
    postal_code: retiree?.postal_code ?? "",
    dob: retiree?.dob ? new Date(retiree.dob).toISOString().split("T")[0] : "",
    notification_status: retiree?.notification_status ?? "",
    mortality_status: retiree?.mortality_status ?? "",
    marital_status: retiree?.marital_status ?? "",
    gender: retiree?.gender ?? "",
    identifier_type: retiree?.identifier_type ?? "",
    national_id: retiree?.national_id ?? "",
    grade_id: retiree?.grade_id ?? "",
    kra_pin: retiree?.kra_pin ?? "",
    designation_id: retiree?.designation_id ?? "",
    designation_grade: retiree?.designation_grade ?? "",
    email_address: retiree?.email_address ?? "",
    postal_address: retiree?.postal_address ?? "",
    postal_code: retiree?.postal_code_id ?? "",
    phone_number: retiree?.phone_number ?? "",
    country_id:
      (retiree?.country?.id || "94ece052-7142-477a-af0f-c3909402d247") ?? "",
    county_id: "",
    constituency_id: retiree?.constituency?.id ?? "",
    city_town: retiree?.city_town ?? "",
    pension_award_id: retiree?.pensionAward?.id ?? "",
    date_of_first_appointment: retiree?.date_of_first_appointment
      ? new Date(retiree.date_of_first_appointment).toISOString().split("T")[0]
      : "",
    date_of_confirmation: retiree?.date_of_confirmation
      ? new Date(retiree.date_of_confirmation).toISOString().split("T")[0]
      : "",
    authority_for_retirement_reference:
      retiree?.authority_for_retirement_reference ?? "",
    authority_for_retirement_dated: retiree?.authority_for_retirement_dated
      ? new Date(retiree.authority_for_retirement_dated)
          .toISOString()
          .split("T")[0]
      : "",
    retirement_date: retiree?.retirement_date
      ? new Date(retiree.retirement_date).toISOString().split("T")[0]
      : "",
    date_from_which_pension_will_commence:
      retiree?.date_from_which_pension_will_commence
        ? new Date(retiree.date_from_which_pension_will_commence)
            .toISOString()
            .split("T")[0]
        : "",
    last_basic_salary_amount: retiree?.last_basic_salary_amount ?? "",
  });
  const router = useRouter();

  const validateField = (name, value, formData) => {
    let error = "";

    if (
      name === "email_address" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email format";
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
    } else if (
      name === "phone_number" &&
      value &&
      !/^(?:\+254|0)([17][0-9]|1[0-1])[0-9]{7}$/.test(value)
    ) {
      error = "Must be a valid phone number";
    } else if (
      name.includes("date") &&
      name !== "date_from_which_pension_will_commence" &&
      name !== "retirement_date" &&
      value &&
      dayjs(value).isAfter(dayjs())
    ) {
      error = "Date cannot be in the future";
      // } else if (name === "date_of_first_appointment" && value && formData.dob) {
      //   const dobDate = dayjs(formData.dob);
      //   const appointmentDate = dayjs(value);
      //   const ageAtAppointment = appointmentDate.diff(dobDate, "year");
      //   if (ageAtAppointment < 18) {
      //     error =
      //       "Date of first appointment must be at least 18 years after date of birth";
      //   }
    } else if (
      name === "date_of_confirmation" &&
      value &&
      formData.date_of_first_appointment
    ) {
      const appointmentDate = dayjs(formData.date_of_first_appointment);
      const confirmationDate = dayjs(value);
      if (confirmationDate.isBefore(appointmentDate)) {
        error =
          "Date of confirmation cannot be before date of first appointment";
      }
    } else if (name === "tax_exempt_certificate_number" && value === "") {
      if (formData.pwd === 0 && value === "") {
        error = "Tax Exempt Certificate Number is required";
      }
    } else if (name === "tax_exempt_certificate_date" && value === "") {
      if (formData.pwd === 0 && value === "") {
        error = "Tax Exempt Certificate Date is required";
      }
    }
    // if (formData.pwd === 0 && !formData.tax_exempt_certificate_number) {
    //   error = "Tax Exempt Certificate Number is required";
    // }

    // if (formData.pwd === 0 && !formData.tax_exempt_certificate_date) {
    //   error = "Tax Exempt Certificate Date is required";
    // }
    else if (
      name === "authority_for_retirement_dated" &&
      value &&
      formData.date_of_first_appointment
    ) {
      const appointmentDate = dayjs(formData.date_of_first_appointment);
      const authorityOfRetirement = dayjs(value);
      if (authorityOfRetirement.isBefore(appointmentDate)) {
        error =
          "Authority of retirement date cannot be before date of first appointment";
      }
    } else if (name === "authority_for_retirement_dated" && value) {
      const retirementAuthorityDate = dayjs(value);
      if (retirementAuthorityDate.isAfter(dayjs())) {
        error = "Date of authority of retirement should not exceed today";
      }
      // } else if (
      //   name === "retirement_date" &&
      //   value &&
      //   formData.authority_for_retirement_dated
      // ) {
      //   const authorityDate = dayjs(formData.authority_for_retirement_dated);
      //   const retirementDate = dayjs(value);
      //   if (retirementDate.isBefore(authorityDate)) {
      //     error =
      //       "Date of last pay cannot be before the date of authority of retirement";
      //   }
      // } else if (
      //   name === "date_from_which_pension_will_commence" &&
      //   value &&
      //   formData.retirement_date
      // ) {
      //   const retirementDate = dayjs(formData.retirement_date);
      //   const pensionCommenceDate = dayjs(value);
      //   if (pensionCommenceDate.isSameOrBefore(retirementDate)) {
      //     error =
      //       "Date from which the pension will commence must be at least a day after the day of last pay";
      //   }
      // }
    }

    return error;
  };

  const handleInputChange = (e) => {
    if (retireeId) {
      setEditMode(true);
    }
    const { name, value, type } = e.target;
    let parsedValue = type === "number" ? parseFloat(value) : value;

    if (type === "text") {
      parsedValue = parsedValue.toUpperCase();
    }
    if (type === "text" || type === "select-one") {
      parsedValue = parsedValue.toUpperCase();
    }
    // if (name === "county_id") {
    //   const selectedCounty = counties.find((county) => county.id === value);
    //   if (selectedCounty) {
    //     setConstituencies(selectedCounty.constituencies);
    //   } else {
    //     setConstituencies([]);
    //   }
    // }
    setFormData({ ...formData, [name]: parsedValue });
    const error = validateField(name, parsedValue, formData);
    setErrors({ ...errors, [name]: error });
  };

  //const [mdas, setMdas] = useState([]);
  const [pensionAwards, setPensionAwards] = useState([]);

  // const fetchMdas = async () => {
  //   try {
  //     const res = await apiService.get(endpoints.mdas, {
  //       //"paging.pageNumber": ,
  //       "paging.pageSize": 200,
  //     });
  //     setMdas(res.data.data);
  //   } catch (error) {
  //     console.error("Error fetching MDAs:", error);
  //   }
  // };

  const fetchPensionAwards = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards, {
        "paging.pageSize": 100,
      });
      setPensionAwards(res.data.data);
    } catch (error) {
      console.error("Error fetching Pension Awards:", error);
    }
  };

  const [counties, setCounties] = useState([]);
  const [countries, setCountries] = useState([]);

  const [constituencies, setConstituencies] = useState([]);
  const { alert, setAlert } = useAlert();
  const [designations, setDesignations] = useState([]);
  const [postalAddress, setPostalAddress] = useState([]);
  const fetchCountiesAndContituencies = async () => {
    try {
      const res = await apiService.get(endpoints.getCounties, {
        "paging.pageSize": 100,
      });
      const rawData = res.data.data;

      const countiesData = rawData.map((county) => ({
        id: county.id,
        name: county.county_name,
        constituencies: county.constituencies.map((constituency) => ({
          id: constituency.id,
          name: constituency.constituency_name,
        })),
      }));

      setCounties(countiesData);
      //setConstituencies(countiesData.constituencies);

      console.log("first", rawData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConstituencies = async () => {
    try {
      const res = await apiService.get(endpoints.getConstituencies, {
        "paging.pageSize": 1000,
      });
      setConstituencies(res.data.data);
    } catch (error) {
      console.error("Error fetching Constituencies:", error);
    }
  };
  const fetchCountries = async () => {
    try {
      const res = await apiService.get(endpoints.getCountries, {
        "paging.pageSize": 100,
      });

      setCountries(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        "paging.pageSize": 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error("Error fetching Designations:", error);
    }
  };

  const fetchPostalAddress = async () => {
    try {
      const res = await apiService.get(endpoints.getPostalCodes, {
        "paging.pageSize": 1000,
      });
      setPostalAddress(res.data.data);
    } catch (error) {
      console.error("Error fetching Postal Address:", error);
    }
  };

  const [grades, setGrades] = useState([]);
  const fetchGrades = async () => {
    try {
      const res = await apiService.get(endpoints.getAllGrades);
      if (res.status === 200) {
        setGrades(
          res.data.data.map((item, index) => ({ ...item, no: index + 1 }))
        );

        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const [activePensionCap, setActivePensionCap] = useState("");

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        "paging.pageSize": 100,
      });

      const userMda = res.data.data.find((mda) => mda.id === mdaId);

      const currentCap = userMda?.pensionCap?.id;

      // setCurrentMda(userMda);

      setActivePensionCap(currentCap);

      console.log("Current MDA: ********", currentCap);
    } catch (error) {
      console.error("Error fetching MDAs:", error);
    }
  };

  useEffect(() => {
    if (mdaId) {
      fetchMdas();
    }
  }, [mdaId]);

  useEffect(() => {
    fetchGrades();
    fetchPensionAwards();
    fetchPostalAddress();
    fetchCountiesAndContituencies();
    fetchConstituencies();
    fetchCountries();
    fetchDesignations();
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
        { label: "Email Address", name: "email_address", type: "email" },
        { label: "Phone Number", name: "phone_number", type: "text" },
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
          label: "Deaceased",
          name: "mortality_status",
          type: "select",
          children: [
            {
              id: 2,
              name: "No",
            },
            {
              id: 1,
              name: "Yes",
            },
          ],
        },
        {
          label: "Marital Status",
          name: "marital_status",
          type: "select",
          children: [
            { id: 0, name: "Single" },
            { id: 1, name: "Married" },
            { id: 2, name: "Divorced" },
            { id: 3, name: "Widowed" },
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
          label: "Designation",
          name: "designation_id",
          type: "select",
          children: designations
            .filter((designation) =>
              mdaId ? designation?.mda?.id === mdaId : designation
            )
            .map((designation) => ({
              id: designation.id,
              name: designation.name,
            })),
        },
        {
          label: "Grade",
          name: "grade_id",
          type: "select",
          children: grades
            .filter((grade) => grade.designation_id === formData.designation_id)
            .map((grade) => ({
              id: grade.id,
              name: grade.grade,
            })),
        },

        // {
        //   label: "Ministry/Department/Agency",
        //   name: "mda_id",
        //   type: "select",
        //   children: mdas.map((mda) => ({
        //     id: mda.id,
        //     name: mda.name,
        //   })),
        // },

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
            name: county.name,
          })),
        },
        {
          label: "Counstituency",
          name: "constituency_id",
          type: "select",
          children:
            formData.county_id !== ""
              ? constituencies
                  .filter(
                    (constituency) =>
                      constituency.county_id === formData.county_id
                  )
                  .map((constituency) => ({
                    id: constituency.id,
                    name: constituency.constituency_name,
                  }))
              : constituencies.map((constituency) => ({
                  id: constituency.id,
                  name: constituency.constituency_name,
                })),
        },
        // placeholder: formData.constituency_name,
        //   children: formData.county_id
        //     ? constituencies?.map((constituency) => ({
        //         id: constituency.id,
        //         name: constituency.name,
        //       }))
        //     : [{ id: "", name: "Please select a county first" }],
        // },
        {
          label: "Postal Address",
          name: "postal_address",
          type: "number",
        },
        {
          label: "Postal Code",
          name: "postal_code",
          type: "autocomplete",
          // autocomplete: "on",
          children: postalAddress.map((address) => ({
            id: address.id,
            name: address.code,
          })),
          // children: formData.county_id
          //   ? postalAddress
          //       .filter((address) => address.countyId === formData.county_id)
          //       .map((address) => ({
          //         id: address.id,
          //         name: `${address.code} - ${address.name}`,
          //       }))
          //   : postalAddress.map((address) => ({
          //       id: address.id,
          //       name: `${address.code} - ${address.name}`,
          //     })),
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
          children:
            mdaId && activePensionCap && formData.mortality_status === 1
              ? pensionAwards
                  .filter((award) => award.pensionCap.id === activePensionCap)
                  .filter(
                    (award) =>
                      award.name === "DEATH GRATUITY" ||
                      award.name === "DEATH IN SERVICE" ||
                      award.name === "KILLED ON DUTY"
                  )

                  .map((award) => ({
                    id: award.id,
                    name: award.name,
                  }))
              : mdaId && activePensionCap && formData.mortality_status === 2
              ? pensionAwards
                  .filter((award) => award.pensionCap.id === activePensionCap)
                  .filter(
                    (award) =>
                      award.name !== "DEATH GRATUITY" &&
                      award.name !== "DEATH IN SERVICE" &&
                      award.name !== "KILLED ON DUTY"
                  )

                  .map((award) => ({
                    id: award.id,
                    name: award.name,
                  }))
              : pensionAwards.map((award) => ({
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
          label: "Last Pay Date",
          name: "last_pay_date",
          // name: "authority_for_retirement_dated",
          type: "date",
        },

        {
          label: "Last Basic Salary Amount",
          name: "last_basic_salary_amount",
          type: "number",
        },
        {
          label: "Person With Disability",
          name: "pwd",
          type: "select",
          children: [
            {
              id: 0,
              name: "Yes",
            },
            {
              id: 1,
              name: "No",
            },
          ],
        },
        ...(formData.pwd === 0
          ? [
              {
                label: "Tax Exempt Certificate Number",
                name: "tax_exempt_certificate_number",
                type: "text",
              },
              {
                label: "Tax Exempt Certificate Date",
                name: "tax_exempt_certificate_date",
                type: "date",
              },
            ]
          : []),
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Preclaims Data", formData);

    if (retireeId && !editMode) {
      // router.push(
      //   `/pensions/preclaims/listing/new/add-payment-details?id=${retireeId}`
      // );
      moveToNextTab();
      return;
    }

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        key !== "other_name" &&
        (formData[key] === undefined ||
          formData[key] === null ||
          formData[key] === "" ||
          formData[key] === false)
      ) {
        newErrors[key] = "This field is required";
      }
    });
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
        message.error(error);
        return;
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

    if (!mdaId) {
      message.error("MDA not found, Please sign in as an MDA user");
      return;
    }
    const data = { ...formattedFormData, mda_id: mdaId };

    console.log("Data to be sent:", data);

    try {
      let res;
      if (editMode) {
        res = await axios.post(
          `${BASE_CORE_API}api/ProspectivePensioners/UpdateProspectivePensioner`,
          { ...data, id: retireeId }
        );

        if (
          res?.status === 200 &&
          res?.data?.messages[0] ===
            "Prospective pensioner updated successfully"
        ) {
          setAlert({
            open: true,
            message:
              "Prospective pensioner Information & Contact Details updated successfully",
            severity: "success",
          });
          fetchRetiree();
          setEditMode(false);
        }
        if (
          res?.data?.messages[0] ===
          "Date of confirmation cannot be before or same as date of birth"
        ) {
          message.error(
            "Date of confirmation cannot be before or same as date of birth"
          );
        }
        if (
          res?.data?.messages[0] ===
          "The prospective pensioner has already passed the modification state"
        ) {
          message.error(
            "The prospective pensioner has already passed the modification state"
          );
        }
        if (res?.data?.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
        }
      } else {
        res = await axios.post(
          `${BASE_CORE_API}api/ProspectivePensioners/CreateProspectivePensioner`,
          data
        );
      }

      console.log("API Response:", res.data);
      if (res.data.succeeded && res.status === 200) {
        // setAlert({
        //   open: true,
        //   message:
        //     "Prospective pensioner Information & Contact Details added successfully",
        //   severity: "success",
        // });

        message.success("Prospective pensioner Information added successfully");
        // router.push(
        //   `/pensions/preclaims/listing/new/add-payment-details?id=${res.data.data}`
        // );

        clickedItem && moveToNextTab();

        setRetireeId(res.data.data);
        console.log("Retiree ID:", res.data.data);
      }

      if (res.data.validationErrors.length > 0) {
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
      }
      if (
        res.data.succeeded === false &&
        res.data.messages[0] ===
          "A similar award has already been created for the retiree."
      ) {
        message.error(
          "A similar award has already been created for the retiree."
        );
      }
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  useEffect(() => {
    if (formData.retirement_date) {
      const lastPayDate = dayjs(formData.retirement_date);
      const nextDay = lastPayDate.add(1, "day").format("YYYY-MM-DD");
      setFormData({
        ...formData,
        date_from_which_pension_will_commence: nextDay,
      });
    }
  }, [formData.retirement_date]);
  // useEffect(() => {
  //   if (formData.authority_for_retirement_dated) {
  //     const authority_for_retirement_dated = dayjs(
  //       formData.authority_for_retirement_dated
  //     );
  //     const nextDay = authority_for_retirement_dated
  //       .add(1, "day")
  //       .format("YYYY-MM-DD");
  //     setFormData({
  //       ...formData,
  //       date_from_which_pension_will_commence: nextDay,
  //     });
  //   }
  // }, [formData.authority_for_retirement_dated]);

  // useEffect(() => {
  //   if (formData.dob) {
  //     const dobDate = dayjs(formData.dob);
  //     const firstAppointmentDate = dobDate
  //       .add(18, "years")
  //       .format("YYYY-MM-DD");
  //     setFormData({
  //       ...formData,
  //       date_of_first_appointment: firstAppointmentDate,
  //     });
  //   }
  // }, [formData.dob]);

  // const handleNext = () => {
  //   !editMode && retireeId && moveToNextTab();
  // };

  return (
    <div className="max-h-[100vh]  overflow-y-auto pb-[250px]">
      <div className="w-full p-2  mr-1 h-full grid grid-cols-12 gap-2 mt-[-20px] ">
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
        <div className="col-span-12    bg-white shadow-sm rounded-2xl pb-4">
          <form onSubmit={handleSubmit} className="">
            <div className="pt-6 sticky top-0 bg-inherit  pb-2 bg-white z-50">
              <div className="flex items-center justify-between px-6 w-[100%]">
                <div className="flex items-center gap-2"></div>
                <div className="flex ">
                  {" "}
                  <div className="flex gap-8 mr-4">
                    <div className=""></div>
                    <Button
                      variant="contained"
                      color="primary"
                      //  onClick={handleNext}
                      type="submit"
                      sx={{ maxHeight: "40px", mt: "5px" }}
                    >
                      {formData.notification_status
                        ? "Next"
                        : editMode
                        ? "Update"
                        : "Save"}
                    </Button>{" "}
                  </div>
                </div>
              </div>
              <hr className="border-[1px] border-black-900 my-2" />
            </div>

            <div className="p-2 mt-[-15px] ">
              {sections
                .filter((section) => {
                  if (section.title === "Contact Details") {
                    return (
                      formData.notification_status !== 0 &&
                      formData.notification_status !== 2 &&
                      formData.notification_status !== ""
                    );
                  }
                  return true;
                })
                .map((section, index) => {
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 p-6 ">
                          {section.fields
                            .filter((field) => {
                              if (
                                field.name ===
                                "authority_for_retirement_reference"
                              ) {
                                return (
                                  formData.notification_status !== 0 &&
                                  formData.notification_status !== 2 &&
                                  formData.notification_status !== ""
                                );
                              }
                              return true;
                            })
                            .map((field, fieldIndex) => (
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
                                    <MenuItem value="">
                                      Select {field.label}
                                    </MenuItem>
                                    {field?.children?.map((option) => (
                                      <MenuItem
                                        key={option?.id}
                                        value={option?.id}
                                      >
                                        {option?.code
                                          ? `${option.name} - ${option.code}`
                                          : option.name}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                ) : field.type === "autocomplete" ? (
                                  <Autocomplete
                                    options={field.children}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, newValue) => {
                                      handleInputChange({
                                        target: {
                                          name: field.name,
                                          value: newValue ? newValue.id : "",
                                        },
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name={field.name}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                      />
                                    )}
                                    value={
                                      field.children.find(
                                        (option) =>
                                          option.id === formData[field.name]
                                      ) || null
                                    }
                                  />
                                ) : (
                                  // ) : field.type === "date" ? (
                                  //   <LocalizationProvider
                                  //     dateAdapter={AdapterDayjs}
                                  //     adapterLocale="en-au" // Use the locale here
                                  //   >
                                  //     <TextField
                                  //       name={field.name}
                                  //       type="date"
                                  //       variant="outlined"
                                  //       size="small"
                                  //       error={!!errors[field.name]}
                                  //       helperText={errors[field.name]}
                                  //       onChange={handleInputChange}
                                  //       fullWidth
                                  //     />
                                  //   </LocalizationProvider>
                                  <TextField
                                    type={field.type}
                                    name={field.name}
                                    variant="outlined"
                                    size="small"
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    error={!!errors[field.name]}
                                    helperText={errors[field.name]}
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
    </div>
  );
}

export default NewPreclaim;
