'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseCollapse from '../baseComponents/BaseCollapse';
import { MenuItem, TextField, Button, Typography, Box } from '@mui/material';
import { Alert, message } from 'antd';

const ClaimInquiry = () => {
  const [formData, setFormData] = React.useState({
    searchType: '',
    searchInput: '',
  });

  const handleSearch = () => {
    if (!formData.searchType || !formData.searchInput) {
      message.error('Please select a filter and provide a value to search.');
      return;
    }
    try {
      const response = apiService.post(endpoints.getClaimInquiry, {
        [formData.searchType]: formData.searchInput,
      });
      console.log('Response:', response.data);
      message.success('Search completed successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white mt-8 px-10 py-10">
      {/* Title and Subtitle */}

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
