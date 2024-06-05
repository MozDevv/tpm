import { AccountBalanceOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import React from "react";

const MemberStats = () => {
  return (
    <div>
      <Grid container justifyContent="space-around">
        {" "}
        <Grid
          item
          xs={3.5}
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            borderRadius: "20px",
            // backgroundColor: "white",border: "1px solid #006990",
            border: "2px solid #006990",
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
          <Box sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}>
            36,427
          </Box>
        </Grid>
        <Grid
          item
          xs={3.5}
          sx={{
            //  backgroundColor: "white",
            border: "2px solid #006990",
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
          <Box sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}>
            1,398
          </Box>
        </Grid>
        <Grid
          item
          xs={3.5}
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            // backgroundColor: "white",
            border: "2px solid #006990",
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
          <Box sx={{ fontSize: "29px", color: "#006990", fontWeight: "700" }}>
            6,427
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default MemberStats;
