"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  AccountBalance,
  CreditCard,
  Paid,
  Payment,
  Payments,
  PriceChange,
  RequestQuote,
} from "@mui/icons-material";

function PendingApproval() {
  const approvalCues = [
    {
      title: "Normal Receipts ",
      count: 10,
      icon: <AccountBalanceWalletIcon />,
    },
    {
      title: "31% Contribution Receipts ",
      count: 5,
      icon: <Paid />,
    },
    {
      title: "WCPS Receipts ",
      count: 7,
      icon: <Payments />,
    },
    {
      title: "By-Back Receipts ",
      count: 2,
      icon: <Payment />,
    },
    {
      title: "Voucher Preparation PVs ",
      count: 8,
      icon: <RequestQuote />,
    },
    {
      title: "Voucher Authority PVs ",
      count: 3,
      icon: <AccountBalance />,
    },
    {
      title: "Voucher Approval PVs ",
      count: 6,
      icon: <PriceChange />,
    },
    {
      title: "Voucher Approval PV ",
      count: 6,
      icon: <PriceChange />,
    },
  ];

  return (
    <div className="p-2">
      <Typography
        color="primary"
        sx={{ fontSize: "16px", fontWeight: 700, mb: 2 }}
      >
        Pending Approval
      </Typography>
      <Grid container spacing={2}>
        {approvalCues.map((cue, index) => (
          <Grid sx={{}} item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: "160px",
                display: "flex",

                textAlign: "center",
                p: 1,
              }}
            >
              <div className="flex flex-col justify-between">
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",

                    p: 1,
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <IconButton color="secondary">
                    {React.cloneElement(cue.icon, { sx: { fontSize: "28px" } })}
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,

                      p: 0,
                      textAlign: "center",
                    }}
                  >
                    {cue.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                      mb: -2,

                      color: "primary.main",
                    }}
                  >
                    {cue.count}
                  </Typography>
                </CardContent>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default PendingApproval;
