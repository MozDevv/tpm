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

function OTPVerification() {
  const router = useRouter();

  const { auth, login, logout } = useAuth();

  const [email, setEmail] = React.useState("");

  const handleLogin = () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyb3kua2lwY2h1bWJhQGFnaWxlYml6LmNvLmtlIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJhOGY5YzQxNS03MzA4LTRhYTgtOTliZC00NjI1MTM1OWY3MjQiLCJOYW1lIjoiUm95IiwiUGVybWlzc2lvbnMiOiJNREEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiVGVzdDEiLCJUZXN0MiIsIlRlc3QzIl0sIlVzZXJOYW1lIjoicm95LmtpcGNodW1iYUBhZ2lsZWJpei5jby5rZSIsImV4cCI6MTcxODg2NDE4MCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA0OSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNDkifQ.VnkgYB1It-Nofs85tahq7Xr_8wIC_l6g9MhlD6LueJg";

    login(token);
    router.push("/pensions");
  };

  const handleSubmit = () => {
    if (email === "") {
      message.error("Please enter your email address");
      return;
    }

    router.push(`/reset?username=${email}`);
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
