import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import claimsEndpoints from '@/components/services/claimsApi';
import endpoints, { apiService } from '@/components/services/setupsApi';
import React, { useEffect, useState } from 'react';
import { mapRowData } from '../ClaimsTable';
import { Autocomplete, Box, Button, Popper, TextField } from '@mui/material';
import { message } from 'antd';

function IgcRevisedInputCard({ setOpenBaseCard }) {
  const { data: fieldsAndSections } = useFetchAsync(
    endpoints.getBasicFields,
    apiService
  );

  const [formData, setFormData] = useState({
    basicDetailFields: {},
    sectionsEnabled: {},
  });
  const [claims, setClaims] = useState([]);
  const [errors, setErrors] = useState({});
  const fetchClaims = async () => {
    try {
      const res = await apiService.get(claimsEndpoints.getClaims, {
        'paging.pageSize': 100000,
        'paging.pageNumber': 1,
      });
      if (res.status === 200) {
        const mappedData = mapRowData(res.data.data);

        console.log('mappedData from dajskasjsakjkj', mappedData);
        setClaims(mappedData);
      } // Handle the response as needed
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mr-5">
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <BaseCollapse name="Claim">
        <div className="px-5 py-3">
          <Autocomplete
            options={claims || []}
            getOptionLabel={(option) => `${option.claim_id}`}
            onChange={(event, newValue) => {
              setFormData((prevData) => ({
                ...prevData,
                claimId: newValue?.id_claim,
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
              claims.find((option) => option.id_claim === formData.claimId) ||
              null
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
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 3,
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
                        style={{ alignSelf: 'flex-center' }}
                      >
                        {option.first_name} {option.surname}
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
                {/* Header */}
                <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
                  <p className="text-xs font-normal">No</p>
                  <p className="text-xs font-normal">Name</p>
                </li>
                {props.children}
              </Popper>
            )}
          />
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
