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

function OTPVerification() {
  const router = useRouter();
  return (
    <div>
      {" "}
      <div className="flex flex-col gap-2">
        <p className="text-primary text-[25px] font-bold">OTP Verification</p>
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
          Enter otp sent to s*****@email.com
        </FormLabel>
        <TextField
          type="text"
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
            borderColor: "#b9bec4",
            borderWidth: "2px",
            "&:hover": {
              borderWidth: "2px",
              borderColor: "#b9bec4",
            },
          }}
          onclick={() => router.back()}
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
