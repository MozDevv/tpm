import React from "react";
import { Typography } from "@mui/material";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("@/components/authentication/Auth"));

function Login() {
  return (
    <div className="flex justify-between h-screen">
      <div className="flex-1 h-full bg-white flex items-start pl-36 justify-center flex-col gap-8">
        {/* Logo and Welcome Section */}
        <img src="/logo.png" alt="" height={99} width={514} />
        <div className="mt-10 w-[100px] h-[12px] rounded-full bg-primary"></div>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: "30px",
            fontWeight: "700",
            lineHeight: "40px",
            width: "470px",
            color: "primary.main",
          }}
        >
          Welcome to Treasury Pension Management Integrated System
        </Typography>
      </div>
      <div className="flex-1 h-full flex items-center justify-center">
        <Auth />
      </div>
    </div>
  );
}

export default Login;
