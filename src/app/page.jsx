"use client";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("@/components/authentication/Auth"));

function Login() {
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
          <div className="mt-[100px]">
            <div className="mt-10 w-[100px] mb-10 h-[12px] rounded-full bg-primary"></div>
            <p className="text-[31px] leading-12 font-bold w-[480px] text-primary">
              Welcome to Treasury Pension Management Information System
            </p>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="h-full flex items-center justify-center">
        <Auth />
      </div>
    </div>
  );
}

export default Login;
