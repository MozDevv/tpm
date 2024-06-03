import React from "react";
import styles from "./login.module.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

function Login() {
  const handleRedirect = () => {
    window.open("https://www.agilebiz.co.ke/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.login}>
      <div className={styles.left}>
        <img src="/logo.png" alt="" height={99} width={514} />
        <div className={styles.block}></div>
        <Typography
          variant="h4"
          component="div"
          className={styles.welcome_text}
        >
          Welcome to Treasury Pension Management Integrated System
        </Typography>
      </div>
      <div className={styles.right}>
        <form action="">
          <Typography variant="h2" component="h2" className={styles.signing}>
            Sign In
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Username/Email
              </FormLabel>
              <TextField
                type="text"
                sx={{ height: "48px", width: "512px" }}
                fullWidth
                placeholder="123@email.com"
                inputProps={{
                  style: {
                    height: "12px",
                  },
                }}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                Password
              </FormLabel>
              <TextField
                placeholder="123456"
                inputProps={{
                  style: {
                    height: "12px",
                  },
                }}
                type="text"
                fullWidth
                required
              />
            </FormControl>
            <Button
              fullWidth
              sx={{
                backgroundColor: "#F3A92A",
                "&:hover": {
                  backgroundColor: "#006990",
                },
                pl: "20px",
                display: "flex",
                color: "white",
                justifyContent: "space-between",
                textTransform: "none",
                mt: "20px",
              }}
            >
              Sign In
              <ArrowForward />
            </Button>
            <Typography
              sx={{
                display: "flex",
                gap: "3px",
                fontSize: "13px",
                fontFamily: '"Montserrat", Arial, sans-serif',
                fontWeight: "700",
                color: "#939AAC",
                mt: "30px",
              }}
            >
              Forgot Your Password?
              <Typography
                component="span"
                sx={{
                  fontSize: "13px",
                  textDecoration: "underline",
                  fontWeight: "700",
                  color: "#F3A92A",
                }}
              >
                Reset
              </Typography>
            </Typography>
          </Box>
          <div className={styles.powered_by}>
            Powered By
            <span className={styles.powered_by_span}>Agile</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
