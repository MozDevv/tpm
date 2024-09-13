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
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none", // Remove underline
          "&:focus, &:hover, &:visited, &:link, &:active": {
            textDecoration: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input.Mui-disabled, & .MuiOutlinedInput-input.Mui-disabled":
            {
              color: "rgba(0, 0, 0, 0.7)",
              fontWeight: 500,

              WebkitTextFillColor: "rgba(0, 0, 0, 0.9)",
              backgroundColor: "rgba(0, 0, 0, 0.025)",
            },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "30px", // Adjust row height
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "2px 6px", // Adjust cell padding
        },
        head: {
          height: "30px", // Adjust header cell height if needed
          padding: "2px 6px", // Adjust header cell padding if needed
        },
      },
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
