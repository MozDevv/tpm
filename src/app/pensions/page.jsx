'use client';
import DueForApproval from '@/components/pensionsComponents/dashboardComponents/dueforapproval/DueForApproval';
import { useAuth } from '@/context/AuthContext';
import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';

// Import components for the dashboard using next/dynamic
const MemberStats = dynamic(() =>
  import(
    '@/components/pensionsComponents/dashboardComponents/memberStats/MemberStats'
  )
);
const ApprovalRequests = dynamic(() =>
  import(
    '@/components/pensionsComponents/dashboardComponents/approvalRequests/ApprovalRequests'
  )
);
const ClaimsValue = dynamic(() =>
  import(
    '@/components/pensionsComponents/dashboardComponents/claimsValue/ClaimsValue'
  )
);

const RecentClaims = dynamic(() =>
  import(
    '@/components/pensionsComponents/dashboardComponents/recentClaims/RecentClaims'
  )
);

// Dashboard component

function Dashboard() {
  const { auth, login, logout } = useAuth();

  console.log('authenticating user...', auth);
  return (
    <div>
      <Grid
        container
        sx={{ mt: '30px', maxHeight: '100vh', overflowY: 'auto' }}
        spacing={0}
      >
        <Grid
          item
          xs={8}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          {/* MEMBER STATS */}
          <MemberStats />

          {/* CLAIMS VALUE  */}
          <ClaimsValue />
        </Grid>
        {/* DUE FOR APPROVAL */}
        <Grid item xs={4} sx={{ height: '100%' }}>
          <DueForApproval />
        </Grid>
        <Grid container height="450px" width="100%" mb={6} gap={3} pt={2}>
          <Grid
            item
            xs={5}
            sx={{
              height: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              borderRadius: '20px',
              backgroundColor: 'white',
            }}
          >
            <ApprovalRequests />
          </Grid>
          <Grid
            item
            xs={6.5}
            sx={{
              height: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              borderRadius: '20px',
              backgroundColor: 'white',
            }}
          >
            <RecentClaims />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
