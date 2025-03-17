'use client';
import React, { useEffect, useState } from 'react';
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';
import { Button } from '@mui/material';
import { name } from 'dayjs/locale/en-au';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';

const IgcBeneficiaries = () => {
  const statusIcons = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };

  const notificationStatusMap = {
    0: { name: 'Open', color: '#1976d2' },
    1: { name: 'Pending', color: '#fbc02d' },
    2: { name: 'Approved', color: '#2e7d32' },
    3: { name: 'Rejected', color: '#d32f2f' },
  };

  const columnDefs = [
    {
      field: 'igc_no',
      headerName: 'IGC No',
      headerClass: 'prefix-header',
      pinned: 'left',
      filter: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      filter: true,
    },

    {
      field: 'identifier',
      headerName: 'Identifier',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'relationship',
      headerName: 'Relationship',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'age',
      headerName: 'Age',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'birth_certificate_no',
      headerName: 'Birth Certificate No',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'supporting_document_number',
      headerName: 'Supporting Document Number',
      headerClass: 'prefix-header',
      filter: true,
    },
    {
      field: 'document_status',
      headerName: 'Document Status',
      headerClass: 'prefix-header',
      filter: true,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconComponent
              style={{
                color: status.color,
                marginRight: '6px',
                fontSize: '17px',
              }}
            />
            <span
              style={{
                color: status.color,
                fontWeight: 'semibold',
                fontSize: '13px',
              }}
            >
              {status.name}
            </span>
          </div>
        );
      },
    },
    {
      field: 'submission_status',
      headerName: 'IGC Submission Status',
      headerClass: 'prefix-header',
      filter: true,
      cellRenderer: (params) => {
        const status = notificationStatusMap[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 3,
              maxHeight: '22px',
              cursor: 'pointer',
              color: status.color,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {status.name.toLowerCase()}
          </Button>
        );
      },
    },
    {
      field: 'created_date',
      headerName: 'Created Date',
      headerClass: 'prefix-header',
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
  ];

  const transformData = (data) => {
    return data.map((item) => ({
      igc_no: item.igcEnrolment.no,
      surname: item.beneficiary.surname,
      first_name: item.beneficiary.first_name,
      other_name: item.beneficiary.other_name,
      identifier: item.beneficiary.identifier,
      relationship: item.beneficiary.relationship.name,
      mobile_number: item.beneficiary.mobile_number,
      email_address: item.beneficiary.email_address,
      dob: item.beneficiary.dob,
      age: item.beneficiary.age,
      address: item.beneficiary.address,
      birth_certificate_no: item.beneficiary.birth_certificate_no,
      supporting_document_number: item.igcEnrolment.supporting_document_number,
      document_status: item.igcEnrolment.doumet_status,
      submission_status: item.igcEnrolment.iGCSubmissionStatuses,
      created_date: item.igcEnrolment.created_date,
    }));
  };
  const [openInitiate, setOpenInitiate] = useState(false);

  const handlers = {
    initiateDependentEnrollment: () => {
      setOpenInitiate(true);
      setOpenBaseCard(true);
    },
  };
  const baseCardHandlers = {};
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? 'Beneficiary' : 'Create New Beneficiary';

  const { data: beneficiaries } = useFetchAsync(
    endpoints.getRelationships,
    apiService
  );
  const [claims, setClaims] = useState([]);

  const fetchPensioners = async () => {
    let filters = {};
    let statusArr = [7, 8, 9, 10, 11];

    if (statusArr && statusArr.length > 0) {
      // When statusArr is provided, loop through it and populate criterions array
      statusArr.forEach((status, index) => {
        filters[`filterCriterion.criterions[${index}].propertyName`] = 'stage';
        filters[`filterCriterion.criterions[${index}].propertyValue`] = status;
        filters[`filterCriterion.criterions[${index}].criterionType`] = 0; // Adjust criterionType if necessary
      });
    }

    try {
      const res = await assessApiService.get(
        assessEndpoints.getAssessmentClaims,
        {
          'paging.pageSize': 100000,
          'paging.pageNumber': 1,
          ...filters,
          'filterCriterion.compositionType': 1,
        }
      );
      if (res.status === 200) {
        const mappedData = res.data.data.map((item) => ({
          id: item?.prospectivePensioner?.prospectivePensionerAwards[0]
            ?.pension_award?.prefix
            ? item?.prospectivePensioner?.prospectivePensionerAwards[0]
                ?.pension_award?.prefix + item?.pensioner_number
            : item?.pensioner_number ?? 'N/A',
          name: item?.prospectivePensioner?.prospectivePensionerAwards[0]
            ?.pension_award?.prefix
            ? item?.prospectivePensioner?.prospectivePensionerAwards[0]
                ?.pension_award?.prefix + item?.pensioner_number
            : item?.pensioner_number ?? 'N/A',
          accountNo:
            item?.prospectivePensioner?.first_name +
            ' ' +
            item?.prospectivePensioner?.surname,
        }));
        console.log('mappedData', mappedData);
        setClaims(mappedData);
      } // Handle the response as needed
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPensioners();
    // fetchBanksAndBranches();
  }, []);

  const fields = [
    { name: 'igc_no', label: 'IGC No', type: 'text', disabled: true },
    { name: 'surname', label: 'Surname', type: 'text', disabled: true },
    { name: 'first_name', label: 'First Name', type: 'text', disabled: true },
    { name: 'other_name', label: 'Other Name', type: 'text', disabled: true },
    { name: 'identifier', label: 'Identifier', type: 'text', disabled: true },
    {
      name: 'relationship',
      label: 'Relationship',
      type: 'text',
      disabled: true,
    },
    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'email_address',
      label: 'Email Address',
      type: 'text',
      disabled: true,
    },
    { name: 'dob', label: 'Date of Birth', type: 'date', disabled: true },
    { name: 'age', label: 'Age', type: 'text', disabled: true },
    { name: 'address', label: 'Address', type: 'text', disabled: true },
    {
      name: 'birth_certificate_no',
      label: 'Birth Certificate No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'supporting_document_number',
      label: 'Supporting Document Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'document_status',
      label: 'Document Status',
      type: 'select',
      disabled: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'submission_status',
      label: 'IGC Submission Status',
      type: 'select',
      disabled: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'created_date',
      label: 'Created Date',
      type: 'date',
      disabled: true,
    },
  ];

  const uploadFields = [
    {
      name: 'prospective_pensioner_id',
      label: 'Retiree',
      type: 'select',
      options: claims && claims,
      table: true,
    },
    { name: 'reason', label: 'Reason', type: 'text' },
    {
      name: 'relationship',
      label: 'Relationship',
      type: 'autocomplete',
      options:
        beneficiaries &&
        beneficiaries?.map((item) => ({
          id: item.id,
          name: item.name,
        })),
    },

    {
      name: 'is_spouse',
      label: 'Is Spouse',
      type: 'select',
      disabled: false,
      options: [
        { id: true, name: 'No' },
        { id: false, name: 'Yes' },
      ],
    },
    {
      name: 'is_guardian',
      label: 'Is Guardian',
      type: 'select',
      disabled: false,
      options: [
        { id: true, name: 'No' },
        { id: false, name: 'Yes' },
      ],
    },
    { name: 'igc_no', label: 'IGC No', type: 'text' },
    { name: 'surname', label: 'Surname', type: 'text' },
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'other_name', label: 'Other Name', type: 'text' },
    { name: 'identifier', label: 'Identifier', type: 'text' },

    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'text',
    },
    {
      name: 'email_address',
      label: 'Email Address',
      type: 'text',
    },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
    { name: 'age', label: 'Age', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    {
      name: 'birth_certificate_no',
      label: 'Birth Certificate No',
      type: 'text',
    },
    {
      name: 'supporting_document_number',
      label: 'Supporting Document Number',
      type: 'text',
    },
    {
      name: 'document_status',
      label: 'Document Status',
      type: 'select',

      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'submission_status',
      label: 'IGC Submission Status',
      type: 'select',

      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
  ];

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : openInitiate ? (
          <>
            <BaseInputCard
              fields={uploadFields}
              apiEndpoint={endpoints.createDepartment}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createDepartment}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.igcBeneficiaries}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Igc Beneficiaries List"
        currentTitle="Igc Beneficiaries List"
      />
    </div>
  );
};

export default IgcBeneficiaries;
