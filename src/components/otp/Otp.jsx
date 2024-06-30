"use client";
import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, Start } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PoweredBy from "../poweredBy/PoweredBy";

function Otp() {
  // State variables for tracking button clicks
  const [buttonClicked, setButtonClicked] = useState("email");

  const router = useRouter();
  const handleButtonClick = (button) => {
    setButtonClicked(button);
    router.push("/otp/verification");
  };
  return (
    <div className="">
      {/* Login Form Section */}
      <form action="" className="pt-10">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-[25px] font-bold">OTP Verification</p>
          <p className="text-black text-sm font-medium w-[350px]">
            Select where you would like to receive the verification code
          </p>
        </div>

        <div className="flex flex-col mt-10 gap-7 ">
          <Button
            variant="outlined"
            sx={{
              height: "75px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "5px",
              borderWidth: "2px",
              borderColor:
                buttonClicked === "email" ? "primary.main" : "#b9bec4", // Conditional border color
              color: buttonClicked === "email" ? "primary.main" : "#b9bec4", // Conditional text color
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#b9bec4",
              },
            }}
            onClick={() => handleButtonClick("email")}
          >
            <p className="font-semibold text-sm w-[250px]">
              Send Code to my email s******@agile.com
            </p>
            <ArrowForward />
          </Button>

          <Button
            variant="outlined"
            sx={{
              height: "75px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "5px",
              borderWidth: "2px",
              borderColor:
                buttonClicked === "phone" ? "primary.main" : "#b9bec4",
              color: buttonClicked === "phone" ? "primary.main" : "#b9bec4",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#b9bec4",
              },
            }}
            onClick={() => handleButtonClick("phone")}
          >
            <p className="font-semibold text-sm w-[250px]">
              Send Code to Phone Number +234 80********
            </p>
            <ArrowForward />
          </Button>
        </div>

        <div className="">
          <Button
            variant="outlined"
            fullWidth
            sx={{
              display: "flex",
              justifyContent: "flex-start", // Aligns items to the start (left) of the button
              alignItems: "center", // Centers items vertically within the button
              mt: 5,
              borderColor: "#b9bec4",
              borderWidth: "2px",
              textTransform: "none",
              p: 1,
              "&:hover": {
                borderWidth: "2px",
                borderColor: "#b9bec4",
              },
            }}
            onClick={() => router.back()}
            startIcon={<ArrowBack />}
          >
            <span
              className="text-primary font-semibold"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Back
            </span>
          </Button>
          <div className="flex gap-1 text-sm mt-10 font-medium text-gray-400">
            <p className="underline">Log In</p>
            <p>instead?</p>
          </div>
        </div>

        {/* Render error message if there are errors */}
        {/* Assuming errors.status and errors.message are handled elsewhere */}
        <Typography sx={{ color: "crimson", fontWeight: 500, mb: 2 }}>
          {/* errors.message */}
        </Typography>
      </form>
      <PoweredBy />
    </div>
  );
}

export default Otp;
