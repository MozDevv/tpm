"use client";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";
import Otp from "@/components/otp/Otp";

const Auth = dynamic(() => import("@/components/authentication/Auth"));

function Login() {
  const [generateOtp, setGenerateOtp] = useState(true);

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left Column */}
      <div className="h-full bg-white flex  justify-center flex-col">
        <div className="pl-36">
          {" "}
          {/* Logo and Welcome Section */}
          <img
            src="/logo.png"
            alt=""
            className="pb-15"
            height={99}
            width={450}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="h-full flex items-center justify-center">
        <Otp />
      </div>
    </div>
  );
}

export default Login;
