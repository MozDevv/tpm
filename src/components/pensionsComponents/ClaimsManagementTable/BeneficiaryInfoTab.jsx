import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseInputCard from '@/components/baseComponents/BaseInputCard copy';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import endpoints, { apiService } from '@/components/services/setupsApi';
import React from 'react';

function BeneficiaryInfoTab({ clickedItem }) {
  const { data: relationships } = useFetchAsync(
    endpoints.getRelationships,
    apiService
  );
  const fields = [
    {
      name: 'relationship_id',
      label: 'Relationship',
      type: 'select',
      disabled: true,
      options:
        relationships &&
        relationships?.map((relationship) => ({
          id: relationship.id,
          name: relationship.name,
        })),
    },
    { name: 'surname', label: 'Surname', type: 'text', disabled: true },
    { name: 'first_name', label: 'First Name', type: 'text', disabled: true },
    { name: 'other_name', label: 'Other Name', type: 'text', disabled: true },
    // { name: 'identifier', label: 'Identifier', type: 'text', disabled: true },

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
    // {
    //   name: 'birth_certificate_no',
    //   label: 'Birth Certificate No',
    //   type: 'text',
    //   disabled: true,
    // },
    // {
    //   name: 'supporting_document_number',
    //   label: 'Supporting Document Number',
    //   type: 'text',
    //   disabled: true,
    // },
    // {
    //   name: 'document_status',
    //   label: 'Document Status',
    //   type: 'select',
    //   disabled: true,
    //   options: [
    //     { id: 0, name: 'Open' },
    //     { id: 1, name: 'Pending' },
    //     { id: 2, name: 'Approved' },
    //     { id: 3, name: 'Rejected' },
    //   ],
    // },
    // {
    //   name: 'submission_status',
    //   label: 'IGC Submission Status',
    //   type: 'select',
    //   disabled: true,
    //   options: [
    //     { id: 0, name: 'Open' },
    //     { id: 1, name: 'Pending' },
    //     { id: 2, name: 'Approved' },
    //     { id: 3, name: 'Rejected' },
    //   ],
    // },
    {
      name: 'created_date',
      label: 'Created Date',
      type: 'date',
      disabled: true,
    },
  ];
  return (
    <BaseCollapse name="Beneficiary Details" defaultActiveKey="1">
      <BaseInputCard
        fields={fields}
        //   apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        useRequestBody={true}
      />
    </BaseCollapse>
  );
}

export default BeneficiaryInfoTab;
