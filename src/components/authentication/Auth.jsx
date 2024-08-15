"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_CORE_API } from "@/utils/constants";
import {
  Alert,
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
import { useAlert } from "@/context/AlertContext";
import { message } from "antd";
import { useAuth } from "@/context/AuthContext";

function Auth() {
  // Initialize Next.js router
  const router = useRouter();

  const { login } = useAuth();
  // State variables for login form
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State variable for error handling
  const [errors, setErrors] = useState({
    status: false,
    message: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleSignIn();
    }
  };
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
        //localStorage.setItem("token", res.data.data.token);

        login(res.data.data.token);

        // Redirect user to the dashboard upon successful login
        router.push("/pensions");
      }
    } catch (error) {
      console.log(error?.response?.data?.message);

      // Handle login errors
      if (error?.response?.data?.message === "Wrong username or password") {
        setErrors({
          status: true,
          message: "Incorrect Username or Password. Please try again!",
        });
      } else if (
        error?.response?.data?.message ===
        "Please change your password to LogIn"
      ) {
        await handleResetPassword();
        // alert("Please reset your password before proceeding");

        setErrors({
          status: false,
          message: "",
        });
      } else if (
        error?.response?.status === 502 ||
        error?.response?.status === 503
      ) {
        message.error("Service Unavailable, Please try again later");
      } else if (error?.response?.status === 404) {
        message.error("Resource not found");
      } else if (error?.response?.status === 401) {
        message.error("Unauthorized access");
      } else {
        message.error("An unexpected error occurred, Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await AuthApiService.post(
        `${BASE_CORE_API}api/Auth/ForgetPassword?email=${username}`
      );
      console.log("response", response);
      if (response.data.isSuccess) {
        router.push(`/reset?username=${username}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      {/* Login Form Section */}
      <form action="" className="pt-10" onKeyDown={handleKeyDown}>
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
          <div className="text-primary text-[28px] font-bold"> Sign In</div>
        )}{" "}
        {/* Render error message if there are errors */}
        {errors.status && (
          <Typography sx={{ color: "crimson", fontWeight: 500, mb: 2 }}>
            {errors.message}
          </Typography>
        )}
        {resetPassword ? (
          <>
            <ResetNewPassword username={username} password={password} />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 4,
              gap: "20px",
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "gray",
                  mb: "3px",
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
                sx={{
                  fontSize: "13px",
                  mb: "3px",
                  color: "gray",
                  fontWeight: "700",
                }}
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
                fontWeight: "500",
                mt: "10px",
              }}
              onClick={handleSignIn}
              //  onClick={() => router.push("/otp")}
              disabled={loading}
            >
              Login
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
                // component="link"
                onClick={() => router.push(`/otp`)}
                sx={{
                  fontSize: "13px",
                  textDecoration: "underline",
                  fontWeight: "700",
                  color: "#F3A92A",
                  cursor: "pointer",
                }}
              >
                Reset
              </Typography>
            </Typography>
          </Box>
        )}
        <div className="text-xs italic flex items-center gap-1 bottom-4 absolute font-bold text-gray-500 mb-8">
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
