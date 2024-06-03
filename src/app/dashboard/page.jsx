import ApprovalRequests from "@/components/dashboardComponents/approvalRequests/ApprovalRequests";
import ClaimsValue from "@/components/dashboardComponents/claimsValue/ClaimsValue";
import DueForApproval from "@/components/dashboardComponents/dueforapproval/DueForApproval";
import RecentClaims from "@/components/dashboardComponents/recentClaims/RecentClaims";
import { AccountBalanceOutlined } from "@mui/icons-material";
import { Box, Card, Grid, IconButton } from "@mui/material";
import React from "react";

function Dashboard() {
  return (
    <div>
      <Grid
        container
        sx={{ mt: "30px", maxHeight: "100vh", overflowY: "auto" }}
        spacing={0}
      >
        <Grid
          item
          xs={8}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Grid container justifyContent="space-around">
            <Grid
              item
              xs={3.5}
              sx={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                borderRadius: "20px",
                backgroundColor: "white",
                height: "140px",

                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: "20px",
              }}
            >
              <Box>
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "#006990",
                    height: "25px",
                    width: "25px",
                    borderRadius: "3px",
                  }}
                >
                  <AccountBalanceOutlined fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  fontSize: "16px",
                  color: "#006990",
                  fontWeight: 500,
                }}
              >
                Principal Member
              </Box>
              <Box
                sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}
              >
                36,427
              </Box>
            </Grid>
            <Grid
              item
              xs={3.5}
              sx={{
                backgroundColor: "white",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                height: "140px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: "20px",
              }}
            >
              {" "}
              <Box>
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "#006990",
                    height: "25px",
                    width: "25px",
                    borderRadius: "3px",
                  }}
                >
                  <AccountBalanceOutlined fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  fontSize: "15px",
                  color: "#006990",
                  fontWeight: 500,
                }}
              >
                Beneficiary
              </Box>
              <Box
                sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}
              >
                1,398
              </Box>
            </Grid>
            <Grid
              item
              xs={3.5}
              sx={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                p: "20px",
                height: "140px",
                borderRadius: "20px",
              }}
            >
              {" "}
              <Box>
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "#006990",
                    height: "25px",
                    width: "25px",
                    borderRadius: "3px",
                  }}
                >
                  <AccountBalanceOutlined fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  fontSize: "15px",
                  color: "#006990",
                  fontWeight: 500,
                }}
              >
                Funds Value
              </Box>
              <Box
                sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}
              >
                6,427
              </Box>
            </Grid>
          </Grid>
          <ClaimsValue />
        </Grid>
        <Grid item xs={4} sx={{ height: "100%" }}>
          <DueForApproval />
        </Grid>
        <Grid container height="450px" width="100%" gap={3} pt={2}>
          <Grid
            item
            xs={5}
            sx={{
              height: "100%",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          >
            <ApprovalRequests />
          </Grid>
          <Grid
            item
            xs={6.5}
            sx={{
              height: "100%",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              borderRadius: "20px",
              backgroundColor: "white",
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
