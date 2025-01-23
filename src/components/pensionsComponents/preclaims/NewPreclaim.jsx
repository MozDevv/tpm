'use client';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useIsLoading } from '@/context/LoadingContext';
import { BASE_CORE_API } from '@/utils/constants';
import {
  Close,
  Done,
  ExpandLess,
  KeyboardArrowRight,
  OpenInFull,
} from '@mui/icons-material';
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { message, notification, Select } from 'antd';
import { useMda } from '@/context/MdaContext';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/en-au';
import { createSections } from './CreateSections';
import PhoneInput from 'react-phone-input-2';
import './ag-theme.css';
import MuiPhoneNumber from 'mui-phone-number';
import { toProperCase } from '@/utils/numberFormatters';
import AddBeneficiaries from './AddBeneficiaries';
import { validateField } from './PreclaimsValidator';

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

  const mdaId = localStorage.getItem('mdaId');

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
      return retirementDateObj.diff(dobDate, 'year');
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

      const parseDate = (date) => {
        if (date) {
          return new Date(date).toISOString().split('T')[0];
        }
        return '';
      };
      const ageOnDischarge = computeAgeOfDischarge(
        retiree?.dob,
        retiree?.retirement_date
      );
      setFormData({
        personal_number: retiree?.personal_number ?? '',
        first_name: retiree?.first_name ?? '',
        surname: retiree?.surname ?? '',
        other_name: retiree?.other_name ?? '',
        dob: retiree?.dob
          ? new Date(retiree.dob).toISOString().split('T')[0]
          : '',
        gender: retiree?.gender ?? '',
        postal_code: retiree?.postal_code ?? '',
        notification_status: retiree?.notification_status ?? '',

        identifier_type: retiree?.identifier_type ?? '',
        national_id: retiree?.national_id ?? '',
        kra_pin: retiree?.kra_pin ?? '',
        designation_grade: retiree?.designation_grade ?? '',
        mortality_status: retiree?.mortality_status ?? '',
        marital_status: retiree?.marital_status ?? '',
        email_address: retiree?.email_address ?? '',
        postal_address: retiree?.postal_address ?? '',
        postal_code: retiree?.postal_code_id ?? '',
        phone_number: retiree?.phone_number ?? '',
        grade_id: retiree?.grade_id ?? '',
        designation_id: retiree?.designation_id ?? '',

        country_id:
          retiree?.country?.id ?? '94ece052-7142-477a-af0f-c3909402d247',
        county_id: retiree?.constituency?.county_id ?? '',
        constituency_id: retiree?.constituency?.constituency_name ?? '',
        city_town: retiree?.city_town ?? '',
        pension_award_id: retiree?.pensionAward?.id ?? '',
        date_of_first_appointment: retiree?.date_of_first_appointment
          ? new Date(retiree.date_of_first_appointment)
              .toISOString()
              .split('T')[0]
          : '',
        date_of_confirmation: retiree?.date_of_confirmation
          ? new Date(retiree.date_of_confirmation).toISOString().split('T')[0]
          : '',
        authority_for_retirement_reference:
          retiree?.authority_for_retirement_reference ?? '',
        authority_for_retirement_dated: retiree?.authority_for_retirement_dated
          ? new Date(retiree.authority_for_retirement_dated)
              .toISOString()
              .split('T')[0]
          : '',
        retirement_date: retiree?.retirement_date
          ? new Date(retiree.retirement_date).toISOString().split('T')[0]
          : '',
        date_from_which_pension_will_commence:
          retiree?.date_from_which_pension_will_commence
            ? new Date(retiree.date_from_which_pension_will_commence)
                .toISOString()
                .split('T')[0]
            : '',
        last_basic_salary_amount: retiree?.last_basic_salary_amount ?? '',
        last_pay_date: retiree.last_pay_date
          ? new Date(retiree.last_pay_date).toISOString().split('T')[0]
          : '',
        disability_status: retiree?.disability_status ?? '',
        exit_grounds: retiree?.exitGround?.id ?? '',

        tax_exempt_certificate_number:
          retiree?.tax_exempt_certificate_number ?? '',
        tax_exempt_certificate_date: retiree?.tax_exempt_certificate_date
          ? new Date(retiree.tax_exempt_certificate_date)
              .toISOString()
              .split('T')[0]
          : '',

        military_id: retiree?.military_id ?? '',
        monthly_salary_in_ksh: retiree?.monthly_salary_in_ksh ?? 0,
        service_increments: retiree?.service_increments ?? 0,
        monthly_aditional_pay: retiree?.monthly_aditional_pay ?? 0,
        tribe: retiree?.tribe ?? '',
        maintenance_case: retiree?.maintenance_case ?? 1,
        is_wcps: retiree?.is_wcps ?? 1,
        is_parliamentary: retiree?.is_parliamentary ?? false,
        age_on_discharge: ageOnDischarge,
        commutation_option_selection: retiree?.commutation_option_selection,
        commutation_option_selection_date:
          retiree?.commutation_option_selection_date
            ? new Date(retiree?.commutation_option_selection_date)
                .toISOString()
                .split('T')[0]
            : '',
        isCommutable: retiree?.exitGround?.has_commutation ?? false,
        was_injured: retiree?.was_injured ? 1 : 0,
        date_of_injury_for_cap189:
          parseDate(retiree?.injury_details_for_cap189?.date_of_injury) ?? '',

        salary_at_injury_for_cap189:
          retiree?.injury_details_for_cap189?.salary_at_injury ?? '',

        rate_of_injury_id_for_cap189:
          retiree?.injury_details_for_cap189?.rate_of_injury_id || '', // CAP 189 specific

        degree_of_disablement_for_cap199:
          retiree?.degree_of_disablement_details_for_cap199
            ?.degree_of_disablement || 0,

        date_of_injury_for_cap199:
          parseDate(
            retiree?.degree_of_disablement_details_for_cap199?.date_of_injury
          ) ?? '',

        salary_at_injury_for_cap199:
          retiree?.degree_of_disablement_details_for_cap199?.salary_at_injury ??
          '',
        was_in_mixed_service: retiree?.was_in_mixed_service ?? false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getInitialFormData = () => {
    try {
      const savedFormData = localStorage.getItem('retireeFormData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        if (parsedData && typeof parsedData === 'object') {
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error parsing saved form data: ', error);
    }

    const parseDate = (date) => {
      if (date) {
        return new Date(date).toISOString().split('T')[0];
      }
      return '';
    };

    const ageOnDischarge = computeAgeOfDischarge(
      retiree?.dob,
      retiree?.retirement_date
    );

    return {
      personal_number: retiree?.personal_number ?? '',
      first_name: retiree?.first_name ?? '',
      surname: retiree?.surname ?? '',
      other_name: retiree?.other_name ?? '',
      postal_code: retiree?.postal_code ?? '',
      dob: parseDate(retiree?.dob),
      notification_status: retiree?.notification_status ?? '',
      mortality_status: retiree?.mortality_status ?? '',
      marital_status: retiree?.marital_status ?? '',
      gender: retiree?.gender ?? '',
      identifier_type: retiree?.identifier_type ?? '',
      national_id: retiree?.national_id ?? '',
      grade_id: retiree?.grade_id ?? '',
      kra_pin: retiree?.kra_pin ?? '',
      designation_id: retiree?.designation_id ?? '',
      designation_grade: retiree?.designation_grade ?? '',
      email_address: retiree?.email_address ?? '',
      postal_address: retiree?.postal_address ?? '',
      postal_code: retiree?.postal_code_id ?? '',
      phone_number: retiree?.phone_number ?? '',
      country_id:
        retiree?.country?.id || '94ece052-7142-477a-af0f-c3909402d247',
      county_id: '',
      constituency_id: retiree?.constituency?.constituency_name ?? '',
      city_town: retiree?.city_town ?? '',
      pension_award_id: retiree?.pensionAward?.id ?? '',
      date_of_first_appointment: parseDate(retiree?.date_of_first_appointment),
      date_of_confirmation: parseDate(retiree?.date_of_confirmation),
      authority_for_retirement_reference:
        retiree?.authority_for_retirement_reference ?? '',
      authority_for_retirement_dated: parseDate(
        retiree?.authority_for_retirement_dated
      ),
      retirement_date: parseDate(retiree?.retirement_date),
      date_from_which_pension_will_commence: parseDate(
        retiree?.date_from_which_pension_will_commence
      ),
      last_basic_salary_amount: retiree?.last_basic_salary_amount ?? '',
      last_pay_date: parseDate(retiree?.last_pay_date),
      disability_status: retiree?.disability_status ?? '',
      maintenance_case: retiree?.maintenance_case ?? 1,
      tax_exempt_certificate_number:
        retiree?.tax_exempt_certificate_number ?? '',
      exit_grounds: retiree?.exitGround?.id ?? '',
      tax_exempt_certificate_date: parseDate(
        retiree?.tax_exempt_certificate_date
      ),
      military_id: retiree?.military_id ?? '',
      monthly_salary_in_ksh: retiree?.monthly_salary_in_ksh ?? 0,
      service_increments: retiree?.service_increments ?? 0,
      monthly_aditional_pay: retiree?.monthly_aditional_pay ?? 0,
      tribe: retiree?.tribe ?? '',
      is_wcps: retiree?.is_wcps ?? 1,
      is_parliamentary: retiree?.is_parliamentary ?? false,
      age_on_discharge: ageOnDischarge,
      commutation_option_selection: retiree?.commutation_option_selection,
      commutation_option_selection_date: parseDate(
        retiree?.commutation_option_selection_date
      ),

      isCommutable: retiree?.exitGround?.has_commutation,
      pension_cap: retiree?.mda?.pensionCap?.id,
      was_injured: retiree?.was_injured ? 1 : 0,

      date_of_injury_for_cap189:
        parseDate(retiree?.injury_details_for_cap189?.date_of_injury) ?? '',

      salary_at_injury_for_cap189:
        retiree?.injury_details_for_cap189?.salary_at_injury ?? '',

      rate_of_injury_id_for_cap189:
        retiree?.injury_details_for_cap189?.rate_of_injury_id || '', // CAP 189 specific

      degree_of_disablement_for_cap199:
        retiree?.degree_of_disablement_details_for_cap199
          ?.degree_of_disablement || 0,

      date_of_injury_for_cap199:
        parseDate(
          retiree?.degree_of_disablement_details_for_cap199?.date_of_injury
        ) ?? '',

      salary_at_injury_for_cap199:
        retiree?.degree_of_disablement_details_for_cap199?.salary_at_injury ??
        '',
      was_in_mixed_service: retiree?.was_in_mixed_service ?? false,
    };
  };

  // State for form data
  const [formData, setFormData] = useState(getInitialFormData());
  const router = useRouter();

  const handleInputChange = (e) => {
    if (retireeId) {
      setEditMode(true);
    }
    let { name, value, type } = e.target;
    let parsedValue = type === 'number' ? parseFloat(value) : value;

    if (
      type === 'text' &&
      name !== 'kra_pin' &&
      name !== 'tax_exempt_certificate_number' &&
      name !== 'email_address' &&
      name !== 'tribe' &&
      name !== 'personal_number' &&
      name !== 'passport_no'
    ) {
      parsedValue = toProperCase(parsedValue);
    }

    if (name === 'is_parliamentary') {
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

    localStorage.setItem('retireeFormData', JSON.stringify(updatedFormData));
  };

  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem('retireeFormData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        if (parsedData && typeof parsedData === 'object') {
          setFormData(parsedData);
        } else {
          console.error('Invalid saved form data structure');
          fetchRetiree();
        }
      } else {
        fetchRetiree();
      }
    } catch (error) {
      console.error('Error parsing saved form data: ', error);
      fetchRetiree();
    }
  }, []);

  //const [mdas, setMdas] = useState([]);
  const [pensionAwards, setPensionAwards] = useState([]);

  const fetchPensionAwards = async () => {
    try {
      const res = await apiService.get(endpoints.pensionAwards, {
        'paging.pageSize': 100,
      });
      setPensionAwards(res.data.data);
    } catch (error) {
      console.error('Error fetching Pension Awards:', error);
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
        'paging.pageSize': 100,
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
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConstituencies = async () => {
    try {
      const res = await apiService.get(endpoints.getConstituencies, {
        'paging.pageSize': 1000,
      });
      setConstituencies(res.data.data);
    } catch (error) {
      console.error('Error fetching Constituencies:', error);
    }
  };
  const fetchCountries = async () => {
    try {
      const res = await apiService.get(endpoints.getCountries, {
        'paging.pageSize': 100,
      });

      setCountries(res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  const fetchExitGrounds = async () => {
    try {
      const res = await apiService.get(endpoints.getExitGrounds, {
        'paging.pageSize': 1000,
      });
      setExitGrounds(res.data.data);
    } catch (error) {
      console.error('Error fetching Exit Grounds:', error);
    }
  };

  const fetchPostalAddress = async () => {
    try {
      const res = await apiService.get(endpoints.getPostalCodes, {
        'paging.pageSize': 1000,
      });
      setPostalAddress(res.data.data);
    } catch (error) {
      console.error('Error fetching Postal Address:', error);
    }
  };

  const [grades, setGrades] = useState([]);
  const fetchGrades = async () => {
    try {
      const res = await apiService.get(endpoints.getAllGrades);
      if (res.status === 200) {
        setGrades(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };
  const [rateOfInjury, setRateOfInjury] = useState([]);

  const fetchRateOfInjury = async () => {
    try {
      const res = await apiService.get(endpoints.getRateOfInjury);
      if (res.status === 200) {
        const rateOfInjury1 = res.data.data.map((rate) => ({
          id: rate.id,
          name: rate.name,
        }));

        setRateOfInjury(rateOfInjury1);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  const { activePensionCap, activeCapName } = useMda('');

  useEffect(() => {
    fetchExitGrounds();
    fetchRateOfInjury();
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

  const [exitGroundOptions, setExitGroundOptions] = useState([]);

  useEffect(() => {
    const filteredOptions = exitGrounds
      .filter((exitGround) => {
        const currentPensionCap =
          activePensionCap === null ||
          activePensionCap === undefined ||
          activePensionCap === ''
            ? formData.pension_cap
            : activePensionCap;

        if (
          currentPensionCap === null ||
          currentPensionCap === undefined ||
          currentPensionCap === ''
        ) {
          if (formData.mortality_status === 1) {
            return exitGround.is_death;
          } else if (formData.mortality_status === 2) {
            return !exitGround.is_death;
          }
          return true;
        }

        if (exitGround.pension_cap_id !== currentPensionCap) {
          return false;
        }
        if (formData.mortality_status === 1) {
          return exitGround.is_death;
        } else if (formData.mortality_status === 2) {
          return !exitGround.is_death;
        }

        return true;
      })
      .filter((exitGround) => {
        // Additional condition to filter out "marriage" option if gender is male
        if (formData.gender === 0) {
          return !exitGround.name.toLowerCase().includes('marriage');
        }
        return true;
      })
      .map((exitGround) => ({
        id: exitGround.id,
        name: exitGround.name,
      }));

    setExitGroundOptions(filteredOptions);
  }, [
    formData.mortality_status,
    formData.pension_cap,
    exitGrounds,
    activePensionCap,
    formData.gender, // Add formData.gender to the dependency array
  ]);

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
    rateOfInjury,
    mdaId
  );

  const token = localStorage.getItem('token');

  const validateForm = () => {
    const newErrors = {};

    const fields = sections.flatmap((section) => section.fields);
    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation

      if (field.name === 'accountCode' && value) {
      }
      if (field.name === 'accountName' && value) {
      }
      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const [saving, setSaving] = useState(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (retireeId && !editMode) {
      // router.push(
      //   `/pensions/preclaims/listing/new/add-payment-details?id=${retireeId}`
      // );
      //   moveToNextTab();
      return;
    }

    for (const key of Object.keys(formData)) {
      if (
        key === 'is_parliamentary' &&
        (activeCapName === 'CAP196' ||
          activeCapName === 'DSO/RK' ||
          activeCapName === 'APN/PK')
      ) {
        formData.is_parliamentary = true;
      }
      if (
        key === 'date_of_confirmation' &&
        (activeCapName === 'CAP196' ||
          activeCapName === 'DSO/RK' ||
          activeCapName === 'APN/PK')
      ) {
        formData.date_of_confirmation = formData.date_of_first_appointment;
      }
    }

    const newErrors = {};
    for (const key of Object.keys(formData)) {
      if (
        key !== 'other_name' &&
        key !== 'postal_code' &&
        key !== 'notification_status' &&
        key !== 'designation_grade' &&
        key !== 'postal_address' &&
        key !== 'city_town' &&
        key !== 'country_id' &&
        key !== 'county_id' &&
        key !== 'constituency_id' &&
        key !== 'authority_for_retirement_reference' &&
        key !== 'authority_for_retirement_dated' &&
        key !== 'tax_exempt_certificate_number' &&
        key !== 'tax_exempt_certificate_date' &&
        key !== 'date_of_confirmation' &&
        key !== 'is_parliamentary' &&
        key !== 'military_id' &&
        key !== 'monthly_salary_in_ksh' &&
        key !== 'service_increments' &&
        key !== 'monthly_aditional_pay' &&
        key !== 'tribe' &&
        key !== 'maintenance_case' &&
        key !== 'is_wcps' &&
        key !== 'commutation_option_selection' &&
        key !== 'commutation_option_selection_date' &&
        key !== 'isCommutable' &&
        key !== 'was_injured' &&
        key !== 'date_of_injury_for_cap189' &&
        key !== 'salary_at_injury_for_cap189' &&
        key !== 'rate_of_injury_id_for_cap189' &&
        key !== 'degree_of_disablement_for_cap199' &&
        key !== 'date_of_injury_for_cap199' &&
        key !== 'salary_at_injury_for_cap199' &&
        key !== 'pension_award_id' &&
        key !== 'pension_cap' &&
        key !== 'was_in_mixed_service' &&
        key !== 'national_id' &&
        (formData[key] === undefined ||
          formData[key] === null ||
          formData[key] === '' ||
          formData[key] === false)
      ) {
        // newErrors[key] = "This field is required";
        // message.error(`This field is required: ${key}`);
        return; // Exit the function or block to stop further processing
      }
    }
    for (const key of Object.keys(formData)) {
      if (key === 'phone_number' && formData[key] === '') {
        newErrors[key] = 'This field is required';
        message.error('Phone number is required, Please fill in the field');
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
      const age = dayjs().diff(dobDate, 'year');
      if (age < 18) {
        newErrors.dob = 'User must be at least 18 years old';
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
    // setIsLoading(true);
    const formattedFormData = { ...formData };
    Object.keys(formattedFormData).forEach((key) => {
      if (
        (dayjs(formattedFormData[key]).isValid() && key.includes('date')) ||
        key === 'dob'
      ) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          'YYYY-MM-DDTHH:mm:ss[Z]'
        );
      }
    });

    if (!mdaId) {
      message.error('MDA not found, Please sign in as an MDA user');
      return;
    }

    const injury_details =
      activeCapName === 'CAP189'
        ? {
            date_of_injury: dayjs(formData.date_of_injury_for_cap189).isValid()
              ? dayjs(formData.date_of_injury_for_cap189).format(
                  'YYYY-MM-DDTHH:mm:ss[Z]'
                )
              : '',
            salary_at_injury: formData.salary_at_injury_for_cap189 ?? '',
            rate_of_injury_id: formData.rate_of_injury_id_for_cap189 ?? '',
          }
        : null;

    const disablement_details =
      activeCapName === 'CAP199'
        ? {
            date_of_injury: dayjs(formData.date_of_injury_for_cap199).isValid()
              ? dayjs(formData.date_of_injury_for_cap199).format(
                  'YYYY-MM-DDTHH:mm:ss[Z]'
                )
              : '',
            degree_of_disablement:
              formData.degree_of_disablement_for_cap199 ?? 0,
            salary_at_injury: formData.salary_at_injury_for_cap199 ?? '',
          }
        : null;

    const data = {
      ...formattedFormData,
      mda_id: mdaId,
      ...(formData?.was_injured === 1 && {
        disablement_details,
        injury_details,
      }),
      was_injured: formData?.was_injured === 1 ? true : false,
    };

    try {
      let res;
      setSaving(1);

      if (retireeId) {
        res = await axios.post(
          `${BASE_CORE_API}api/ProspectivePensioners/UpdateProspectivePensioner`,
          { ...data, id: retireeId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res?.status === 200 && res?.data?.succeeded) {
          if (
            res.data.messages[0] ===
            'Prospective pensioner updated successfully'
          ) {
            localStorage.removeItem('retireeFormData');
            setSaving(2);
            setAlert({
              open: true,
              message:
                'Prospective pensioner Information & Contact Details updated successfully',
              severity: 'success',
            });
            fetchRetiree();
            setEditMode(false);
            return;
          }
        }

        if (res?.data?.validationErrors?.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
          setSaving(3);
          return;
        }

        if (res.data.succeeded === false && res.data.messages[0]) {
          message.error(res.data.messages[0]);
          setSaving(3);
          return;
        }
      } else {
        res = await axios.post(
          `${BASE_CORE_API}api/ProspectivePensioners/CreateProspectivePensioner`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (res.data.succeeded && res.status === 200) {
        setSaving(2);
        formData.mortality_status == 1 &&
          message.success(
            'Prospective pensioner updated successfully, please proceed to the add Beneficiary Details'
          );

        setRetireeId(res.data.data);
        setAlert({
          open: true,
          message: 'Prospective pensioner created successfully',
          severity: 'success',
        });

        localStorage.removeItem('retireeFormData');
        //  clickedItem && moveToNextTab();
        setRetireeId(res.data.data);
        return;
      }

      if (res?.data?.validationErrors?.length > 0) {
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
        setSaving(3);
        return;
      }

      if (res?.data?.succeeded === false) {
        if (
          res.data.messages[0] ===
          'A similar award has already been created for the retiree.'
        ) {
          message.error(res.data.messages[0]);
          setSaving(3);
          return;
        } else if (res.data.messages[0]) {
          message.error(res.data.messages[0]);
          setSaving(3);
          return;
        }
      }
    } catch (error) {
      console.log('API Error:', error);
      // setSaving(3);
    }
  };

  const [dobError, setDobError] = useState(null);

  const validateRetirementDate = () => {
    const pensionAward = pensionAwards.find(
      (award) => award.id === formData.pension_award_id
    );

    const dob = dayjs(formData.dob); // Assuming dob is in "YYYY-MM-DD" format
    const retirementDate = dayjs(formData.retirement_date);

    if (pensionAward && pensionAward.name === 'RETIREMENT ON AGE GROUNDS') {
      const retirementAge = formData.disability_status === 0 ? 65 : 60;
      const expectedRetirementDate = dob.add(retirementAge, 'year');

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
      const nextDay = lastPayDate.add(1, 'day').format('YYYY-MM-DD');
      setFormData({
        ...formData,
        date_from_which_pension_will_commence: nextDay,
      });
    }
  }, [formData.retirement_date]);

  // useEffect(() => {
  //   if (formData.commutation_option_selection === true) {
  //     setFormData({
  //       ...formData,
  //       commutation_option_selection: "Yes",
  //     });
  //   } else if (formData.commutation_option_selection === false) {
  //     setFormData({
  //       ...formData,
  //       commutation_option_selection: "No",
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       commutation_option_selection: "",
  //     });
  //   }
  // }, [formData.commutation_option_selection]);

  useEffect(() => {
    if (formData.retirement_date && formData.dob) {
      const dob = dayjs(formData.dob);
      const retirementDate = dayjs(formData.retirement_date);

      const ageOfDischarge = retirementDate.diff(dob, 'year');

      setFormData((prevData) => ({
        ...prevData,
        age_on_discharge: ageOfDischarge,
      }));
    }
  }, [formData.retirement_date, formData.dob]);

  useEffect(() => {
    if (formData.date_of_death) {
      setFormData({
        ...formData,
        retirement_date: formData.date_of_death,
      });
    }
  }, [formData.date_of_death]);

  const [countriesArr, setCountriesArr] = useState([]);

  useEffect(() => {
    // Fetch country data from the API
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : ''),
          }))
          .filter((country) => country.code); // Filter countries with valid codes
        setCountriesArr(countryData);
      })
      .catch((error) => console.error('Error fetching country codes:', error));
  }, []);

  const [selectedCountryCode, setSelectedCountryCode] = useState('+254');
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
    formData.notification_status === '';

  const [open, setOpen] = useState({});

  const handleToggleSection = (section) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [section]: !prevOpen[section],
    }));
  };
  return (
    <div className="max-h-[85vh]  overflow-y-auto pb-[250px]">
      <div className="w-full p-2  mr-1 h-full grid grid-cols-12 gap-2 mt-[-20px] ">
        <IconButton
          sx={{
            ml: 'auto',
            position: 'fixed',
            zIndex: 899999999,
            right: 1,
            top: '3px',
          }}
        >
          <Tooltip title="Expand">
            {' '}
            <OpenInFull sx={{ color: 'primary.main', fontSize: '18px' }} />
          </Tooltip>{' '}
        </IconButton>
        <div className="col-span-12    bg-white shadow-sm rounded-2xl pb-4">
          <form className="">
            <div className="pt-2 sticky top-0 bg-inherit  pb-2 bg-white z-50">
              <div className="flex items-center justify-between px-6 w-[100%]">
                <div className="flex items-center gap-2"></div>
                <div className="flex">
                  {saving === 1 ? (
                    <div className="flex justify-between w-full mt-[-10px]  pr-6">
                      <div className=""></div>
                      <div className="flex flex-row gap-2 items-center">
                        <span class="loader"></span>
                        <p className="text-primary text-[17px] font-normal">
                          Saving...
                        </p>
                      </div>
                    </div>
                  ) : saving === 2 ? (
                    <div className="flex justify-between w-full mt-[-10px]  pr-6">
                      <div className=""></div>
                      <div className="flex flex-row gap-2 items-center">
                        <Done
                          sx={{
                            fontSize: '25px',
                            color: '#006990',
                            marginRight: '-6px',
                          }}
                        />
                        <p className="text-primary text-[17px] font-normal">
                          Saved
                        </p>
                      </div>
                    </div>
                  ) : saving === 3 ? (
                    <div className="flex justify-between w-full mt-[-10px]  pr-6">
                      <div className=""></div>
                      <div className="flex flex-row gap-2 items-center">
                        <Close
                          sx={{
                            fontSize: '23px',
                            color: 'crimson',
                            marginRight: '-3px',
                          }}
                        />
                        <p className="text-[crimson] text-[17px] font-normal">
                          Not Saved
                        </p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {/* <div className="flex ">
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
                </div> */}
              </div>
            </div>

            <div className="p-2 mt-[-15px]">
              {sections
                .filter((section) => {
                  if (section.title === 'Contact Details') {
                    return (
                      formData.notification_status !== 0 &&
                      formData.notification_status !== 2 &&
                      formData.notification_status !== ''
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
                          sx={{ ml: '-5px', zIndex: 1 }}
                          onClick={() => handleToggleSection(section.title)}
                        >
                          {open[section.title] ? (
                            <KeyboardArrowRight
                              sx={{ color: 'primary.main', fontSize: '14px' }}
                            />
                          ) : (
                            <ExpandLess
                              sx={{ color: 'primary.main', fontSize: '14px' }}
                            />
                          )}
                        </IconButton>
                        <hr className="flex-grow border-blue-500 border-opacity-20" />
                      </div>

                      <Collapse
                        in={!open[section.title]}
                        timeout="auto"
                        unmountOnExit
                      >
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
                                  'authority_for_retirement_reference' ||
                                field.name === 'commutation_option_selection' ||
                                field.name ===
                                  'commutation_option_selection_date'
                              ) {
                                return (
                                  formData.notification_status !== 0 &&
                                  formData.notification_status !== 2 &&
                                  formData.notification_status !== ''
                                );
                              }
                              return true;
                            })
                            .filter((field) => {
                              if (!formData.isCommutable) {
                                return (
                                  field.name !==
                                    'commutation_option_selection' &&
                                  field.name !==
                                    'commutation_option_selection_date'
                                );
                              }

                              return true;
                            })
                            .map((field, fieldIndex) => (
                              <div
                                key={fieldIndex}
                                style={{
                                  display: field.hide ? 'none' : 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                  {field.label}
                                  {field.name !== 'other_name' &&
                                    field.name !== 'service_increments' &&
                                    field.name !== 'middle_name' && (
                                      <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                                        *
                                      </div>
                                    )}
                                </label>
                                {field.name === 'phone_number' ? (
                                  <MuiPhoneNumber
                                    defaultCountry="ke" // Kenya as the default country
                                    name="phoneNumber"
                                    value={formData.phone_number}
                                    onChange={(value) =>
                                      handleInputChange({
                                        target: { name: 'phone_number', value },
                                      })
                                    }
                                    error={!!errors.phone_number}
                                    helperText={errors.phone_number}
                                    disabled={!canEdit}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onBlur={handleSubmit}
                                    dropdownClass="custom-dropdown" // Custom class for the dropdown
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: '120px', // Set max height for the dropdown
                                          overflowY: 'auto',
                                        },
                                      },
                                      anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                      },
                                      transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                      },
                                    }}
                                  />
                                ) : field.type === 'select' ? (
                                  <TextField
                                    select
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onBlur={handleSubmit}
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
                                ) : field.type === 'autocomplete' ? (
                                  <Autocomplete
                                    options={field.children}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, newValue) => {
                                      handleInputChange({
                                        target: {
                                          name: field.name,
                                          value: newValue ? newValue.id : '',
                                        },
                                      });
                                    }}
                                    PaperComponent={(props) => (
                                      <Paper
                                        {...props}
                                        style={{
                                          maxHeight: 300,
                                          overflow: 'auto',
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
                                        onBlur={handleSubmit}
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
                                    onBlur={handleSubmit}
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
            {formData.mortality_status === 1 ? (
              <div className="h-[100px]">
                <div className="gap-3 my-3">
                  <AddBeneficiaries id={retireeId} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPreclaim;
