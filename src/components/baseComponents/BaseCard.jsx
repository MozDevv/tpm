import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IconButton } from "@mui/material";
import { ArrowBack, OpenInFull } from "@mui/icons-material";

function BaseCard({ openBaseCard, setOpenBaseCard, children, title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const expandSizes = {
    default: {
      minHeight: "55vh",
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
      <div className="flex items-center">
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
        <p className="text-base text-primary font-semibold ">{title}</p>
      </div>
      <div className="">
        {" "}
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

      {children}
    </Dialog>
  );
}

export default BaseCard;
