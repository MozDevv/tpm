"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  Password,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import ResetNewPassword from "../loginComponents/ResetNewPassword";
import authEndpoints, { AuthApiService } from "../services/authApi";

function Auth() {
  // Initialize Next.js router
  const router = useRouter();

  // State variables for login form
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [resetPassword, setResetPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State variable for error handling
  const [errors, setErrors] = useState({
    status: false,
    message: "",
  });

  // Function to handle user sign-in
  const handleSignIn = async () => {
    setLoading(true);
    const payload = {
      email: username,
      password: password,
    };

    console.log("payload", payload);
    try {
      // Send login request to the server
      const res = await AuthApiService.post(authEndpoints.login, payload);

      console.log("data", res.data);
      if (res.data.isSuccess) {
        // Store token in local storage upon successful login
        localStorage.setItem("token", res.data.data.token);

        // Redirect user to the dashboard upon successful login
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error.response.data.message);

      // Handle login errors
      if (error.response.data.message === "Wrong username or password") {
        setErrors({
          status: true,
          message: "Incorrect Username or Password. Please try again!",
        });
      } else if (
        error.response.data.message === "Please change your password to LogIn"
      ) {
        setResetPassword(true);
      } else {
        setErrors({
          status: true,
          message: "An unexpected error occured! Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {" "}
      {/* Login Form Section */}
      <form action="">
        {resetPassword ? (
          <>
            <Typography
              sx={{ fontSize: 20 }}
              fontWeight={600}
              mb={5}
              color="primary"
            >
              Please Reset Your Password before proceeding
            </Typography>
          </>
        ) : (
          <Typography
            variant="h2"
            color="primary"
            sx={{
              mb: 4,

              fontWeight: 700,
            }}
          >
            Sign In
          </Typography>
        )}{" "}
        {/* Render error message if there are errors */}
        {errors.status && (
          <Typography sx={{ color: "crimson", fontWeight: 500, mb: 2 }}>
            {errors.message}
          </Typography>
        )}
        {resetPassword ? (
          <>
            <ResetNewPassword />
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "gray",
                }}
              >
                Username/Email
              </FormLabel>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                sx={{
                  height: "48px",
                  width: "512px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: errors.status ? "crimson" : "grey",
                    },
                  },
                }}
                fullWidth
                placeholder="123@email.com"
                inputProps={{ style: { height: "12px" } }}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel
                sx={{ fontSize: "13px", color: "gray", fontWeight: "700" }}
              >
                Password
              </FormLabel>
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: errors.status ? "crimson" : "grey",
                    },
                  },
                }}
                inputProps={{ style: { height: "12px" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={!showPassword ? "password" : "text"}
                fullWidth
                required
              />
            </FormControl>
            <Button
              fullWidth
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "#006990" },
                pl: "20px",
                display: "flex",
                color: "white",
                justifyContent: "space-between",
                textTransform: "none",
                mt: "10px",
              }}
              onClick={handleSignIn}
              disabled={loading}
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
        )}
        <div className="text-xs italic flex items-center gap-1 mt-12 font-bold text-gray-500 mb-8">
          Powered By
          <span className="text-primary cursor-pointer underline hover:text-yellow-500">
            Agile
          </span>
          <span>
            <img src="agileLogo.png" height={30} width={30} alt="" />
          </span>
        </div>
      </form>
    </div>
  );
}

export default Auth;
