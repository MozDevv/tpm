'use client';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useIsLoading } from '@/context/LoadingContext';
import { BASE_CORE_API } from '@/utils/constants';
import {
  AddLink,
  AttachFile,
  Attachment,
  Close,
  Done,
  ExpandLess,
  HighlightOff,
  InsertLink,
  KeyboardArrowRight,
  OpenInFull,
  Verified,
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
  Link,
  Skeleton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Alert, message, notification, Select } from 'antd';
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
import { FieldDocuments } from '../FieldDocuments';
import {
  useIgcIdStore,
  useIgEditedStore,
  useRevisionPayloadFetchedStore,
} from '@/zustand/store';

dayjs.extend(isSameOrBefore);

function NewPreclaimForIgc({
  retireeId,
  revisionData,
  setRetireeId,
  clickedItem,
  setOnCloseWarnings,
  status,
  isPreclaim,
  setClickedItem,
  jsonPayload,
}) {
  const { isLoading, setIsLoading } = useIsLoading();
  const [errors, setErrors] = useState({});

  const mdaId = localStorage.getItem('mdaId');

  const [retiree, setRetiree] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [fieldsWithDocs, setFieldsWithDocs] = useState([]);

  const [selectedField, setSelectedField] = useState(null);

  const [refreshFieldsDocs, setRefreshFieldDocs] = useState(1);

  const [loading, setLoading] = useState(false);

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
  function mapFieldsToDocs(data) {
    const transformed = { fields: [] };

    data.prospectivePensionerDocumentSelections.forEach((selection) => {
      selection.documentType.documentTypeFields.forEach((field) => {
        let fieldEntry = transformed.fields.find(
          (f) => f.name === field.field_name
        );

        if (!fieldEntry) {
          fieldEntry = { name: field.field_name, documents: [] };
          transformed.fields.push(fieldEntry);
        }

        fieldEntry.documents.push({
          name: selection.documentType.name,
          description: selection.documentType.description,
          extenstions: selection.documentType.extenstions,
          fileUrl: selection.fileUrl,
          selectionId: selection.id,
          documentSelectionVerifications:
            selection.documentSelectionVerifications,
        });
      });
    });

    console.log('transformed', transformed);
    return transformed;
  }

  const [unverifiedDocs, setUnverifiedDocs] = useState([]);

  const fetchRetiree = async () => {
    setLoading(true);
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

      const fieldsWithDocs = mapFieldsToDocs(retiree);

      const unverifiedDocuments = checkUnverifiedFields(
        fieldsWithDocs.fields,
        status,
        isPreclaim === false ? true : false
      );

      setUnverifiedDocs(unverifiedDocuments);
      console.log('unverifiedDocuments', unverifiedDocuments);

      setFieldsWithDocs(fieldsWithDocs);
      const ageOnDischarge = computeAgeOfDischarge(
        retiree?.dob,
        retiree?.retirement_date
      );
      setFormData({
        personal_number: retiree?.personal_number ?? '',
        first_name: retiree?.first_name ?? '',
        surname: retiree?.surname ?? '',
        other_name: retiree?.other_name ?? '',
        middle_name: retiree?.middle_name ?? '',
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
        death_certificate_number: retiree?.death_certificate_number ?? '',
        date_of_death: retiree?.date_of_death,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retireeId) {
      fetchRetiree();
    }
  }, [refreshFieldsDocs]);

  function checkUnverifiedFields(fieldsObject, currentStatus, isClaim) {
    const unverifiedFields = [];

    // Loop through each field in the fields array
    fieldsObject.forEach((field) => {
      const fieldName = field.name;

      // Loop through each document in the documents array
      field.documents.forEach((document) => {
        // Loop through each verification in the documentSelectionVerifications array
        document.documentSelectionVerifications.forEach((verification) => {
          // Check if the verification matches the current status based on isClaim
          if (
            (isClaim && verification.claim_stage === currentStatus) ||
            (!isClaim &&
              verification.prospective_pensioner_notification_status ===
                currentStatus)
          ) {
            // If the document is not verified, store the relevant information
            // if (!verification.verified_by_id) {
            unverifiedFields.push({
              field: fieldName,
              documentName: document.name,
              documentDescription: document.description,
              fileUrl: document.fileUrl,
              selectionId: document.selectionId,
              isVerified: verification.verified_by_id ? true : false,
            });
          }
        });
      });
    });

    return unverifiedFields;
  }

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
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const handleInputChange = (e) => {
    setIsBeingEdited(true);
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
  const { setAlert } = useAlert();
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
      .filter((exitGround) => {
        // FOR CAP189 FILTER OUT RETIREMENT ON AGE GROUNDS IF AGE IS LESS THAN 50
        if (formData.retirement_date && formData.dob) {
          const dob = dayjs(formData.dob);
          const retirementDate = dayjs(formData.retirement_date);

          const ageOfDischarge = retirementDate.diff(dob, 'year');

          if (activeCapName === 'CAP189') {
            if (ageOfDischarge < 50) {
              return !exitGround.name
                .toLowerCase()
                .includes('retirement on age grounds');
            }
          }
        }
        return true; // Ensure other exit grounds are not filtered out
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
    formData.dob,
    formData.retirement_date,
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

  const [saving, setSaving] = useState(-1);
  const [fillBeneficiariesWarning, setFillBeneficiariesWarning] = useState({
    open: false,
    message: '',
  });

  const [dobError, setDobError] = useState(null);
  const { igcEdited, setIgcEdited } = useIgEditedStore();
  const handleSubmit = () => {
    setIgcEdited((prev) => !prev);
  };

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
      setFormData((prevFormData) => ({
        ...prevFormData,
        retirement_date: formData.date_of_death,
        // ...(activeCapName === 'CAP189' &&
        //   formData.mortality_status === 1 && {
        //     date_of_injury_for_cap189: formData.date_of_death,
        //   }),
        // ...(activeCapName === 'CAP199' &&
        //   formData.mortality_status === 1 && {
        //     date_of_injury_for_cap199: formData.date_of_death,
        //   }),
      }));
    }
  }, [formData.date_of_death, activeCapName]);

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

  useEffect(() => {
    validateRetirementDate();
  }, [
    formData.pension_award_id,
    formData.dob,
    formData.retirement_date,
    formData.disability_status,
  ]);

  const canEdit = (fieldName) => {
    const basicDetailFields = jsonPayload?.BasicDetailFields || [];
    return (
      formData.notification_status === 0 ||
      formData.notification_status === 2 ||
      formData.notification_status === '' ||
      basicDetailFields.includes(fieldName)
    );
  };

  const [open, setOpen] = useState({});

  const handleToggleSection = (section) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [section]: !prevOpen[section],
    }));
  };

  const [openFieldDocs, setOpenFieldDocs] = useState(false);

  const { igcId } = useIgcIdStore();

  const saveIgcChanges = async () => {
    try {
      // Filter formData to only include fields in jsonPayload.BasicDetailFields

      let filteredFormData = formData;
      if (filteredFormData.hasOwnProperty('was_injured')) {
        filteredFormData.was_injured = filteredFormData.was_injured === 1;
      }
      const dataToSend = {
        id: igcId,
        section: 0,
        data: {
          basicDetails: {
            ...filteredFormData,
            exit_ground_id: formData.exit_grounds,
            mda_id: clickedItem?.mda_id,
          },
        },
      };
      const res = await apiService.post(
        endpoints.updateRevisedCase,
        dataToSend
      );
      if (res.status === 200 && res.data.succeeded) {
        setIsBeingEdited(false);
        message.success('Changes saved successfully');
      }
    } catch (error) {
      console.error('Error saving IGC changes:', error);
    }
  };

  // const {igcId} = useIgcIdStore();

  // const fetchRevisionPayload = async () => {
  //   try {
  //     const res = await setupsApi.get(endpoints.getRevisionPayload(igcId));
  //     if (res.status === 200) {
  //       console.log('Fetched revision payload:', res.data.result);
  //       return res.data.result.data;
  //     }
  //   } catch (error) {
  //     console.log('Error fetching revision payload:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRevisionPayload().then((data) => {
  //     setRevisionData(data);
  //   });
  // }, [igcId]);

  const getFieldValue = (field) => {
    let value;
    if (
      !isBeingEdited &&
      revisionData &&
      revisionData.sectionsUpdated?.includes(0) &&
      revisionData.basicDetailFields?.includes(field.name)
    ) {
      value = revisionData.prospective_pensioner[field.name];
      // Parse the value if it is a date
      if (field.type === 'date' && value) {
        value = parseDate(value);
      }
    } else {
      value = formData[field.name];
    }

    // console.log(`Field: ${field.name}, Value:`, value); // Log the field name and its value
    return value;
  };

  // Utility function to parse date
  const parseDate = (date) => {
    if (date) {
      return new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    return '';
  };
  return (
    <div className="max-h-[85vh]  overflow-y-auto pb-[250px]">
      {/* {JSON.stringify(clickedItem)} */}
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
        <Dialog
          open={openFieldDocs}
          onClose={() => setOpenFieldDocs(false)}
          fullWidth
          maxWidth="lg" // Change maxWidth to "lg" for larger width
          sx={{
            '& .MuiDialog-paper': {
              width: '70vw', // Adjust the width as needed
              maxWidth: 'none', // Disable the maxWidth constraint
            },
          }}
        >
          <FieldDocuments
            setRefreshFieldDocs={setRefreshFieldDocs}
            fieldData={
              fieldsWithDocs &&
              fieldsWithDocs.fields &&
              fieldsWithDocs.fields.find((f) => f.name === selectedField)
            }
            clickedItem={formData}
            status={status}
            isPreclaim={isPreclaim}
            handleOnClose={() => setOpenFieldDocs(false)}
          />
        </Dialog>
        <div className="col-span-12    bg-white shadow-sm rounded-2xl pb-4">
          <form className="">
            <div className="pt-2 sticky top-0 bg-inherit  pb-2 bg-white z-50">
              <div className="flex items-center justify-between px-6 w-[100%]">
                <div className="flex items-center gap-2"></div>

                <div className="flex justify-end mr-5">
                  <Button
                    variant="contained"
                    onClick={() => {
                      saveIgcChanges();
                    }}
                  >
                    Save Changes
                  </Button>
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
            {/* {true && (
              <div
                className="py-2 mt-2 absolute top-[-70px] left-40 w-[90%]"
                style={{ fontFamily: 'Montserrat' }}
              >
                <Alert
                  // message={fillBeneficiariesWarning.message}
                  message="Please fill in the Beneficiaries' Details for the deceased retiree."
                  type="warning"
                  closable
                  showIcon
                  //onClose={onClose}
                />
              </div>
            )} */}

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 px-6 py-1 ">
                          {section.fields
                            .filter((field) => {
                              const capName =
                                activeCapName ||
                                (clickedItem &&
                                  clickedItem.mda_pensionCap_name) ||
                                '';

                              return (
                                !capName || field.pensionCap.includes(capName)
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
                                {loading ? (
                                  <>
                                    <Skeleton
                                      variant="text"
                                      width={100}
                                      height={20}
                                    />
                                    <Skeleton
                                      variant="rectangular"
                                      width="100%"
                                      height={35}
                                    />
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <label className="text-xs font-semibold text-gray-600 flex items-center  w-full ">
                                      <div className="flex items-center">
                                        {field.label}
                                        {field.name !== 'other_name' &&
                                          field.name !== 'service_increments' &&
                                          field.name !== 'middle_name' &&
                                          canEdit(field.name) && (
                                            <div className="text-red-600 text-[18px] mt-[1px] font-semibold">
                                              *
                                            </div>
                                          )}
                                      </div>
                                      {Array(fieldsWithDocs) &&
                                        fieldsWithDocs &&
                                        fieldsWithDocs?.fields?.some(
                                          (f) => f.name === field.name
                                        ) && (
                                          <IconButton
                                            sx={{
                                              py: 0,
                                            }}
                                            onClick={() => {
                                              setOpenFieldDocs(true);
                                              setSelectedField(field.name);
                                            }}
                                          >
                                            <Attachment
                                              sx={{
                                                fontSize: '24px ',
                                                color: '#006990',
                                              }}
                                            />
                                          </IconButton>
                                        )}
                                      {Array(unverifiedDocs) &&
                                        unverifiedDocs &&
                                        unverifiedDocs.some(
                                          (doc) => doc.field === field.name
                                        ) && (
                                          <Tooltip
                                            title={
                                              unverifiedDocs.find(
                                                (doc) =>
                                                  doc.field === field.name
                                              ).isVerified
                                                ? 'Verified'
                                                : 'Not Verified'
                                            }
                                          >
                                            <IconButton
                                              sx={{
                                                py: 0,
                                                ml: 'auto',
                                              }}
                                            >
                                              {unverifiedDocs.find(
                                                (doc) =>
                                                  doc.field === field.name
                                              ).isVerified ? (
                                                <Verified
                                                  sx={{
                                                    color: 'green',
                                                    fontSize: '20px',
                                                  }}
                                                />
                                              ) : (
                                                <Close
                                                  sx={{
                                                    color: 'red',
                                                    fontSize: '20px',
                                                  }}
                                                />
                                              )}
                                            </IconButton>
                                          </Tooltip>
                                        )}
                                    </label>
                                    {field.name === 'phone_number' ? (
                                      <MuiPhoneNumber
                                        defaultCountry="ke" // Kenya as the default country
                                        name="phoneNumber"
                                        value={formData.phone_number}
                                        onChange={(value) =>
                                          handleInputChange({
                                            target: {
                                              name: 'phone_number',
                                              value,
                                            },
                                          })
                                        }
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number}
                                        disabled={!canEdit(field.name)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        onBlur={handleSubmit}
                                        sx={{
                                          backgroundColor: canEdit(field.name)
                                            ? '#e0f7fa'
                                            : 'inherit', // Change background color if editable
                                        }}
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
                                        sx={{
                                          backgroundColor: canEdit(field.name)
                                            ? '#e0f7fa'
                                            : 'inherit', // Change background color if editable
                                        }}
                                        name={field.name}
                                        disabled={!canEdit(field.name)}
                                        value={getFieldValue(field)}
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
                                              value: newValue
                                                ? newValue.id
                                                : '',
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
                                        disabled={!canEdit(field.name)}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            onBlur={handleSubmit}
                                            sx={{
                                              backgroundColor: canEdit(
                                                field.name
                                              )
                                                ? '#e0f7fa'
                                                : 'inherit', // Change background color if editable
                                            }}
                                            name={field.name}
                                            disabled={!canEdit(field.name)}
                                            error={!!errors[field.name]}
                                            helperText={errors[field.name]}
                                          />
                                        )}
                                        value={
                                          field.children.find(
                                            (option) =>
                                              option.id === getFieldValue(field)
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
                                        disabled={!canEdit(field.name)}
                                        size="small"
                                        onBlur={handleSubmit}
                                        sx={{
                                          backgroundColor: canEdit(field.name)
                                            ? '#e0f7fa'
                                            : 'inherit', // Change background color if editable
                                        }}
                                        value={getFieldValue(field)}
                                        onChange={handleInputChange}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                        fullWidth
                                      />
                                    )}
                                  </>
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
                  <AddBeneficiaries
                    activeCapName={activeCapName}
                    formData={formData}
                    setOnCloseWarnings={setOnCloseWarnings}
                    id={retireeId}
                    status={formData?.notification_status}
                  />
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

export default NewPreclaimForIgc;
