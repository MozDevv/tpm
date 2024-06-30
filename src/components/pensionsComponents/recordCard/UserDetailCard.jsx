import {
  Email,
  EmailOutlined,
  Phone,
  PhoneOutlined,
} from "@mui/icons-material";
import { Avatar, Divider, IconButton } from "@mui/material";
import React from "react";

function UserDetailCard({ clickedItem }) {
  return (
    <div className="mt-5">
      <div className="flex items-center flex-col justify-center p-2  gap-2">
        <Avatar sx={{ height: "100px", width: "100px" }} />
        <div className="flex flex-col mt-5 gap-2 items-center justify-center">
          <h5 className="font-semibold text-primary text-base">{`${clickedItem?.first_name} ${clickedItem?.surname}`}</h5>
        </div>
      </div>
      <Divider />
      <div className="mt-4 p-2">
        <div className="flex items-center gap-2">
          <IconButton>
            <PhoneOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.phone_number}
          </h6>
        </div>
        <div className="flex items-center gap-2">
          <IconButton>
            <EmailOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.email_address}
          </h6>
        </div>
      </div>
    </div>
  );
}

export default UserDetailCard;
