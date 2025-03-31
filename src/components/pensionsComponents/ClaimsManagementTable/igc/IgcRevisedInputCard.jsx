import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import claimsEndpoints from '@/components/services/claimsApi';
import endpoints, { apiService } from '@/components/services/setupsApi';
import React, { useEffect, useState } from 'react';
import { mapRowData } from '../ClaimsTable';
import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Popper,
  TextField,
} from '@mui/material';
import { Alert, message } from 'antd';
import { toProperCase } from '@/utils/numberFormatters';
import { BASE_CORE_API } from '@/utils/constants';

function IgcRevisedInputCard({ setOpenBaseCard, claims }) {
  const { data: fieldsAndSections } = useFetchAsync(
    endpoints.getBasicFields,
    apiService
  );

  // api/claims/SearchClaims?search_input=13&claim_id=false&national_id=true&personal_number=false

  const [formData, setFormData] = useState({
    searchType: '', // national_id, personal_number, or claim_id
    searchInput: '',
    basicDetailFields: {},
    sectionsEnabled: {},
  });

  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTypeChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      searchType: event.target.value,
      searchInput: '', // Reset search input when type changes
    }));
  };
  const handleSearchInputChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      searchInput: event.target.value,
    }));
  };

  const handleSearchBlur = async () => {
    if (!formData.searchType || !formData.searchInput) {
      setErrors({ searchInput: 'Search input is required' });
      return;
    }

    const queryParams = {
      search_input: formData.searchInput,
      claim_id: formData.searchType === 'claim_id',
      national_id: formData.searchType === 'national_id',
      personal_number: formData.searchType === 'personal_number',
    };

    try {
      const response = await apiService.get(`/api/claims/SearchClaims`, {
        params: queryParams,
      });
      if (response.status === 200) {
        setSearchResults(response.data || []);
        message.success('Search completed successfully');
      } else {
        message.error('No results found');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while searching');
    }
  };

  const handleSectionChange = (section) => {
    setFormData((prevData) => ({
      ...prevData,
      sectionsEnabled: {
        ...prevData.sectionsEnabled,
        [section]: !prevData.sectionsEnabled[section],
      },
    }));
  };

  const handleFieldChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      basicDetailFields: {
        ...prevData.basicDetailFields,
        [field]: !prevData.basicDetailFields[field],
      },
    }));
  };
  const formatFieldName = (field) => {
    return field
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = async () => {
    let errors = {};
    if (!formData.claimId) {
      errors.claimId = 'Claim ID is required';
    }
    setErrors(errors);

    const sectionsEnabledIndexes = Object.keys(formData.sectionsEnabled)
      .filter((key) => formData.sectionsEnabled[key])
      .map((key) => fieldsAndSections.sections.indexOf(key));

    const formattedData = {
      basicDetailFields: Object.keys(formData.basicDetailFields),
      sectionsEnabled: sectionsEnabledIndexes,
      claim_id: formData.claimId,
    };

    console.log('formattedData', formattedData);

    try {
      const res = await apiService.post(
        endpoints.createRevisedClaim,
        formattedData
      );
      if (res.status === 200 && res.data.succeeded) {
        message.success('Igc Revised Case created successfully');
        setOpenBaseCard(false);
      } else if (
        res.status === 200 &&
        !res.data.succeeded &&
        Array.isArray(res?.data?.messages)
      ) {
        message.error(res.data.messages[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mr-5">
        <div className="absolute">
          {errors && (
            <div className="mr-4">
              {Object.values(errors).map((error, index) => (
                <Alert key={index} message={error} type="error" showIcon />
              ))}
            </div>
          )}
        </div>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {/* <BaseCollapse nam */}
      <BaseCollapse name="Claim">
        <div className=" py-3">
          <div className="px-5 py-3">
            {/* Search Type Dropdown */}
            <div className="">
              <label className="text-[14px] mb-2 font-semibold text-primary ">
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
                <MenuItem value="national_id">National ID</MenuItem>
                <MenuItem value="personal_number">Personal Number</MenuItem>
                <MenuItem value="claim_id">Claim Number</MenuItem>
              </TextField>
            </div>

            {/* Search Input Field */}
            {formData.searchType && (
              <div className="mt-5">
                <label className="text-[14px] mb-2 font-semibold text-primary ">
                  {toProperCase(
                    formData.searchType.replace('_', ' ').toUpperCase()
                  )}
                  :
                </label>
                <TextField
                  value={formData.searchInput || ''}
                  onChange={(event) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      searchInput: event.target.value,
                    }))
                  }
                  onBlur={async () => {
                    if (!formData.searchInput) {
                      setErrors({ searchInput: 'Search input is required' });
                      return;
                    }

                    // Manually construct the query string
                    const queryString = `search_input=${
                      formData.searchInput
                    }&claim_id=${
                      formData.searchType === 'claim_id'
                    }&national_id=${
                      formData.searchType === 'national_id'
                    }&personal_number=${
                      formData.searchType === 'personal_number'
                    }`;

                    try {
                      const response = await apiService.get(
                        `${BASE_CORE_API}api/claims/SearchClaims?${queryString}&paging.pageSize=100000`
                      );
                      if (response.status === 200) {
                        if (response.data.data.length === 0) {
                          message.error('No results found');
                          return;
                        }
                        setSearchResults(response.data.data || []);
                        message.success('Search completed successfully');
                      } else {
                        message.error('No results found');
                      }
                    } catch (error) {
                      console.error(error);
                      message.error('An error occurred while searching');
                    }
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                  className="mt-4"
                  error={!!errors.searchInput}
                  helperText={errors.searchInput}
                />
              </div>
            )}
          </div>
          {searchResults && searchResults.length > 0 && (
            <div className="mt-2 px-4">
              <label className="text-[14px] mb-2 font-semibold text-primary ">
                Select Claim
              </label>
              <Autocomplete
                options={searchResults || []}
                getOptionLabel={(option) => `${option.claim_id}`}
                onChange={(event, newValue) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    claimId: newValue?.id,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="claimId"
                    error={!!errors.claimId}
                    helperText={errors.claimId}
                  />
                )}
                value={
                  searchResults.find(
                    (option) => option.id === formData.claimId
                  ) || null
                }
                renderOption={(props, option, { selected }) => (
                  <div>
                    <li
                      {...props}
                      style={{
                        border: 'none',
                        boxShadow: 'none',
                        backgroundColor: selected ? '#B2E9ED' : 'white',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          pr: '40px',
                          display: 'flex',
                          justifyContent: 'space-between', // Changed to space-around for even spacing
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 3,
                            justifyContent: 'space-between', // Ensures even spacing between items
                            width: '100%', // Ensures the inner box spans the full width
                          }}
                        >
                          <p
                            className="text-primary font-normal text-[12px] items-start"
                            style={{ alignSelf: 'flex-start' }}
                          >
                            {option.claim_id}
                          </p>
                          <p
                            className="text-[12px] items-center"
                            style={{ alignSelf: 'flex-start' }}
                          >
                            {option.prospectivePensioner.first_name}{' '}
                            {option.prospectivePensioner.surname}
                          </p>
                          <p
                            className="text-[12px] items-center"
                            style={{ alignSelf: 'flex-start' }}
                          >
                            {formData.searchType === 'national_id'
                              ? `${option.prospectivePensioner.national_id}`
                              : formData.searchType === 'personal_number'
                              ? `${option.prospectivePensioner.personal_number}`
                              : `${option.claim_id}`}
                          </p>
                        </Box>
                      </Box>
                    </li>
                  </div>
                )}
                ListboxProps={{
                  sx: {
                    padding: 0,
                    '& ul': {
                      padding: 0,
                      margin: 0,
                    },
                  },
                }}
                PopperComponent={(props) => (
                  <Popper {...props}>
                    <li className="flex items-center justify-between gap-[65px] px-3 py-2 bg-gray-100">
                      <p className="text-xs font-normal">No</p>
                      <p className="text-xs font-normal">Name</p>
                      <p className="text-xs font-normal">
                        {formData.searchType === 'national_id'
                          ? 'National ID'
                          : formData.searchType === 'personal_number'
                          ? 'Personal Number'
                          : 'Claim No'}
                      </p>
                    </li>
                    {props.children}
                  </Popper>
                )}
              />
            </div>
          )}
        </div>
      </BaseCollapse>

      {fieldsAndSections && (
        <>
          <div className="mb-4">
            <BaseCollapse name="Sections">
              <div className="grid grid-cols-3 gap-4 px-6 my-2">
                {fieldsAndSections.sections.map((section, index) => (
                  <div key={index}>
                    <label className="text-[13px] font-sans">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={!!formData.sectionsEnabled[section]}
                        onChange={() => handleSectionChange(section)}
                      />
                      {section}
                    </label>
                  </div>
                ))}
              </div>
            </BaseCollapse>
          </div>

          {formData.sectionsEnabled['BASIC_DETAILS'] && (
            <BaseCollapse name="Basic Details Fields">
              <div className="mt-3">
                <div className="grid grid-cols-4 gap-4 px-5">
                  {fieldsAndSections.fields.map((field, index) => (
                    <div key={index}>
                      <label className="text-[13px] font-sans">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={!!formData.basicDetailFields[field]}
                          onChange={() => handleFieldChange(field)}
                        />
                        {formatFieldName(field)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </BaseCollapse>
          )}
        </>
      )}
    </div>
  );
}

export default IgcRevisedInputCard;
