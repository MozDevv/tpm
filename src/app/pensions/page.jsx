'use client';
import AssessmentTable from '@/components/assessment/assessmentDataCapture/AssessmentTable';
import MainPayroll from '@/components/payrollComponents/payrollRun/MainPayroll copy';
import ClaimsTable from '@/components/pensionsComponents/ClaimsManagementTable/ClaimsTable';
// import RetirementTrends from '@/components/pensionsComponents/dashboardComponents/claimsValue/ClaimsValue';
import ClaimsValue from '@/components/pensionsComponents/dashboardComponents/claimsValue/ClaimsValue';
import DueForApproval from '@/components/pensionsComponents/dashboardComponents/dueforapproval/DueForApproval';
import Preclaims from '@/components/pensionsComponents/preclaims/Preclaims';
import authEndpoints, { AuthApiService } from '@/components/services/authApi';
import { useAuth } from '@/context/AuthContext';
import { AccountBalanceOutlined, Launch } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
const RetirementTrends = dynamic(
  () =>
    import(
      '@/components/pensionsComponents/dashboardComponents/claimsValue/ClaimsValue'
    ),
  {
    ssr: false, // This ensures the component is only rendered on the client side
  }
);
function Dashboard() {
  const [department, setDepartment] = useState('');
  const { auth } = useAuth();
  const userId = auth?.user?.userId;
  const mdaId = localStorage.getItem('mdaId');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await AuthApiService.get(authEndpoints.getUsers, {
          documentID: userId,
        });
        if (res.status === 200) {
          setDepartment(res.data.data.department.name);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const departmentComponents = {
    'MDA HR Data Capture': {
      component1: <Preclaims status={0} isDashboard={true} />,
      component2: <Preclaims />,
      metrics: ['Unnotified Retirees', 'Total Notified', 'Total Submitted'],
    },
    'Claims Department': {
      component1: <ClaimsTable />,
      component2: <ClaimsTable />,
      metrics: ['Total Claims', 'Total Verified Claims', 'Total Approved'],
    },
    'Assessment Department': {
      component1: <AssessmentTable />,
      component2: <AssessmentTable />,
      metrics: ['Total Computed', 'Total Approved Claims'],
    },
    Directorate: {
      component1: <AssessmentTable />,
      component2: <AssessmentTable />,
      metrics: ['Total Pending Approvals', 'Total Approved'],
    },
    'Payroll Department': {
      component1: <MainPayroll />,
      component2: <MainPayroll />,
      metrics: [],
    },
  };

  const isMdaUser = !!mdaId;
  const { component1, component2, metrics } =
    isMdaUser || !departmentComponents[department]
      ? {
          component1: <Preclaims status={0} isDashboard={true} />,
          component2: <Preclaims status={2} isDashboard={true} />,
          metrics: [
            'Unnotified Retirees',
            'Notified Retirees',
            'Submitted Retirees',
          ],
        }
      : departmentComponents[department] || {
          component1: null,
          component2: null,
          metrics: [],
        };

  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{ mt: '30px', maxHeight: '100vh', overflowY: 'auto' }}
      >
        <Grid
          item
          xs={8}
          sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
        >
          <Grid container spacing={2} justifyContent="space-around">
            {metrics.map((metric, index) => (
              <Grid
                key={index}
                item
                xs={3.5}
                sx={{
                  border: '2px solid #006990',
                  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                  borderRadius: '20px',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  p: '20px',
                }}
              >
                <Box>
                  <IconButton
                    sx={{
                      color: 'white',
                      backgroundColor: '#006990',
                      height: '25px',
                      width: '25px',
                      borderRadius: '3px',
                    }}
                  >
                    <AccountBalanceOutlined fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  {metric}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {Math.floor(Math.random() * 10000)}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <RetirementTrends />
        </Grid>
        <Grid item xs={4}>
          <DueForApproval />
        </Grid>
        <Grid container width="100%" height={400} pt={2} gap={3} mb={6}>
          <Grid
            item
            xs={5}
            sx={{
              ml: 3,
              height: '100%',
              p: 0,
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              borderRadius: '20px',
              backgroundColor: 'white',
            }}
          >
            <div className="flex justify-between w-full pt-4 pl-4 mb-[-10px]">
              <Typography
                color="primary"
                sx={{ fontSize: '18px', ml: 1, fontWeight: 700 }}
              >
                {metrics[0]}
              </Typography>
              <IconButton
                sx={{
                  p: 0,
                }}
              >
                <Launch
                  sx={{
                    color: 'primary.main',
                    mr: 3,
                  }}
                />
              </IconButton>
            </div>
            {component1}
          </Grid>
          <Grid
            item
            xs={6.5}
            sx={{
              p: 0,
              height: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              borderRadius: '20px',
              backgroundColor: 'white',
            }}
          >
            <div className="flex justify-between w-full pt-4 pl-4 mb-[-10px]">
              <Typography
                color="primary"
                sx={{ fontSize: '18px', ml: 1, fontWeight: 700 }}
              >
                {metrics[1]}
              </Typography>
              <IconButton
                sx={{
                  p: 0,
                }}
              >
                <Launch
                  sx={{
                    color: 'primary.main',
                    mr: 3,
                  }}
                />
              </IconButton>
            </div>
            {component2}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
