'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseCollapse from '../baseComponents/BaseCollapse';
import {
  MenuItem,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Alert, message } from 'antd';
import DocumentHistory from './DocumentHistory';
import { ArrowBack, OpenInFull } from '@mui/icons-material';
import BaseExpandCard from '../baseComponents/BaseExpandCard';
import assessEndpoints, { assessApiService } from '../services/assessmentApi';
import AssessmentCard from '../financeComponents/payments/PensionerDetailsTabs';

const ClaimLookupPolicy = () => {
  const [formData, setFormData] = React.useState({
    searchType: '',
    searchInput: '',
  });
  const [errors, setErrors] = React.useState({});

  const validateInput = () => {
    const newErrors = {};
    if (formData.searchType === 'national_id' && formData.searchInput) {
      if (!/^\d{6,10}$/.test(formData.searchInput)) {
        newErrors.searchInput =
          'National ID must be a valid number (6-10 digits)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const [openClaimInquiryDialpog, setOpenClaimInquiryDialog] =
    React.useState(false);
  const [fetchedData, setFetchedData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleSearch = async () => {
    if (!formData.searchType || !formData.searchInput) {
      message.error('Please select a filter and provide a value to search.');
      return;
    }

    const filter = {
      'filterCriterion.criterions[0].propertyName': `prospectivePensioner.${formData.searchType}`,
      'filterCriterion.criterions[0].propertyValue': formData.searchInput,
      'filterCriterion.criterions[0].criterionType': 1,
      // formData.searchInput === 'pensioner_number' ? 0 : 2,
    };
    try {
      const response = await assessApiService.get(
        assessEndpoints.getAssessmentClaims,
        { ...filter }
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        setFetchedData(response.data.data[0]);
        setOpenClaimInquiryDialog(true);
        message.success('Search completed successfully!');
      } else {
        setFetchedData([]);
        message.error('No claims found for the provided search criteria.');
      }
    } catch (error) {
      console.error('Error fetching claim inquiry:', error);
      message.error(
        'An error occurred while fetching the claim inquiry. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white mt-3 px-10 py-4">
      {/* Title and Subtitle */}
      <BaseCard
        openBaseCard={openClaimInquiryDialpog}
        setOpenBaseCard={setOpenClaimInquiryDialog}
        //  handlers={baseCardHandlers}
        title={fetchedData?.claim_id}
        clickedItem={fetchedData}
        isUserComponent={false}
        retireeId={fetchedData?.prospectivePensionerId}
        isClaim={true}
      >
        <AssessmentCard
          claim={
            fetchedData
              ? {
                  ...fetchedData,
                  id_claim: fetchedData?.id,
                  prospectivePensionerId: fetchedData?.prospective_pensioner_id,
                }
              : null
          }
          isPayroll={true}
          clickedItem={
            fetchedData?.prospectivePensioner
              ? {
                  ...fetchedData.prospectivePensioner,
                  id_claim: fetchedData.id,
                }
              : null
          }
          // clickedIgc={clickedItem}

          claimId={fetchedData?.id}
          setOpenBaseCard={setOpenClaimInquiryDialog}
        />
      </BaseCard>

      <p className="italic text-primary font-semibold text-[13px] mb-1 flex items-center gap-1">
        Select a filter and provide the required details to search for a claim.
      </p>

      <div className="mt-5">
        <Alert
          message="Ensure the information provided is accurate to get
          the correct results."
          type="info"
          showIcon
        />
      </div>

      <div className="py-3">
        <div className=" py-3">
          {/* Search Type Dropdown */}
          <div className="mb-4">
            <label className="text-[14px] mb-2 font-semibold text-primary">
              Search Claim By:
            </label>
            <TextField
              select
              value={formData.searchType || ''}
              onChange={(event) =>
                setFormData((prevData) => ({
                  ...prevData,
                  searchType: event.target.value,
                  searchInput: '', // Reset search input when type changes
                }))
              }
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="pensioner_number">Pensioner Number</MenuItem>
              <MenuItem value="personal_number">Personal Number</MenuItem>
              <MenuItem value="national_id">Pensioner National ID</MenuItem>
            </TextField>
          </div>
          {/* Input Field for Search */}
          {formData.searchType && (
            <div className="mb-4 mt-5">
              <label className="text-[14px] mb-2 font-semibold text-primary">
                Enter {formData.searchType.replace(/([A-Z])/g, ' $1')}:
              </label>
              <TextField
                value={formData.searchInput || ''}
                onChange={(event) => {
                  const value = event.target.value;
                  const searchType = formData.searchType; // Use the current searchType directly

                  setFormData((prevData) => ({
                    ...prevData,
                    searchInput: value,
                  }));

                  // Validate input dynamically based on searchType
                  if (searchType === 'national_id') {
                    if (!/^\d{6,10}$/.test(value)) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        searchInput:
                          'National ID must be a valid number (6-10 digits)',
                      }));
                    } else {
                      setErrors((prevErrors) => {
                        const { searchInput, ...rest } = prevErrors; // Remove the error if valid
                        return rest;
                      });
                    }
                  } else if (searchType === 'personal_number') {
                    if (!/^\d+$/.test(value)) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        searchInput:
                          'Personal Number must contain only numeric values',
                      }));
                    } else {
                      setErrors((prevErrors) => {
                        const { searchInput, ...rest } = prevErrors; // Remove the error if valid
                        return rest;
                      });
                    }
                  }
                }}
                variant="outlined"
                size="small"
                fullWidth
                placeholder={`Enter ${formData.searchType.replace(
                  /([A-Z])/g,
                  ' $1'
                )}`}
                error={!!errors.searchInput} // Highlight the field if there's an error
                helperText={errors.searchInput} // Display the error message
              />
            </div>
          )}

          <div className="mt-10">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
              //disable if error
              disabled={
                !formData.searchType ||
                !formData.searchInput ||
                Object.keys(errors).length > 0
              }
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimLookupPolicy;
