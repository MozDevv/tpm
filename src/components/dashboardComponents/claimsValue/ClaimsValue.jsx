"use client";
import React from "react";
import { Typography, Box, Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ClaimsValue = () => {
  const theme = useTheme();
  const primary = "#006990";
  const secondary = "#F3A92A";
  const optionsrevenue = {
    grid: {
      show: true,
      borderColor: "rgba(0, 0, 0, .2)",
      color: "#777e89",
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    chart: {
      fontFamily: "DM Sans",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: [primary, secondary],

    xaxis: {
      categories: [
        "16/08",
        "17/08",
        "18/08",
        "19/08",
        "20/08",
        "21/08",
        "22/08",
        "23/08",
      ],
    },
    markers: {
      size: 4,
      border: 1,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      theme: "dark",
    },
    legend: {
      show: false,
    },
  };
  const seriesrevenue = [
    {
      name: "Earnings",
      data: [0, 5, 6, 8, 25, 9, 11, 24],
    },
    {
      name: "Expense",
      data: [0, 3, 1, 2, 8, 1, 5, 1],
    },
  ];
  return (
    <Card
      sx={{
        backgroundColor: "white",
        height: "280px",
        borderRadius: "20px",

        p: "10px",
        mr: "10px",
      }}
    >
      <Box sx={{ fontWeight: 700, pl: "20px", color: "#006990" }}>
        Claims Value
      </Box>
      <Box>
        <Chart
          options={optionsrevenue}
          series={seriesrevenue}
          width={"100%"}
          type="line"
          height="180"
        />
      </Box>
      <Box display="flex" justifyContent="center" mt="15px">
        <Box
          display="flex"
          alignItems="center"
          sx={{
            color: primary,
          }}
        >
          <Box
            sx={{
              backgroundColor: primary,
              borderRadius: "50%",
              height: 8,
              width: 8,
              mr: 1,
            }}
          />
          <Box sx={{ fontSize: "14px" }}>Earnings</Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          ml="10px"
          sx={{
            color: secondary,
          }}
        >
          <Box
            sx={{
              backgroundColor: secondary,
              borderRadius: "50%",
              height: 8,
              width: 8,
              mr: 1,
            }}
          />
          <Box sx={{ fontSize: "14px" }}>Expense</Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ClaimsValue;
