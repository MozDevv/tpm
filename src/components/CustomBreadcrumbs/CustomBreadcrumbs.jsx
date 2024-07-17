import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ArrowForward, ArrowForwardIos } from "@mui/icons-material";

const CustomBreadcrumbs = ({ currentStep }) => {
  const steps = [
    { label: "General Information", step: 1 },
    { label: "Bank Details", step: 2 },
    { label: "Work History", step: 3 },
    { label: "Documents", step: 4 },
  ];

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <Typography
          variant="body2"
          style={{
            color: "#6D6D6D",
            fontSize: "13px",
          }}
        >
          <ArrowForwardIos
            sx={{
              fontSize: "12px",
              color: "#6D6D6D",
            }}
          />
        </Typography>
      }
      sx={{ marginTop: 4, marginLeft: 2 }}
    >
      {steps.map((item) => (
        <Link
          key={item.step}
          color={currentStep === item.step ? "primary" : "#6D6D6D"}
          style={{
            fontWeight: currentStep === item.step ? "bold" : "normal",
            padding: currentStep === item.step ? "5px 10px" : "0",
            borderRadius: "5px",
            textDecoration: "none",
          }}
        >
          {item.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
