import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  TextField,
  Autocomplete,
  Popper,
} from '@mui/material';
import endpoints, { apiService } from '@/components/services/setupsApi';

function NumberingSections() {
  const [numberingSections, setNumberingSections] = useState([]);
  const [numberSeriesOptions, setNumberSeriesOptions] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [saveEnabled, setSaveEnabled] = useState(false);

  useEffect(() => {
    getNumberingSections();
    getNumberSeriesOptions();
  }, []);

  const getNumberingSections = async () => {
    try {
      const response = await apiService.get(endpoints.getNumberingSections, {
        'paging.pageSize': 1000,
      });
      setNumberingSections(response.data.data);
    } catch (error) {
      console.error('Error fetching numbering sections:', error);
    }
  };

  const getNumberSeriesOptions = async () => {
    try {
      const response = await apiService.get(endpoints.getNumberSeries, {
        'paging.pageSize': 1000,
      });
      setNumberSeriesOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching number series options:', error);
    }
  };

  const handleNumberSeriesChange = async (value, record) => {
    const updatedRows = {
      ...editableRows,
      [record.id]: value,
    };
    setEditableRows(updatedRows);
    setSaveEnabled(true);
    try {
      const response = await apiService.put(endpoints.editNumberingSection, {
        id: record.id,
        numberSeriesId: value,
      });
      if (response.status === 200 && response.data.succeeded) {
        message.success('Changes saved successfully');
      } else if (
        response.status === 200 &&
        !response.data.succeeded &&
        response.data.messages
      ) {
        //truncate the message to 100 characters
        const truncatedMessage = response.data.messages[0].substring(0, 100);
        message.error(truncatedMessage);
        // message.error(response.data.messages[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async () => {
    try {
      const updateRequests = Object.keys(editableRows).map((id) => {
        const numberSeriesId = editableRows[id];
        const numberingSection = numberingSections.find(
          (section) => section.id === id
        );
        return apiService.put(endpoints.editNumberingSection, {
          id,
          numberSeriesId,
        });
      });

      await Promise.all(updateRequests);
      message.success('Changes saved successfully');
      setSaveEnabled(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const renderSelect = (text, record) => (
    <Autocomplete
      options={numberSeriesOptions} // Use the number series options
      getOptionLabel={(option) => `${option.code} - ${option.description}`} // Display name and description
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option.code.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.description.toLowerCase().includes(inputValue.toLowerCase())
        )
      } // Allow searching by code or description
      onChange={(event, newValue) => {
        handleNumberSeriesChange(newValue ? newValue.id : '', record); // Update the selected value
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="--------------------------------------------------------"
        />
      )}
      value={
        numberSeriesOptions.find(
          (option) => option.id === (editableRows[record.id] || text?.id)
        ) || null
      }
      renderOption={(props, option, { selected }) => (
        <li
          {...props}
          style={{
            backgroundColor: selected ? '#B2E9ED' : 'white', // Highlight selected option
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
                {option.code}
              </p>
              <p
                className="text-[12px] items-center"
                style={{ alignSelf: 'flex-center' }}
              >
                {option.description}
              </p>
            </Box>
          </Box>
        </li>
      )}
      PopperComponent={(props) => (
        <Popper {...props}>
          {/* Header */}
          <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
            <p className="text-xs font-normal">Code</p>
            <p className="text-xs font-normal">Description</p>
          </li>
          {props.children}
        </Popper>
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
    />
  );
  const columns = [
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Number Series',
      dataIndex: 'numberSeries',
      key: 'numberSeries',
      render: (text, record) => renderSelect(text, record),
    },
  ];

  return (
    <div className="pt-4 px-3">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={numberingSections.sort((a, b) => a.section - b.section)}
        pagination={false}
        scroll={{ y: 680 }}
        style={{
          borderCollapse: 'collapse',
        }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  // Header background color
                  color: '#333', // Header text color
                  fontWeight: 'bold', // Header font weight
                }}
              />
            ),
          },
          body: {
            row: (props) => (
              <tr
                {...props}
                style={{
                  ...props.style,
                  height: '40px', // Adjust row height
                }}
              />
            ),
            cell: (props) => (
              <td
                {...props}
                style={{
                  ...props.style,
                  padding: '8px', // Adjust cell padding
                }}
              />
            ),
          },
        }}
      />
    </div>
  );
}

export default NumberingSections;
