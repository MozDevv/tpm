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
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { message, notification, Select } from "antd";
import { useMda } from "@/context/MdaContext";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/en-au";
import { createSections } from "./CreateSections";
import PhoneInput from "react-phone-input-2";
import "./ag-theme.css";
import MuiPhoneNumber from "mui-phone-number";
import { toProperCase } from "@/utils/numberFormatters";

dayjs.extend(isSameOrBefore);

function NewPreclaim({
  openCreate,
  setOpenCreate,
  moveToNextTab,
  fetchAllPreclaims,
  permissions,
  retireeId,
  setRetireeId,
  setOpenBaseCard,
}) {
  const { isLoading, setIsLoading } = useIsLoading();
  const [errors, setErrors] = useState({});

  const mdaId = localStorage.getItem("mdaId");

  const [retiree, setRetiree] = useState({});
  const [editMode, setEditMode] = useState(false);
  //const [hasId, setHasId] = useState(false);

  useEffect(() => {
    if (retireeId) {
      fetchRetiree();
    }
  }, [retireeId]);

  const computeAgeOfDischarge = (dob, retirementDate) => {
    if (dob && retirementDate) {
      const dobDate = dayjs(dob);
      const retirementDateObj = dayjs(retirementDate);
      return retirementDateObj.diff(dobDate, "year");
    }
    return 0;
  };

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(retireeId)
      );
      const retiree = res.data.data[0];
      setRetiree(retiree);

      const ageOnDischarge = computeAgeOfDischarge(
        retiree?.dob,
        retiree?.retirement_date
      );
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
        constituency_id: retiree?.constituency?.constituency_name ?? "",
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
        last_pay_date: retiree.last_pay_date
          ? new Date(retiree.last_pay_date).toISOString().split("T")[0]
          : "",
        disability_status: retiree?.disability_status ?? "",
        exit_grounds: retiree?.pensionAward?.exit_ground_id ?? "",

        tax_exempt_certificate_number:
          retiree?.tax_exempt_certificate_number ?? "",
        tax_exempt_certificate_date: retiree?.tax_exempt_certificate_date
          ? new Date(retiree.tax_exempt_certificate_date)
              .toISOString()
              .split("T")[0]
          : "",

        military_id: retiree?.military_id ?? "",
        monthly_salary_in_ksh: retiree?.monthly_salary_in_ksh ?? 0,
        service_increments: retiree?.service_increments ?? 0,
        monthly_aditional_pay: retiree?.monthly_aditional_pay ?? 0,
        tribe: retiree?.tribe ?? "",
        maintenance_case: retiree?.maintenance_case ?? 1,
        is_wcps: retiree?.is_wcps ?? 1,
        is_parliamentary: retiree?.is_parliamentary ?? false,
        age_on_discharge: ageOnDischarge,
        commutation_option_selection: retiree?.commutation_option_selection,
        commutation_option_selection_date:
          retiree?.commutation_option_selection_date
            ? new Date(retiree?.commutation_option_selection_date)
                .toISOString()
                .split("T")[0]
            : "",
        isCommutable: retiree?.pensionAward?.has_commutation ?? false,
      });
      console.log("retiree ********", retiree);
    } catch (error) {
      console.log(error);
    }
  };

  const getInitialFormData = () => {
    try {
      const savedFormData = localStorage.getItem("retireeFormData");
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        if (parsedData && typeof parsedData === "object") {
          return parsedData;
        }
      }
    } catch (error) {
      console.error("Error parsing saved form data: ", error);
    }

    const parseDate = (date) => {
      if (date) {
        return new Date(date).toISOString().split("T")[0];
      }
      return "";
    };

    const ageOnDischarge = computeAgeOfDischarge(
      retiree?.dob,
      retiree?.retirement_date
    );
    // Fallback to retiree data if no valid saved form data is found
    return {
      personal_number: retiree?.personal_number ?? "",
      first_name: retiree?.first_name ?? "",
      surname: retiree?.surname ?? "",
      other_name: retiree?.other_name ?? "",
      postal_code: retiree?.postal_code ?? "",
      dob: parseDate(retiree?.dob),
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
        retiree?.country?.id || "94ece052-7142-477a-af0f-c3909402d247",
      county_id: "",
      constituency_id: retiree?.constituency?.constituency_name ?? "",
      city_town: retiree?.city_town ?? "",
      pension_award_id: retiree?.pensionAward?.id ?? "",
      date_of_first_appointment: parseDate(retiree?.date_of_first_appointment),
      date_of_confirmation: parseDate(retiree?.date_of_confirmation),
      authority_for_retirement_reference:
        retiree?.authority_for_retirement_reference ?? "",
      authority_for_retirement_dated: parseDate(
        retiree?.authority_for_retirement_dated
      ),
      retirement_date: parseDate(retiree?.retirement_date),
      date_from_which_pension_will_commence: parseDate(
        retiree?.date_from_which_pension_will_commence
      ),
      last_basic_salary_amount: retiree?.last_basic_salary_amount ?? "",
      last_pay_date: parseDate(retiree?.last_pay_date),
      disability_status: retiree?.disability_status ?? "",
      maintenance_case: retiree?.maintenance_case ?? 1,
      tax_exempt_certificate_number:
        retiree?.tax_exempt_certificate_number ?? "",
      exit_grounds: retiree?.pensionAward?.exit_ground_id ?? "",
      tax_exempt_certificate_date: parseDate(
        retiree?.tax_exempt_certificate_date
      ),
      military_id: retiree?.military_id ?? "",
      monthly_salary_in_ksh: retiree?.monthly_salary_in_ksh ?? 0,
      service_increments: retiree?.service_increments ?? 0,
      monthly_aditional_pay: retiree?.monthly_aditional_pay ?? 0,
      tribe: retiree?.tribe ?? "",
      is_wcps: retiree?.is_wcps ?? 1,
      is_parliamentary: retiree?.is_parliamentary ?? false,
      age_on_discharge: ageOnDischarge,
      commutation_option_selection: retiree?.commutation_option_selection,
      commutation_option_selection_date: parseDate(
        retiree?.commutation_option_selection_date
      ),

      isCommutable: retiree?.pensionAward?.has_commutation ?? false,
    };
  };

  // State for form data
  const [formData, setFormData] = useState(getInitialFormData());
  const router = useRouter();

  const validateField = (name, value, formData) => {
    let error = "";

    if (
      name === "email_address" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email format";
      // } else if (name === "phone_number" && value && !/^\d+$/.test(value)) {
      //   error = "Must be a valid phone number";
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
      // } else if (
      //   name === "phone_number" &&
      //   value &&
      //   !/^(?:\+254|0)([17][0-9]|1[0-1])[0-9]{7}$/.test(value)
      // ) {
      //   error = "Must be a valid phone number";
    } else if (
      name.includes("date") &&
      name !== "date_from_which_pension_will_commence" &&
      name !== "retirement_date" &&
      name !== "last_pay_date" &&
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

    return error;
  };

  const handleInputChange = (e) => {
    if (retireeId) {
      setEditMode(true);
    }
    let { name, value, type } = e.target;
    let parsedValue = type === "number" ? parseFloat(value) : value;

    if (
      type === "text" &&
      name !== "kra_pin" &&
      name !== "email_address" &&
      name !== "tribe"
    ) {
      parsedValue = toProperCase(parsedValue);
    }

    if (name === "is_parliamentary") {
      formData.is_parliamentary = true;
    }

    // if (name === "county_id") {
    //   const selectedCounty = counties.find((county) => county.id === value);
    //   if (selectedCounty) {
    //     setConstituencies(selectedCounty.constituencies);
    //   } else {
    //     setConstituencies([]);
    //   }
    // }
    const error = validateField(name, parsedValue, formData);
    setErrors({ ...errors, [name]: error });
    const updatedFormData = { ...formData, [name]: parsedValue };
    setFormData(updatedFormData);

    localStorage.setItem("retireeFormData", JSON.stringify(updatedFormData));
  };

  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem("retireeFormData");
      console.log("Saved Form Data: ", savedFormData);
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        console.log("Parsed Form Data: ", parsedData);
        setFormData(parsedData);
        if (parsedData && typeof parsedData === "object") {
          setFormData(parsedData);
        } else {
          console.error("Invalid saved form data structure");
          fetchRetiree();
        }
      } else {
        fetchRetiree();
      }
    } catch (error) {
      console.error("Error parsing saved form data: ", error);
      fetchRetiree();
    }
  }, []);

  //const [mdas, setMdas] = useState([]);
  const [pensionAwards, setPensionAwards] = useState([]);

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
  const [exitGrounds, setExitGrounds] = useState([]);
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

  const fetchExitGrounds = async () => {
    try {
      const res = await apiService.get(endpoints.getExitGrounds, {
        "paging.pageSize": 1000,
      });
      setExitGrounds(res.data.data);
    } catch (error) {
      console.error("Error fetching Exit Grounds:", error);
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
        setGrades(res.data.data);

        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const { activePensionCap, activeCapName } = useMda("");

  useEffect(() => {
    fetchExitGrounds();
    fetchGrades();
    fetchPensionAwards();
    fetchPostalAddress();
    fetchCountiesAndContituencies();
    fetchConstituencies();
    fetchCountries();
    fetchDesignations();
  }, []);

  const [pensionAwardsData, setPensionAwardsData] = useState([]);

  useEffect(() => {
    const filteredExitGrounds = exitGrounds.filter(
      (exitGround) => exitGround.id === formData.exit_grounds
    );

    setPensionAwardsData(filteredExitGrounds);
  }, [formData.exit_grounds]);

  ////////////////////////////////////////////////

  const filteredDesignations = designations
    .filter((designation) => (mdaId ? designation?.mda?.id === mdaId : true))
    .map((designation) => ({
      id: designation.id,
      name: designation.name,
    }));

  const filteredGrades = designations
    .filter((designation) => designation.id === formData.designation_id)
    .flatMap((designation) => designation.grades)
    .map((grade) => ({ id: grade.id, name: grade.grade }));

  const filteredPostalAddresses = postalAddress.map((address) => ({
    id: address.id,
    name: address.code,
  }));

  const exitGroundOptions = exitGrounds.map((exitGround) => ({
    id: exitGround.id,
    name: exitGround.name,
  }));

  const pensionAwardOptions =
    exitGrounds.length > 0 && !formData.notification_status
      ? exitGrounds
          .filter((grounds) => grounds.id === formData.exit_grounds)
          .flatMap((grounds) =>
            grounds.pensionAwards
              .filter((award) => award.pensionCap.id === activePensionCap)
              .map((filteredAward) => ({
                id: filteredAward.id,
                name: filteredAward.name,
                pensionCap: filteredAward.pensionCap.id,
              }))
          )
      : pensionAwards.map((award) => ({
          id: award.id,
          name: award.name,
          pensionCap: award.pensionCap.id,
        }));

  const sections = createSections(
    filteredDesignations,
    countries,
    counties,
    constituencies,
    filteredPostalAddresses,
    filteredGrades,

    exitGroundOptions,
    pensionAwardOptions,
    activePensionCap,
    formData,
    mdaId
  );

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

    for (const key of Object.keys(formData)) {
      if (
        key === "is_parliamentary" &&
        (activeCapName === "CAP196" ||
          activeCapName === "DSO/RK" ||
          activeCapName === "APN/PK")
      ) {
        formData.is_parliamentary = true;
      }
      if (
        key === "date_of_confirmation" &&
        (activeCapName === "CAP196" ||
          activeCapName === "DSO/RK" ||
          activeCapName === "APN/PK")
      ) {
        formData.date_of_confirmation = formData.date_of_first_appointment;
      }
    }

    const newErrors = {};
    // for (const key of Object.keys(formData)) {
    //   if (
    //     key !== "other_name" &&
    //     key !== "postal_code" &&
    //     key !== "notification_status" &&
    //     key !== "designation_grade" &&
    //     key !== "postal_address" &&
    //     key !== "city_town" &&
    //     key !== "country_id" &&
    //     key !== "county_id" &&
    //     key !== "constituency_id" &&
    //     key !== "authority_for_retirement_reference" &&
    //     key !== "authority_for_retirement_dated" &&
    //     key !== "tax_exempt_certificate_number" &&
    //     key !== "tax_exempt_certificate_date" &&
    //     key !== "date_of_confirmation" &&
    //     key !== "is_parliamentary" &&
    //     (formData[key] === undefined ||
    //       formData[key] === null ||
    //       formData[key] === "" ||
    //       formData[key] === false)
    //   ) {
    //     newErrors[key] = "This field is required";
    //     message.error(`This field is required: ${key}`);
    //     return; // Exit the function or block to stop further processing
    //   }
    // }
    for (const key of Object.keys(formData)) {
      if (key === "phone_number" && formData[key] === "") {
        newErrors[key] = "This field is required";
        message.error("Phone number is required, Please fill in the field");
        return; // Exit the function or block to stop further processing
      }
    }

    for (const key of Object.keys(formData)) {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
        message.error(error);
        return; // Exit the function or block to stop further processing
      }
    }

    if (formData.dob) {
      const dobDate = dayjs(formData.dob);
      const age = dayjs().diff(dobDate, "year");
      if (age < 18) {
        newErrors.dob = "User must be at least 18 years old";
      }
    }

    const errors = validateRetirementDate() || {};

    if (dobError) {
      return;
    }

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
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
      if (
        (dayjs(formattedFormData[key]).isValid() && key.includes("date")) ||
        key === "dob"
      ) {
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
          setOpenBaseCard(false);
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
        setOpenBaseCard(false);
        setAlert({
          open: true,
          message: "Prospective pensioner created successfully",
          severity: "success",
        }); // router.push(
        //   `/pensions/preclaims/listing/new/add-payment-details?id=${res.data.data}`
        // );

        localStorage.removeItem("retireeFormData");

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
    } finally {
    }
  };

  const [dobError, setDobError] = useState(null);

  const validateRetirementDate = () => {
    const pensionAward = pensionAwards.find(
      (award) => award.id === formData.pension_award_id
    );

    const dob = dayjs(formData.dob); // Assuming dob is in "YYYY-MM-DD" format
    const retirementDate = dayjs(formData.retirement_date);

    if (pensionAward && pensionAward.name === "RETIREMENT ON AGE GROUNDS") {
      const retirementAge = formData.disability_status === 0 ? 65 : 60;
      const expectedRetirementDate = dob.add(retirementAge, "year");

      if (retirementDate.isBefore(expectedRetirementDate)) {
        setDobError(true);
        setErrors((prevErrors) => ({
          ...prevErrors,
          retirement_date: `Retirement age should be at least ${retirementAge} years.`,
        }));
        message.error(
          `Retirement age should be at least ${retirementAge} years.`
        );
      } else {
        setDobError(false);
        setErrors((prevErrors) => {
          const { retirement_date, ...restErrors } = prevErrors;
          return restErrors;
        });
      }
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

  useEffect(() => {
    if (formData.commutation_option_selection === true) {
      setFormData({
        ...formData,
        commutation_option_selection: "Yes",
      });
    } else {
      setFormData({
        ...formData,
        commutation_option_selection: "No",
      });
    }
  }, [formData.commutation_option_selection]);

  useEffect(() => {
    if (formData.retirement_date && formData.dob) {
      const dob = dayjs(formData.dob);
      const retirementDate = dayjs(formData.retirement_date);

      const ageOfDischarge = retirementDate.diff(dob, "year");

      setFormData((prevData) => ({
        ...prevData,
        age_on_discharge: ageOfDischarge,
      }));
    }
  }, [formData.retirement_date, formData.dob]);

  const [countriesArr, setCountriesArr] = useState([]);

  useEffect(() => {
    // Fetch country data from the API
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          }))
          .filter((country) => country.code); // Filter countries with valid codes
        setCountriesArr(countryData);
      })
      .catch((error) => console.error("Error fetching country codes:", error));
  }, []);

  const [selectedCountryCode, setSelectedCountryCode] = useState("+254");
  const handleCountryChange = (event) => {
    setSelectedCountryCode(event.target.value);
    setFormData({
      ...formData,
      phone_number: event.target.value + formData.phone_number,
    });
  };

  useEffect(() => {
    validateRetirementDate();
  }, [
    formData.pension_award_id,
    formData.dob,
    formData.retirement_date,
    formData.disability_status,
  ]);

  const canEdit =
    formData.notification_status === 0 ||
    formData.notification_status === 2 ||
    formData.notification_status === "";

  const [open, setOpen] = useState(true);

  return (
    <div className="max-h-[85vh]  overflow-y-auto pb-[250px]">
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
            <div className="pt-2 sticky top-0 bg-inherit  pb-2 bg-white z-50">
              <div className="flex items-center justify-between px-6 w-[100%]">
                <div className="flex items-center gap-2"></div>
                <div className="flex ">
                  {" "}
                  {canEdit && (
                    <div className="flex gap-8 mr-4 ">
                      <div className=""></div>
                      <Button
                        variant="contained"
                        color="primary"
                        //  onClick={handleNext}
                        type="submit"
                        sx={{
                          maxHeight: "40px",
                          mt: "5px",
                        }}
                      >
                        {formData.notification_status
                          ? "Next"
                          : editMode
                          ? "Update"
                          : "Save"}
                      </Button>{" "}
                    </div>
                  )}
                </div>
              </div>
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
                  return (
                    <div key={index} className="gap-3 my-3">
                      <div className="flex items-center gap-2">
                        <h6 className="font-semibold text-primary text-sm font-montserrat">
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
                              return (
                                !activeCapName ||
                                field.pensionCap.includes(activeCapName)
                              );
                            })
                            .filter((field) => {
                              if (
                                field.name ===
                                  "authority_for_retirement_reference" ||
                                field.name === "commutation_option_selection" ||
                                field.name ===
                                  "commutation_option_selection_date"
                              ) {
                                return (
                                  formData.notification_status !== 0 &&
                                  formData.notification_status !== 2 &&
                                  formData.notification_status !== ""
                                );
                              }
                              return true;
                            })
                            .filter((field) => {
                              if (!formData.isCommutable) {
                                return (
                                  field.name !==
                                    "commutation_option_selection" &&
                                  field.name !==
                                    "commutation_option_selection_date"
                                );
                              }

                              return true;
                            })
                            .map((field, fieldIndex) => (
                              <div
                                key={fieldIndex}
                                style={{
                                  display: field.hide ? "none" : "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                  {field.label}
                                  {field.name !== "other_name" &&
                                    field.name !== "middle_name" && (
                                      <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                                        *
                                      </div>
                                    )}
                                </label>
                                {field.name === "phone_number" ? (
                                  <MuiPhoneNumber
                                    defaultCountry="ke" // Kenya as the default country
                                    name="phoneNumber"
                                    value={formData.phone_number}
                                    onChange={(value) =>
                                      handleInputChange({
                                        target: { name: "phone_number", value },
                                      })
                                    }
                                    error={!!errors.phone_number}
                                    helperText={errors.phone_number}
                                    disabled={!canEdit}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    dropdownClass="custom-dropdown" // Custom class for the dropdown
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: "120px", // Set max height for the dropdown
                                          overflowY: "auto",
                                        },
                                      },
                                      anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left",
                                      },
                                      transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left",
                                      },
                                    }}
                                  />
                                ) : field.type === "select" ? (
                                  <TextField
                                    select
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name={field.name}
                                    disabled={!canEdit || field.disabled}
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
                                    PaperComponent={(props) => (
                                      <Paper
                                        {...props}
                                        style={{
                                          maxHeight: 300,
                                          overflow: "auto",
                                        }}
                                      />
                                    )}
                                    disabled={!canEdit}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name={field.name}
                                        disabled={!canEdit}
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
                                    disabled={!canEdit || field.disabled}
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
