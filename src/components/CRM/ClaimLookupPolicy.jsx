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
  TextareaAutosize,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Alert, message } from 'antd';
import DocumentHistory from './DocumentHistory';
import { ArrowBack, Close, OpenInFull } from '@mui/icons-material';
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
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    setLoading(true);
    if (!formData.searchType || !formData.searchInput) {
      message.error('Please select a filter and provide a value to search.');
      return;
    }

    const filter = {
      'filterCriterion.criterions[0].propertyName': `prospectivePensioner.${formData.searchType}`,
      'filterCriterion.criterions[0].propertyValue': formData.searchInput,
      'filterCriterion.criterions[0].criterionType': 0,
      // formData.searchInput === 'pensioner_number' ? 0 : 2,
    };
    try {
      const response = await assessApiService.get(
        assessEndpoints.getClaimsListings,
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
    } finally {
      setLoading(false);
    }
  };

  const [openComplaintDialog, setOpenComplaintDialog] = React.useState(false);
  const [comments, setComments] = React.useState('');
  const [openBaseCard, setOpenBaseCard] = React.useState(false);

  const baseCardHandlers = {
    submitClaimSuspensionRequest: () => {
      setOpenComplaintDialog(true);
    },
  };

  const handleSumbitRequest = async () => {
    if (!fetchedData?.id || !comments) {
      message.error('Please provide a valid claim and reason for suspension.');
      return;
    }

    const requestData = {
      suspendRequests: [
        {
          claim_id: fetchedData.id, // Use the fetched claim ID
          reason: comments, // Use the comments as the reason
          request_type: 0, // Assuming 0 is the request type for suspension
        },
      ],
    };

    try {
      const response = await apiService.post(
        endpoints.submitClaimSuspensionOrResumptionRequest,
        requestData
      );

      if (response.data.succeeded && response.data.messages[0]) {
        message.success(response.data.messages[0]);
        setOpenComplaintDialog(false); // Close the dialog
        setComments(''); // Clear the comments
      } else if (
        response.data.succeeded === false &&
        response.data.messages[0]
      ) {
        message.error(response.data.messages[0]);
      } else {
        message.error(
          response.data?.message || 'Failed to submit the suspension request.'
        );
      }
    } catch (error) {
      console.error('Error submitting claim suspension request:', error);
      message.error(
        error.response?.data?.message ||
          'An error occurred while submitting the suspension request. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white mt-3 px-10 py-4">
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        onClose={() => setLoading(false)}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div">
          Fetching Claim Details
          <Box component="span" sx={{ animation: 'blink 1.4s infinite' }}>
            ...
          </Box>
        </Typography>
      </Backdrop>
      <BaseCard
        openBaseCard={openClaimInquiryDialpog}
        setOpenBaseCard={setOpenClaimInquiryDialog}
        //  handlers={baseCardHandlers}
        title={fetchedData?.claim_id}
        clickedItem={fetchedData}
        isUserComponent={false}
        retireeId={fetchedData?.prospectivePensionerId}
        isClaim={true}
        handlers={baseCardHandlers}
      >
        <Dialog
          open={openComplaintDialog}
          onClose={() => setOpenComplaintDialog(false)}
          maxWidth="sm"
          fullWidth
          //add padding to the dialog
          PaperProps={{
            style: {
              padding: '32px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <div className="flex items-center mb-5">
            <p className="text-primary relative font-semibold text-lg ">
              Submit Claim Suspension Request
            </p>
            <IconButton
              sx={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                backgroundColor: 'white',

                borderRadius: '50%',
                padding: '3px',
                marginRight: '10px',
                color: '#006990',
              }}
              onClick={() => setOpenComplaintDialog(false)}
            >
              <Close sx={{ color: '#006990' }} />
            </IconButton>
          </div>

          <div>
            <label
              htmlFor="comments"
              className=" text-xs font-medium text-gray-700"
            >
              Add Comments
            </label>
            <TextareaAutosize
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              error={errors.status}
              minRows={3}
              style={{
                fontSize: '13px',
                width: '100%',
                padding: '9px',
                borderRadius: '4px',
                border: '1px solid gray',
              }}
            />
          </div>
          <div className="mt-5">
            <Button
              onClick={handleSumbitRequest}
              variant="contained"
              fullWidth
              color="primary"
            >
              Submit Request
            </Button>
          </div>
        </Dialog>
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
