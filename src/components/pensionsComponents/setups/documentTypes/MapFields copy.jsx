'use client';
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import { Table, message } from 'antd';
import endpoints, { apiService } from '@/components/services/setupsApi';

function MapFields({ clickedItem, setOpenAward }) {
  const [selectedFields, setSelectedFields] = useState([]);
  const [allFields, setAllFields] = useState([]);

  const fetchAllFieldNames = async () => {
    try {
      const res = await apiService.get(endpoints.getDocumentFieldsNames, {
        'paging.pageSize': 200,
      });

      if (res.status === 200 && res.data.succeeded) {
        setAllFields(res.data.data.map((doc) => ({ name: doc, id: doc })));
      }
    } catch (error) {
      console.error('Error fetching document fields:', error);
    }
  };

  const getMappedFields = async () => {
    try {
      const res = await apiService.get(
        endpoints.getTheMappedFieldstoTheDocumentTypes,
        { id: clickedItem.id }
      );

      if (res.status === 200 && res.data.succeeded) {
        setSelectedFields(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching mapped fields:', error);
    }
  };

  useEffect(() => {
    fetchAllFieldNames();
    getMappedFields();
  }, []);

  const addFieldstoTheTable = (event, newValue) => {
    setSelectedFields(newValue);
  };

  const handleSubmit = async () => {
    const data = {
      document_type_id: clickedItem.id,
      fields: selectedFields.map((field) => field.id),
    };

    try {
      const res = await apiService.post(endpoints.mapDocumentFields, data);

      if (res.status === 200 && res.data.succeeded) {
        message.success('Fields successfully mapped to the document type.');
        setOpenAward(false);
      }
    } catch (error) {
      console.error('Error submitting fields:', error);
      message.error('Failed to map fields.');
    }
  };

  const columns = [
    {
      title: 'Fields',
      dataIndex: 'name',
      key: 'name',
      width: '100%',
    },
  ];

  return (
    <div>
      <div className="mt-4 px-4 ">
        <div className="flex flex-col gap-3">
          <div className="pr-5 mb-5">
            <div className="flex flex-row gap-3 justify-between items-center">
              <p className="text-primary text-lg font-semibold font-montserrat">
                Fields where {clickedItem?.name} is required
              </p>
              <Button
                variant="contained"
                color="primary"
                sx={{ boxShadow: 'none', textTransform: 'none', mr: '-20px' }}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Autocomplete
          multiple
          options={allFields}
          defaultValue={selectedFields}
          getOptionLabel={(option) => option.name}
          value={selectedFields}
          onChange={addFieldstoTheTable}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Fields"
              variant="outlined"
              sx={{
                //change label color
                '& label': {
                  color: '#006990',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#006990',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#006990',
                  },
                  '&:hover fieldset': {
                    borderColor: '#006990',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#006990',
                  },
                },
              }}
            />
          )}
          sx={{
            '& .MuiOutlinedInput-root': {
              boxShadow: 'none',
            },
          }}
        />
        <div className="mt-5 shadow-none max-h-[350px] overflow-auto">
          <Table
            columns={columns}
            dataSource={selectedFields}
            pagination={false}
            rowKey="id"
            className="antcustom-table"
          />
        </div>
      </div>
    </div>
  );
}

export default MapFields;
