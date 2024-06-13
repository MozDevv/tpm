import {
  Email,
  EmailOutlined,
  Phone,
  PhoneOutlined,
} from "@mui/icons-material";
import { Avatar, Divider, IconButton } from "@mui/material";
import React from "react";

function UserDetailCard() {
  return (
    <div>
      <div className="flex items-center flex-col justify-center p-2  gap-2">
        <Avatar sx={{ height: "100px", width: "100px" }} />
        <div className="flex flex-col mt-5 gap-2 items-center justify-center">
          <h5 className="font-semibold text-primary text-base">Xisse Xavier</h5>
          <h5 className="font-medium text-xs">IT Admin</h5>
        </div>
      </div>
      <Divider />
      <div className="mt-4 p-2">
        <div className="flex items-center gap-2">
          <IconButton>
            <PhoneOutlined />
          </IconButton>
          <h6 className="font-semibold text-primary text-sm">+211 323 4342</h6>
        </div>
        <div className="flex items-center gap-2">
          <IconButton>
            <EmailOutlined />
          </IconButton>
          <h6 className="font-semibold text-primary text-sm">email@io.com</h6>
        </div>
      </div>
    </div>
  );
}

export default UserDetailCard;
