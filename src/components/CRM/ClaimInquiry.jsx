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

const ClaimInquiry = () => {
  const [formData, setFormData] = React.useState({
    searchType: '',
    searchInput: '',
  });
  const [openClaimInquiryDialpog, setOpenClaimInquiryDialog] =
    React.useState(false);
  const [fetchedData, setFetchedData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleSearch = async () => {
    if (!formData.searchType || !formData.searchInput) {
      message.error('Please select a filter and provide a value to search.');
      return;
    }

    try {
      const response = await apiService.post(endpoints.getClaimInquiry, {
        [formData.searchType]: formData.searchInput,
      });

      // Check if the response contains valid data
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setFetchedData(response.data); // Set the fetched data
        setOpenClaimInquiryDialog(true); // Open the dialog
        message.success('Search completed successfully!');
      } else {
        // Handle case where no data is found
        setFetchedData([]); // Clear any previous data
        message.error(
          'Pensioner not found. Please try again with valid details.'
        );
      }
    } catch (error) {
      console.error('Error fetching claim inquiry:', error);
      message.error(
        'An error occurred while fetching the claim inquiry. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white mt-8 px-10 py-10">
      {/* Title and Subtitle */}
      <Dialog
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '250px',
            minWidth: '800px',
          },
        }}
        open={openClaimInquiryDialpog}
        onClose={() => setOpenClaimInquiryDialog(false)} // Fixed function name
        aria-labelledby="alert-dialog-title" // Removed stray backtick
      >
        <div className="px-8">
          <div className="flex items-center px-2 justify-between w-full sticky top-0 z-[99999999] bg-white pt-12">
            <div className="flex items-center gap-1 ">
              <IconButton
                sx={{
                  border: '1px solid #006990',
                  borderRadius: '50%',
                  padding: '3px',
                  marginRight: '10px',
                  color: '#006990',
                }}
                onClick={() => setOpenClaimInquiryDialog(false)}
              >
                <ArrowBack sx={{ color: '#006990' }} />
              </IconButton>
              <p className="text-lg text-primary font-semibold">
                Claim Inquiry Details
              </p>
            </div>
            <div className="flex items-center">
              <IconButton>
                <Tooltip>
                  <OpenInFull
                    color="primary"
                    sx={{
                      fontSize: '18px',
                      mt: '4px',
                    }}
                  />
                </Tooltip>
              </IconButton>
            </div>
          </div>
          <DocumentHistory
            setOpenClaimInquiryDialog={setOpenClaimInquiryDialog}
            data={fetchedData}
          />
        </div>
      </Dialog>

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
              <MenuItem value="pensionerNumber">Pensioner Number</MenuItem>
              <MenuItem value="personalNumber">Personal Number</MenuItem>
              <MenuItem value="pensionerNationalId">
                Pensioner National ID
              </MenuItem>
              <MenuItem value="dependantNationalId">
                Dependant National ID
              </MenuItem>
              <MenuItem value="dependantNumber">Dependant Number</MenuItem>
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
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    searchInput: event.target.value,
                  }))
                }
                variant="outlined"
                size="small"
                fullWidth
                placeholder={`Enter ${formData.searchType.replace(
                  /([A-Z])/g,
                  ' $1'
                )}`}
              />
            </div>
          )}

          {/* Search Button */}
          <div className="mt-10">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimInquiry;
