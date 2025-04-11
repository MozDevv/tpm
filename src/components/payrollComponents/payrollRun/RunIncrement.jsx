import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { message } from 'antd';

const RunIncrement = ({ incrementMaster }) => {
  const [selectedIncrementMaster, setSelectedIncrementMaster] = useState('');

  useEffect(() => {
    console.log('Increment Master:', incrementMaster);
  }, [incrementMaster]);

  const handleIncrementMasterChange = (event) => {
    console.log('Selected Increment Master:', event.target.value);
    setSelectedIncrementMaster(event.target.value);
  };

  const handleRunPayrollIncrement = async () => {
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.runPayrollIncrements(selectedIncrementMaster)
      );

      if (res.status === 200) {
        message.success('Increment has been run successfully');
      }
    } catch (error) {
      message.error('Failed to run increment');
    }
  };

  return (
    <div className="p-8 h-[100%]">
      <p className="text-primary relative font-semibold text-lg mb-5">
        Run Payroll Increment
      </p>

      <div>
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            mt: 3,
          }}
        >
          <p className="text-primary font-semibold font-sans">
            Select Increment Master
          </p>
          <Select
            value={selectedIncrementMaster}
            onChange={handleIncrementMasterChange}
            // label="Select Increment Master"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {incrementMaster.map((master) => (
              <MenuItem key={master.masterId} value={master.id}>
                {master.financialYear}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mt-12">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRunPayrollIncrement}
        >
          Run Increment
        </Button>
      </div>
    </div>
  );
};

export default RunIncrement;
