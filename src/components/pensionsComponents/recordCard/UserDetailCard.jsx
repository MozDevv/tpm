import { Avatar, Divider, IconButton } from "@mui/material";
import { EmailOutlined, PhoneOutlined } from "@mui/icons-material";
import React from "react";

function UserDetailCard({ clickedItem }) {
  return (
    <div className="mt-5">
      <div className="flex items-center flex-col justify-center p-2 gap-2">
        <Avatar sx={{ height: "100px", width: "100px" }} />
        <div className="flex flex-col mt-5 gap-2 items-center justify-center">
          <h5 className="font-semibold text-primary text-base">{`${clickedItem?.userName}`}</h5>
        </div>
      </div>
      <Divider />
      <div className="mt-4 p-2">
        <div className="flex items-center gap-2">
          <IconButton>
            <PhoneOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.phoneNumber}
          </h6>
        </div>
        <div className="flex items-center gap-2">
          <IconButton>
            <EmailOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.email}
          </h6>
        </div>
      </div>
      <Divider />
      <div className="mt-8 p-2 flex gap-3 flex-col">
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">
            Phone Number Confirmed:{" "}
          </h6>
          <span className="text-xs">
            {clickedItem?.phoneNumberConfirmed ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">
            Two-Factor Enabled:{" "}
          </h6>
          <span className="text-xs">
            {clickedItem?.twoFactorEnabled ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">
            Lockout Enabled:{" "}
          </h6>
          <span className="text-xs">
            {clickedItem?.lockoutEnabled ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserDetailCard;
