"use client";
import { createTheme } from "@mui/material/styles";
import { typography } from "./Typography";

const baselightTheme = createTheme({
  palette: {
    primary: {
      main: "#006990",
    },
    secondary: {
      main: "#F3A92A",
    },
    success: {
      main: "#13DEB9",
    },

    text: {
      primary: "#000",
      secondary: "#F3A92A",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
  },
  typography,
  /* components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#0c4f68",
          },
        },
      },
    },
  },*/
});

export { baselightTheme };
