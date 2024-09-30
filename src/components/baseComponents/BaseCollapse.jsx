import React from "react";
import { Collapse, IconButton } from "@mui/material";
import { KeyboardArrowRight, ExpandLess } from "@mui/icons-material";

const BaseCollapse = ({
  name,
  openSections,
  handleToggleSection,
  children,
}) => {
  return (
    <>
      <div className="flex items-center">
        <p className="text-primary my-5 text-lg px-6 font-bold">{name}</p>
        <IconButton
          sx={{ ml: "-18px", zIndex: 1, mt: "3px" }}
          onClick={() => handleToggleSection(name)}
        >
          {!openSections[name] ? (
            <KeyboardArrowRight
              sx={{ color: "primary.main", fontSize: "14px" }}
            />
          ) : (
            <ExpandLess sx={{ color: "primary.main", fontSize: "14px" }} />
          )}
        </IconButton>
        <hr className="flex-grow border-blue-500 border-opacity-20 mt-1" />
      </div>
      <Collapse in={!openSections[name]} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default BaseCollapse;
