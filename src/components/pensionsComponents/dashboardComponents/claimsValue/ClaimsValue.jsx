'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Select,
  MenuItem,
  FormControl,
  Typography,
  InputLabel,
} from '@mui/material';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RetirementTrends = () => {
  const [allRetirees, setAllRetirees] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedField, setSelectedField] = useState('retirement_date');

  useEffect(() => {
    fetchAllRetirees();
  }, []);

  const fetchAllRetirees = async () => {
    try {
      const res = await apiService.get(preClaimsEndpoints.getPreclaims, {
        'paging.pageNumber': 1,
        'paging.pageSize': 100000,
      });
      if (res.status === 200) {
        setAllRetirees(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const years = Array.from({ length: 2030 - 1949 + 1 }, (_, i) => 1949 + i);
  const fields = [
    { label: 'Retirement Date', value: 'retirement_date' },
    { label: 'Date of First Appointment', value: 'date_of_first_appointment' },
    { label: 'Date of Last Pay', value: 'date_of_last_pay' },
    { label: 'Date of Birth', value: 'date_of_birth' },
    {
      label: 'Authority of Retirement',
      value: 'authority_for_retirement_dated',
    },
    {
      name: 'date_from_which_pension_will_commence',
      label: 'Pension Commencement Date',
    },
  ];

  const filteredData = allRetirees.filter((retiree) => {
    const date = dayjs(retiree[selectedField]);
    return date.year() === selectedYear;
  });

  const monthlyCounts = Array(12).fill(0);
  filteredData.forEach((retiree) => {
    const month = dayjs(retiree[selectedField]).month();
    monthlyCounts[month]++;
  });

  const chartOptions = {
    chart: {
      type: 'line',
      fontFamily: 'DM Sans',
      foreColor: '#adb0bb',
      toolbar: { show: false },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#006990'],
    grid: { borderColor: 'rgba(0, 0, 0, .2)', strokeDashArray: 2 },
  };

  const chartSeries = [
    {
      name: fields.find((f) => f.value === selectedField)?.label,
      data: monthlyCounts,
    },
  ];

  return (
    <Card sx={{ backgroundColor: 'white', borderRadius: '20px', p: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ color: '#006990' }}>
          Retirement Trends
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl>
            <InputLabel
              sx={{
                color: '#006990',
              }}
            >
              Year
            </InputLabel>
            <Select
              size="small"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel
              sx={{
                color: '#006990',
              }}
            >
              Field
            </InputLabel>
            <Select
              size="small"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {fields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={200}
        />
      </Box>
    </Card>
  );
};

export default RetirementTrends;
