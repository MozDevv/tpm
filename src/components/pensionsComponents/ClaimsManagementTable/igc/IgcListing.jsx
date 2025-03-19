'use client';
import React, { use, useEffect, useState } from 'react';
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
import { PORTAL_BASE_URL } from '@/utils/constants';

import preClaimsEndpoints from '@/components/services/preclaimsApi';
import { apiService as preApiservice } from '@/components/services/preclaimsApi';
import AssessmentCard from '@/components/financeComponents/payments/PensionerDetailsTabs';
import IgcRevisedInputCard from './IgcRevisedInputCard';
import { message } from 'antd';
import { useIgcIdStore } from '@/zustand/store';

const IgcListing = () => {
  const statusIcons = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
    4: { icon: Cancel, name: 'Cancelled', color: '#d32f2f' }, // Red
  };

  const pensionStatusMap = {
    0: { name: 'Dependant Pension', color: '#1976d2' }, // Blue
    1: { name: 'Killed On Duty', color: '#fbc02d' }, // Yellow
    2: { name: 'Injury or Disability Pension', color: '#2e7d32' }, // Green
    3: { name: 'Revised Disability', color: '#d32f2f' }, // Red
    4: { name: 'Revised Cases Erroneous Deductions', color: '#8e24aa' }, // Purple
    5: { name: 'Revised Cases Court Order', color: '#ff7043' }, // Orange
    6: { name: 'Revised Cases Salary Change', color: '#0288d1' }, // Light Blue
    7: { name: 'Revised Cases Erroneous Awards', color: '#6d4c41' }, // Dark Purple
    8: { name: 'Add Beneficiary Alive', color: '#c2185b' }, // Pink
    9: { name: 'Add Beneficiary Deceased', color: '#7b1fa2' }, // Brown
    10: { name: 'Change of Pay Point', color: '#009688' }, // Teal
    11: { name: 'Revised Case', color: '#0288d1' }, // Deep Orange
  };

  const columnDefs = [
    {
      field: 'document_number',
      headerName: 'Document No',
      headerClass: 'prefix-header',
      pinned: 'left',
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
      width: 160,
    },
    {
      field: 'retireeName',
      headerName: 'Retiree Name',
      filter: true,
      width: 200,
      valueGetter: (params) => {
        const firstName = params.data.prospective_pensioner?.first_name || '';
        const surname = params.data.prospective_pensioner?.surname || '';
        return `${firstName} ${surname}`;
      },
    },
    {
      field: 'personal_number',
      headerName: 'Personal Number',
      filter: true,
      width: 200,
      valueGetter: (params) => {
        return params.data.prospective_pensioner?.personal_number;
      },
    },
    {
      field: 'igc_submission_status',
      headerName: 'Submission Status',
      filter: true,
      width: 200,
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
      field: 'igc_type',
      headerName: 'IGC Type',
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const status = pensionStatusMap[params.value];
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
            {status.name}
          </Button>
        );
      },
    },
    {
      field: 'stopped',
      headerName: 'Stopped',
      filter: true,
    },
  ];

  const transformData = (data) => {
    return data.map((item) => ({
      ...item,
      ...item?.json_payload,
    }));
  };
  const [openInitiate, setOpenInitiate] = useState(false);
  const [openChangePaypoint, setOpenChangePaypoint] = useState(false);

  const [initiateRevisedCase, setInitiateRevisedCase] = useState(false);
  const handlers = {
    initiateDependentEnrollment: () => {
      setOpenInitiate(true);
      setOpenBaseCard(true);
    },

    initiateChangeOfPayPoint: () => {
      setOpenChangePaypoint(true);
      setOpenBaseCard(true);
    },
    initiateRevisedCase: () => {
      setInitiateRevisedCase(true);
      setOpenBaseCard(true);
    },
    sendIGCForApproval: () => handleSendForApproval(),
  };
  const baseCardHandlers = {};
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(1);

  //loop the selectedRows
  const handleSendForApproval = async () => {
    const promises = selectedRows.map((item) => {
      return apiService.post(endpoints.sendIgcForApproval, {
        id: item.id,
      });
    });

    try {
      const res = await Promise.all(promises);
      if (res.length > 0) {
        message.success('IGC sent for approval successfully');
        setSelectedRows([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshData((prev) => prev + 1);
    }
  };

  const title = clickedItem
    ? clickedItem?.document_number
    : openInitiate
    ? 'Initiate Dependent Enrollment'
    : openChangePaypoint
    ? 'Initiate Change of Paypoint'
    : 'Create New Beneficiary';

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
          id: item?.prospectivePensioner?.id,
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

  const [formData, setFormData] = useState({});
  const [retireeBeneficiaries, setRetireeBeneficiaries] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const fetchRetireesBeneficiaries = async (id) => {
    try {
      const res = await assessApiService.get(
        `${PORTAL_BASE_URL}/portal/getBeneficiaries/${id}`
      );
      setGuardians([...res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks, {
        'paging.pageSize': 1000,
      });
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
        branches: bank.branches,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );
      console.log('banksData', banksData);
      console.log('branchesData', branchesData);

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log('Error fetching banks and branches:', error);
    }
  };
  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  useEffect(() => {
    if (formData?.prospective_pensioner_id) {
      fetchRetireesBeneficiaries(formData.prospective_pensioner_id);
    }
  }, [formData?.prospective_pensioner_id]);

  const uploadFields = [
    {
      name: 'prospective_pensioner_id',
      label: 'Retiree',
      type: 'select',
      options: claims && claims,
      table: true,
    },
    {
      name: 'relationship_id',
      label: 'Relationship',
      type: 'autocomplete',
      options:
        beneficiaries &&
        beneficiaries?.map((item) => ({
          id: item.id,
          name: item.name,
        })),
    },
    { name: 'reason', label: 'Reason', type: 'text' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },

    {
      name: 'guardianId',
      label: 'Guardian',
      type: 'autocomplete',
      options:
        guardians &&
        guardians.length > 0 &&
        guardians.map((guardian) => ({
          id: guardian.id,
          name: guardian.display_name,
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

    { name: 'surname', label: 'Surname', type: 'text' },
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'other_name', label: 'Other Name', type: 'text' },
    {
      label: 'Type Of Identification',
      name: 'identifier_type',
      type: 'select',
      options: [
        { id: 0, name: 'National ID' },
        { id: 1, name: 'Passport No' },
      ],
    },
    { name: 'identifier', label: 'Identifier', type: 'text' },

    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'phone_number',
    },
    {
      name: 'email_address',
      label: 'Email Address',
      type: 'text',
    },

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
  ];

  const filteredFields = (formData) => {
    const age = formData?.dob
      ? new Date().getFullYear() - new Date(formData.dob).getFullYear()
      : null;

    if (age !== null && age < 18) {
      return uploadFields.filter((field) =>
        [
          'prospective_pensioner_id',
          'relationship',
          'reason',
          'dob',
          'guardianId',
          'surname',
          'first_name',
          'other_name',
          'birth_certificate_no',
          'guardianId',
          'supporting_document_number',
        ].includes(field.name)
      );
    } else if (age !== null && age >= 18) {
      return uploadFields.filter(
        (field) => !['guardianId', 'birth_certificate_no'].includes(field.name)
      );
    } else {
      return uploadFields.slice(0, 4); // Show the first 4 fields by default
    }
  };

  //cont initiate Change of Paypoint

  const paypointFields = [
    {
      name: 'prospective_pensioner_id',
      label: 'Retiree',
      type: 'autocomplete',
      options: claims && claims,
      required: true,
    },
    {
      name: 'bankId',
      label: 'Bank',
      type: 'autocomplete',
      required: true,
      options: banks.map((bank) => ({
        id: bank.id,
        name: bank.name,
      })),
    },
    {
      name: 'bank_branch_id',
      label: 'Branch',
      type: 'autocomplete',
      required: true,
      options: branches
        .filter((branch) => branch.bankId === selectedBank)
        .map((branch) => ({
          id: branch.id,
          name: branch.name,
          bankId: branch.bankId,
        })),
    },
    {
      name: 'account_number',
      label: 'Account Number',
      type: 'text',
      required: true,
    },
    {
      name: 'account_name',
      label: 'Account Name',
      type: 'text',
      required: true,
    },

    {
      name: 'reason',
      label: 'Reason',
      type: 'text',
      required: true,
    },
  ];

  const [retiree, setRetiree] = React.useState(null);

  const fetchRetiree = async (prospectivePensionerId) => {
    try {
      const res = await preApiservice.get(
        preClaimsEndpoints.getProspectivePensioner(prospectivePensionerId)
      );
      if (res.status === 200) {
        setRetiree(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (clickedItem) {
      fetchRetiree(clickedItem?.prospective_pensioner_id);
    }
  }, [clickedItem]);

  const generateFieldsFromJsonPayload = (jsonPayload) => {
    const excludedFields = [
      'id',
      'prospective_pensioner_id',
      'beneficiary_id',
      'stage_id',
      'igc_type_id',
      'parent_id',
      'guardian_id',
    ];

    return Object.keys(jsonPayload)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => {
        const value = jsonPayload[key];
        let type = 'text';

        if (typeof value === 'boolean') {
          type = 'select';
        } else if (typeof value === 'string' && value.includes('@')) {
          type = 'email';
        } else if (
          typeof value === 'string' &&
          value.match(/^\d{4}-\d{2}-\d{2}T/)
        ) {
          type = 'date';
        } else if (
          typeof value === 'string' &&
          value.match(/^\+\d{1,3}\s?\(?\d{1,4}\)?[\d\s-]{7,}$/)
        ) {
          type = 'phone_number';
        }

        return {
          name: key,
          label: key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          type,
          value,
          disabled: true,
        };
      });
  };

  useEffect(() => {
    if (!openBaseCard) {
      setOpenInitiate(false);
      setOpenChangePaypoint(false);
      setClickedItem(null);
      setInitiateRevisedCase(false);
    }
  }, [openBaseCard]);

  const { igcId, setIgcId } = useIgcIdStore();

  useEffect(() => {
    if (clickedItem) {
      setIgcId(clickedItem.id);
    }
  }, [clickedItem]);
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
        {clickedItem && clickedItem?.igc_type === 11 ? (
          <AssessmentCard
            claim={
              clickedItem
                ? [
                    {
                      ...clickedItem,
                      prospectivePensionerId:
                        clickedItem?.prospective_pensioner_id,
                    },
                  ]
                : null
            }
            igcId={clickedItem?.id}
            clickedItem={retiree}
            claimId={null}
            setOpenBaseCard={setOpenBaseCard}
            isIgc={true}
            childTitle="IGC Details"
            jsonPayload={clickedItem?.json_payload}
          />
        ) : clickedItem && clickedItem?.igc_type !== 11 ? (
          <>
            {' '}
            <AssessmentCard
              claim={
                clickedItem
                  ? [
                      {
                        ...clickedItem,
                        prospectivePensionerId:
                          clickedItem?.prospective_pensioner_id,
                      },
                    ]
                  : null
              }
              clickedItem={retiree}
              claimId={null}
              setOpenBaseCard={setOpenBaseCard}
              isIgc={true}
              childTitle="IGC Details"
            >
              <div className="">
                <BaseInputCard
                  fields={generateFieldsFromJsonPayload(
                    clickedItem?.json_payload
                  )}
                  apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
                  postApiFunction={apiService.post}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                  setOpenBaseCard={setOpenBaseCard}
                />
              </div>
            </AssessmentCard>
          </>
        ) : openInitiate ? (
          <>
            <BaseInputCard
              fields={filteredFields(formData)}
              apiEndpoint={endpoints.initiateIgcBeneficiary}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              setOpenBaseCard={setOpenBaseCard}
              setInputData={setFormData}
              useRequestBody={true}
            />
          </>
        ) : openChangePaypoint ? (
          <BaseInputCard
            fields={paypointFields}
            apiEndpoint={endpoints.initiateChangeOfPaypoint}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            setSelectedBank={setSelectedBank}
          />
        ) : initiateRevisedCase ? (
          <IgcRevisedInputCard setOpenBaseCard={setOpenBaseCard} />
        ) : (
          <></>
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
        breadcrumbTitle="Igc List"
        currentTitle="Igc List"
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        refreshData={refreshData}
      />
    </div>
  );
};

export default IgcListing;
