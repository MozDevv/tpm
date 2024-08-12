import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IconButton, Tooltip } from "@mui/material";
import { ArrowBack, OpenInFull } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { Divider, message } from "antd";
import ListNavigation from "./ListNavigation";
import UserDetailCard from "../pensionsComponents/recordCard/UserDetailCard";
import endpoints, { apiService } from "../services/setupsApi";
import NumberingSections from "./NumberingSections";

function NumberingSectionsCard({
  openBaseCard,
  setOpenBaseCard,
  title,
  status,
  clickedItem,
  handlers,
  isUserComponent,
  deleteApiEndpoint,
  deleteApiService,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsVisible, setDetailsVisible] = useState(true);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const updatedHandlers = {
    ...handlers,
    openDetails: () => setDetailsVisible(!isDetailsVisible),
    delete: () => setIsDialogOpen(true),
  };

  const handleDeleteItem = async () => {
    try {
      const res = await deleteApiService(deleteApiEndpoint);

      if (res.status === 200 || res.status === 201 || res.data.succeeded) {
        message.success(`${title} deleted successfully`);
        setIsDialogOpen(false);
        setOpenBaseCard(false);
      }
    } catch (error) {
      console.log(error);
    }
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
          transition: "all 0.3s ease",
        },
      }}
    >
      <div className="overflow-y-hidden p-5">
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
        <div className="w-full flex flex-col">
          <ListNavigation
            handlers={updatedHandlers}
            permissions={permissions}
            status={status}
          />
          <Divider />
        </div>
        <div className="grid gap-2 grid-cols-12 mt-2">
          <div className={`col-span-${isDetailsVisible ? "9" : "12"}`}>
            {children}
          </div>
          {!isDetailsVisible && (
            <div className="col-span-3 flex flex-col mt-10">
              {isUserComponent && <UserDetailCard clickedItem={clickedItem} />}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default NumberingSectionsCard;
