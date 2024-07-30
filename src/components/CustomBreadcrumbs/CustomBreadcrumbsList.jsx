"use client";
import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { ArrowForwardIos } from "@mui/icons-material";
import { menuItems } from "../baseComponents/data";

const CustomBreadcrumbsList = ({ currentTitle }) => {
  const router = useRouter();

  // Helper function to find breadcrumb steps
  const findBreadcrumbSteps = (items, title) => {
    for (const item of items) {
      if (item.title === title) {
        return [{ label: item.title, path: item.path }];
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.title === title) {
            return [
              { label: item.title, path: item.path },
              { label: child.title, path: child.path },
            ];
          }
          if (child.subChildren) {
            for (const subChild of child.subChildren) {
              if (subChild.title === title) {
                return [
                  { label: item.title, path: item.path },
                  { label: child.title, path: child.path },
                  { label: subChild.title, path: subChild.path },
                ];
              }
            }
          }
        }
      }
    }
    return [];
  };

  const breadcrumbSteps = findBreadcrumbSteps(menuItems, currentTitle);

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };

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
      {breadcrumbSteps.map((step, index) => (
        <Link
          key={index}
          color={currentTitle === step.label ? "primary" : "#6D6D6D"}
          style={{
            fontWeight: currentTitle === step.label ? "bold" : "600",
            padding: currentTitle === step.label ? "5px 10px" : "0",
            fontSize: "15px",
            borderRadius: "5px",
            textDecoration: "none",
            cursor: step.path ? "pointer" : "default",
          }}
          onClick={() => handleNavigation(step.path)}
        >
          {step.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbsList;
