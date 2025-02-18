import React, { useEffect, useState, useMemo } from 'react';
import BaseInputTable from '@/components/baseComponents/BaseInputTable';
import endpoints, { apiService } from '@/components/services/setupsApi';

const AddBeneficiaries = ({
  id,
  status,
  setOnCloseWarnings,
  formData,
  activeCapName,
}) => {
  const [relationships, setRelationships] = useState([]);
  const [postalAddress, setPostalAddress] = useState([]);

  // Fetch relationships
  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const res = await apiService.get(
          endpoints.getBeneficiariesRelationShips
        );
        setRelationships(res.data.data);
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    fetchRelationships();
  }, []);

  // **Optimized filtering using useMemo (prevents infinite loop)**
  const filteredRelationships = useMemo(() => {
    return relationships.filter((relationship) => {
      const relationshipName = relationship.name.toLowerCase();

      // CAP Type Filtering (First Priority)
      if (activeCapName === 'CAP189') {
        if (
          !relationshipName.includes('wife') &&
          !relationshipName.includes('guardian')
        ) {
          return false;
        }
      } else if (activeCapName === 'CAP199') {
        if (
          !relationshipName.includes('wife') &&
          !relationshipName.includes('husband') &&
          !relationshipName.includes('guardian') &&
          !relationshipName.includes('mother') &&
          !relationshipName.includes('father')
        ) {
          return false;
        }
      } else if (['CAP196', 'DSO/RK', 'APN/PK'].includes(activeCapName)) {
        if (
          !relationshipName.includes('wife') &&
          !relationshipName.includes('husband') &&
          !relationshipName.includes('guardian')
        ) {
          return false;
        }
      }

      // Marital Status & Gender Filtering (Second Priority)
      if (formData.marital_status === 0) {
        if (
          relationshipName.includes('husband') ||
          relationshipName.includes('wife')
        ) {
          return false;
        }
      } else if (
        formData.gender === 0 &&
        relationshipName.includes('husband')
      ) {
        return false;
      } else if (formData.gender === 1 && relationshipName.includes('wife')) {
        return false;
      }

      return true;
    });
  }, [relationships, formData.marital_status, formData.gender, activeCapName]);

  const fields2 = [
    {
      value: 'relationship_id',
      label: 'Relationship',
      type: 'select',
      options: filteredRelationships.map((relationship) => ({
        id: relationship.id,
        name: relationship.name,
        gender: relationship.gender,
      })),
    },
    {
      value: 'surname',
      label: 'Surname',
      type: 'text',
    },
    {
      value: 'first_name',
      label: 'First Name',
      type: 'text',
    },
    {
      value: 'other_name',
      label: 'Other Name',
      type: 'text',
      notRequired: true,
    },
    {
      value: 'dob',
      label: 'Date of Birth',
      type: 'date',
    },
    {
      value: 'gender',
      label: 'Gender',
      type: 'select',
      hide: true,
      options: [
        { id: 0, name: 'Male' },
        { id: 1, name: 'Female' },
      ],
    },
    {
      label: 'Type Of Identification',
      value: 'identifier_type',
      type: 'select',
      options: [
        { id: 0, name: 'National ID' },
        { id: 1, name: 'Passport No' },
      ],
    },
    {
      value: 'identifier',
      label: 'National ID/Passport',
      type: 'text',
    },
    {
      value: 'email_address',
      label: 'Email Address',
      type: 'text',
    },
    {
      value: 'mobile_number',
      label: 'Mobile Number',
      type: 'phone_number',
    },
  ];

  return (
    <div className="relative">
      <div
        className="ag-theme-quartz"
        style={{
          height: '60vh',
          mt: '20px',
          overflowY: 'auto',
        }}
      >
        <BaseInputTable
          parentDob={formData.dob}
          title="Beneficiaries"
          fields={fields2}
          id={id}
          disableAll={status !== 0}
          idLabel="prospective_pensioner_id"
          getApiService={apiService.get}
          postApiService={apiService.post}
          putApiService={apiService.put}
          apiService={apiService}
          deleteEndpoint={endpoints.deleteMaintenance(id)}
          getEndpoint={endpoints.getBeneficiaries(id)}
          postEndpoint={endpoints.createBeneficiary}
          putEndpoint={endpoints.updateMaintenance}
          passProspectivePensionerId={true}
          setOnCloseWarnings={setOnCloseWarnings}
          retirementDate={formData.retirement_date}
        />
      </div>
    </div>
  );
};

export default AddBeneficiaries;
