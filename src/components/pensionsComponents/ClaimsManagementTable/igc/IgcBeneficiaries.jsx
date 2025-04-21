'use client';
import React from 'react';
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';
import { Button } from '@mui/material';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { message } from 'antd';

const IgcBeneficiaries = () => {
  const statusIcons = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };
  /**{
    UNNOTIFIED,
    NOTIFIED,
    SUBMITTED,
    PENDING_CLAIM_CREATION,
    CLAIM_CREATED,
} */
  const notificationStatusMap = {
    0: { name: 'UNNOTIFIED', color: '#e74c3c' }, // Light Red

    1: { name: 'NOTIFIED', color: '#3498db' }, // Light Blue
    2: { name: 'SUBMITTED', color: '#970FF2' }, // Amethyst
    // 4: { name: 'IN REVIEW', color: '#970FF2' }, // Carrot Orange
    3: { name: 'PENDING APPROVAL', color: '#1abc9c' }, // Light Turquoise
    4: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
    // 7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
  };

  const columnDefs = [
    // {
    //   field: 'igc_no',
    //   headerName: 'IGC No',
    //   headerClass: 'prefix-header',
    //   flex: 1,

    // },
    {
      field: 'relationship',
      headerName: 'Relationship',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      pinned: 'left',

      cellRenderer: (params) => {
        return <p className=" text-primary font-semibold">{params.value}</p>;
      },
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      filter: true,
      width: 180,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      filter: true,
      width: 180,
    },
    {
      headerName: 'Preclaim Status',
      field: 'status',
      width: 180,
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

    // {
    //   field: 'name',
    //   headerName: 'Name',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   cellRenderer: (params) => {
    //     const { surname, first_name, other_name } = params.data;
    //     return (
    //       <p className="">
    //         {surname || ''} {first_name || ''} {other_name || ''}
    //       </p>
    //     );
    //   },
    // },
    {
      field: 'identifier',
      headerName: 'Identifier',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
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
      width: 200,

      valueFormatter: (params) => parseDate(params.value),
    },
    {
      field: 'age',
      headerName: 'Age',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,
    },

    //   {
    //     field: 'address',
    //     headerName: 'Address',
    //     headerClass: 'prefix-header',
    //     filter: true,
    //   },
    //   {
    //     field: 'birth_certificate_no',
    //     headerName: 'Birth Certificate No',
    //     headerClass: 'prefix-header',
    //     filter: true,
    //   },
    //   {
    //     field: 'supporting_document_number',
    //     headerName: 'Supporting Document Number',
    //     headerClass: 'prefix-header',
    //     filter: true,
    //   },
    // ];
  ];

  const transformData = (data) => {
    return data.map((item) => ({
      id: item?.id,
      igc_no: item?.igcEnrolment?.no ?? 'N/A',
      surname: item?.beneficiary?.surname ?? 'N/A',
      first_name: item?.beneficiary?.first_name ?? 'N/A',
      other_name: item?.beneficiary?.other_name ?? 'N/A',
      identifier: item?.beneficiary?.identifier ?? 'N/A',
      relationship: item?.beneficiary?.relationship?.name ?? 'N/A',
      mobile_number: item?.beneficiary?.mobile_number ?? 'N/A',
      email_address: item?.beneficiary?.email_address ?? 'N/A',
      dob: item?.beneficiary?.dob ?? 'N/A',
      age: item?.beneficiary?.age ?? 'N/A',
      address: item?.beneficiary?.address ?? 'N/A',
      birth_certificate_no: item?.beneficiary?.birth_certificate_no ?? 'N/A',
      supporting_document_number:
        item?.igcEnrolment?.supporting_document_number ?? 'N/A',
      document_status: item?.igcEnrolment?.doumet_status ?? 'N/A',
      submission_status: item?.igcEnrolment?.iGCSubmissionStatuses ?? 'N/A',
      created_date: item?.igcEnrolment?.created_date ?? 'N/A',

      principal_pensioner_id_card_number:
        item?.igcEnrolment?.principal_pensioner_id_card_number ?? 'N/A',
      status: item?.status ?? 'N/A',
      /**  "principal_pensioner_id_card_number": "67398299",
    "no": "IGDE000029",
    "supporting_document_number": "1475582825",
    "doumet_status": 2,
    "iGCSubmissionStatuses": 2, */
    }));
  };
  const [clickedItem, setClickedItem] = React.useState(null);

  const handlers = {};
  const baseCardHandlers = {
    ...(clickedItem && clickedItem.status === 2
      ? {
          notifyDependant: async () => {
            const payload = {
              igcBeneficiaryTrackId: clickedItem?.id, // Assuming `clickedItem` contains the ID
            };

            console.log('Payload for notifying beneficiary:', payload);
            try {
              const res = await apiService.post(
                endpoints.notifyBeneficiary,
                payload
              );

              if (res.status === 200 && res.data?.succeeded) {
                message.success(res.data.messages[0]);
                setOpenBaseCard(false); // Close the BaseCard
              } else {
                message.error(
                  'Failed to notify the beneficiary. Please try again.'
                );
              }
            } catch (error) {
              console.error('Error notifying beneficiary:', error);
              message.error(
                error.response?.data?.message ||
                  'An unexpected error occurred. Please try again.'
              );
            }
          },
        }
      : {}),
  };
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const title = clickedItem ? 'Beneficiary' : 'Create New Beneficiary';

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
  const igcEnrollmentFields = [
    { name: 'igc_no', label: 'IGC No', type: 'text', disabled: true },
    {
      name: 'principal_pensioner_id_card_number',
      label: 'Principal Pensioner ID Card Number',
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
      label: 'IGC Submission Statuses',
      type: 'select',
      disabled: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
  ];
  /** */
  const tabPanes = [
    {
      key: '1',
      title: 'Beneficiary Details',
      content: (
        <div className="">
          <BaseCollapse name="Enrollment Details" defaultActiveKey="1">
            <BaseInputCard
              fields={igcEnrollmentFields}
              //   apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
          </BaseCollapse>
          <BaseCollapse name="Beneficiary Details" defaultActiveKey="1">
            <BaseInputCard
              fields={fields}
              //   apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
              postApiFunction={apiService.post}
              clickedItem={clickedItem}
              useRequestBody={true}
              setOpenBaseCard={setOpenBaseCard}
            />
          </BaseCollapse>
        </div>
      ),
    },
    {
      key: '2',
      title: 'Enrollment Detail',
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
          <BaseTabs tabPanes={tabPanes} defaultActiveKey="1" />
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
        fetchApiEndpoint={endpoints.igcBeneficiariesTrack}
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
