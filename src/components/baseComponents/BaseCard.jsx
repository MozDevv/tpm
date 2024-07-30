import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IconButton, Tooltip } from "@mui/material";
import { ArrowBack, OpenInFull } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import PensionerDetailSummary from "../pensionsComponents/preclaims/PensionerDetailSummary";
import { Divider } from "antd";
import ListNavigation from "./ListNavigation";

function BaseCard({
  openBaseCard,
  setOpenBaseCard,
  children,
  title,
  status,
  clickedItem,
  handlers,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsVisible, setDetailsVisible] = useState(false);

  const expandSizes = {
    default: {
      minHeight: "95vh",
      maxHeight: "75vh",
      minWidth: "55vw",
      maxWidth: "75vw",
    },
    expanded: {
      minHeight: "95vh",
      maxHeight: "95vh",
      minWidth: "95vw",
      maxWidth: "95vw",
    },
  };

  const currentSize = isExpanded ? expandSizes.expanded : expandSizes.default;

  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const updatedHandlers = {
    ...handlers,
    openDetails: () => setDetailsVisible(!isDetailsVisible),
  };

  return (
    <Dialog
      open={openBaseCard}
      onClose={() => setOpenBaseCard(false)}
      fullWidth
      maxWidth="xl"
      sx={{
        "& .MuiPaper-root": {
          minHeight: currentSize.minHeight,
          maxHeight: currentSize.maxHeight,
          minWidth: currentSize.minWidth,
          maxWidth: currentSize.maxWidth,
        },
      }}
    >
      <div className="overflow-y-hidden">
        <div className="flex items-center justify-between w-full px-3 sticky top-0 z-[99999999] bg-white">
          <div className="flex items-center gap-1 mt-10">
            <IconButton
              sx={{
                border: "1px solid #006990",
                borderRadius: "50%",
                padding: "3px",
                marginRight: "10px",
                color: "#006990",
              }}
              onClick={() => setOpenBaseCard(false)}
            >
              <ArrowBack sx={{ color: "#006990" }} />
            </IconButton>
            <p className="text-lg text-primary font-semibold">{title}</p>
          </div>
          <div className="flex items-center">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              <Tooltip title={isExpanded ? "Shrink" : "Expand"}>
                <OpenInFull
                  color="primary"
                  sx={{
                    fontSize: "18px",
                    mt: "4px",
                  }}
                />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <div
          className={` grid grid-cols-12 gap-2 ${
            !isDetailsVisible ? "grid-cols-12" : "grid-cols-9"
          }`}
        >
          <div className="col-span-9 ">
            <div className="w-full ">
              <ListNavigation
                handlers={updatedHandlers}
                permissions={permissions}
                status={status}
              />
            </div>
            <Divider />
            {children}
          </div>
          {!isDetailsVisible && (
            <div className="col-span-3 flex flex-col mt-10 ">
              <PensionerDetailSummary clickedItem={clickedItem} />
              <Divider sx={{ mt: 3 }} />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default BaseCard;
