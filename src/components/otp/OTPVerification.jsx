"use client";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  TextField,
} from "@mui/material";
import React from "react";
import PoweredBy from "../poweredBy/PoweredBy";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { message } from "antd";
import { AuthApiService } from "../services/authApi";
import { BASE_CORE_API } from "@/utils/constants";

function OTPVerification() {
  const router = useRouter();

  const { auth, login, logout } = useAuth();

  const [email, setEmail] = React.useState("");

  const handleSubmit = async () => {
    if (email === "") {
      message.error("Please enter your email address");
      return;
    }

    try {
      const response = await AuthApiService.post(
        `${BASE_CORE_API}api/Auth/ForgetPassword?email=${email}`
      );
      console.log("response", response);
      if (response.status === 200) {
        router.push(`/reset?username=${email}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {" "}
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[25px] font-bold">Forgot Password</p>
      </div>
      <FormControl>
        <FormLabel
          sx={{
            fontSize: "13px",
            fontWeight: "700",
            color: "gray",
            mb: "4px",
            mt: 3,
          }}
        >
          Enter your email address
        </FormLabel>
        <TextField
          type="email"
          sx={{
            height: "48px",
            width: "512px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                //   borderColor: errors.status ? "crimson" : "grey",
              },
            },
          }}
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          //  placeholder="123@email.com"
          inputProps={{ style: { height: "12px" } }}
          required
        />
      </FormControl>
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outlined"
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            width: "45%",
            textTransform: "none",
            borderColor: "rgb(185,190,196 )",

            borderWidth: "1px",
            "&:hover": {
              borderWidth: "2px",
              borderColor: "#b9bec4",
            },
          }}
          onClick={() => router.back()}
        >
          <IconButton
            sx={{
              mr: "auto",
              position: "absolute",
              left: 1,
              p: 0,
              ml: 1,
            }}
          >
            <ArrowBack sx={{ fontSize: "18px", color: "primary.main" }} />
          </IconButton>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            mt: 1,

            display: "flex",
            justifyContent: "center",
            width: "45%",
            textTransform: "none",
          }}
        >
          Confirm
          <IconButton
            sx={{
              ml: "auto",
              position: "absolute",
              right: 1,
              p: 0,
              mr: 1,
            }}
          >
            <ArrowForward sx={{ fontSize: "18px", color: "white" }} />
          </IconButton>
        </Button>
      </div>
      <PoweredBy />
    </div>
  );
}

export default OTPVerification;
