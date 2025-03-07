'use client';
import {
  Box,
  CardContent,
  Typography,
  Card,
  Icon,
  IconButton,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import React, { useState } from 'react';
import {
  AccountBalance,
  CreditCard,
  KeyboardArrowRight,
  Paid,
  Payment,
  Payments,
  PriceChange,
  RequestQuote,
} from '@mui/icons-material';
import CueModal from './Cues/CueModal';

function Dashboard() {
  const cardContent = [
    {
      title: 'Normal Receipts',
      ammount: '30',
      icon: <AccountBalanceWalletIcon />,
    },
    {
      title: '31% Contributions',
      ammount: '210',
      icon: <Paid />,
    },
    {
      title: 'WCPS Reciepts',
      ammount: '100',
      icon: <Payments />,
    },
    {
      title: 'By-Back Reciepsts',
      ammount: '30',
      icon: <Payment />,
    },
    {
      title: 'Payment Vouchers Posted',
      ammount: '12',
      icon: <RequestQuote />,
    },
    {
      title: 'Unpaid Lumpsums',
      ammount: '123',
      icon: <AccountBalance />,
    },
    {
      title: 'Payroll Payment Voucher',
      ammount: '500',
      icon: <PriceChange />,
    },
    {
      title: 'Payroll Payment Voucher1',
      ammount: '50',
      icon: <AccountBalanceWalletIcon />,
    },
  ];

  const [openCue, setOpenCue] = useState(false);
  const handleOpenCue = (index) => {
    setOpenCue(true);
  };

  return (
    <div>
      {openCue && <CueModal openCue={openCue} setOpenCue={setOpenCue} />}
      <p className="mb-2 ml-1 text-base font-bold text-primary">Overview</p>
      <Box>
        {' '}
        <Card
          sx={{
            color: 'black',
            display: 'flex',
          }}
        >
          {cardContent.map((item, index) => (
            <Box
              key={index}
              onClick={() => handleOpenCue(item.title)}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent
                key={item.name}
                sx={{
                  borderRight: {
                    xs: '0',
                    sm: '1px solid rgba(0,0,0,0.1)',
                    position: 'relative',
                  },

                  height: '160px',
                  width: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  alignItems: 'center',
                }}
              >
                <IconButton color="secondary" sx={{ mt: '-10px' }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: '30px' } })}
                </IconButton>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{ fontSize: '22px', fontWeight: 700 }}
                  color="primary"
                  variant="h5"
                >
                  {item.ammount}
                </Typography>
              </CardContent>
            </Box>
          ))}
        </Card>
      </Box>
    </div>
  );
}

export default Dashboard;
