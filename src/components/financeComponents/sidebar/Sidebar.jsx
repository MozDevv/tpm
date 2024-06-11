"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import styles from "./sidebar.module.css";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { PeopleAltOutlined } from "@mui/icons-material";
import { useSelectedItem } from "@/context/NavItemContext";
import { useIsLoading } from "@/context/LoadingContext";

function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState({});
  const { selectedItem, setSelectedItem } = useSelectedItem();
  const { isLoading, setIsLoading } = useIsLoading();

  const handleToggle = (title) => {
    setSelectedItem(title);
    setOpen((prevOpen) => ({
      ...prevOpen,
      [title]: !prevOpen[title],
    }));
  };

  const menuItems = [
    {
      title: "Overview",
      path: "/finance",
      icon: <DashboardOutlinedIcon />,
    },
    {
      title: "Charts of Accounts",
      path: "/finance/chartsofaccounts",
      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Charts of Accounts List",
          path: "/finance/chartsofaccounts/list",
        },
        {
          title: "Charts of Accounts Record Creation",
          path: "/finance/chartsofaccounts/recordcreation",
        },
      ],
    },
    {
      title: "Cash Management",
      path: "/cashmanagement",
      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Bank Account List",
          path: "/cashmanagement/list",
        },
        {
          title: "Bank Account Card",
          path: "/cashmanagement/recordcreation",
        },
      ],
    },
    {
      title: "Bank Reconciliation",
      path: "/bankreconciliaton",
      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Bank Reconciliaton List",
          path: "/bankreconciliaton/list",
        },
        {
          title: "Bank Reconciliation Card",
          path: "/bankreconciliaton/card",
        },
      ],
    },
    {
      title: "Payables Management",
      path: "/payablesmanagement",
      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Payable Vendors List",
          path: "/payablesmanagement/vendorslist",
        },
        {
          title: "Payables Card",
          path: "/payablesmanagement/card",
        },
        {
          title: "Purchase Invoices",
          path: "/payablesmanagement/invoices",
        },
      ],
    },
  ];

  const handleNavigation = async (path, title) => {
    try {
      setIsLoading(true);
      setSelectedItem(title);
      await router.push(path);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <img src="/logo.png" alt="" height={200} width={400} />
      <h6 className={styles.h6}>MAINMENU</h6>
      <List sx={{ mt: "10px" }} component="nav">
        {menuItems.map((item) => (
          <div key={item.title}>
            <ListItem
              button
              onClick={() =>
                item.children
                  ? handleToggle(item.title)
                  : handleNavigation(item.path, item.title)
              }
              sx={{
                mb: "5px",
                borderRadius: "30px",
                mr: "10px",

                backgroundColor: selectedItem === item.title && "#E5F0F4",
                color:
                  selectedItem === item.title
                    ? "#006990"
                    : "rgb(153, 153, 153);",
                "&:hover": {
                  backgroundColor: "rgba(0, 105, 144, 0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedItem === item.title ? "#006990" : "gray",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <p className={styles.nav_title}>{item.title}</p>
              </ListItemText>
              {item.children ? (
                open[item.title] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItem>
            {open[item.title] && <Divider orientation="vertical" />}
            {item.children && (
              <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {" "}
                  {item.children.map((child) => (
                    <ListItem
                      button
                      key={child.title}
                      onClick={() => handleNavigation(child.path, child.title)}
                      sx={{
                        pl: 7,
                        py: "3px",
                        color:
                          selectedItem === child.title ? "#006990" : "gray",
                        "&:hover": {
                          backgroundColor: "rgba(0, 105, 144, 0.1)",
                        },
                      }}
                    >
                      <ListItemText sx={{ ml: 2 }}>
                        <Typography fontSize={13} fontWeight={600}>
                          {child.title}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
      <Divider />
      <Box>
        <h6 className={styles.h6}>ADMINISTRATION</h6>
        <List>
          <ListItem button onClick={() => handleToggle("Users & Teams")}>
            <ListItemIcon>
              <IconButton
                sx={{
                  height: "27px",
                  width: "27px",
                  borderRadius: "3px",
                  backgroundColor: "#006990",
                }}
              >
                <PeopleAltOutlined sx={{ color: "white", fontSize: "16px" }} />
              </IconButton>
            </ListItemIcon>
            <ListItemText
              sx={{
                color:
                  selectedItem === "Users & Teams"
                    ? "#006990"
                    : "rgb(153, 153, 153);",
              }}
            >
              <p className={styles.nav_title}>Users & Teams</p>
            </ListItemText>
            {open["Users & Teams"] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open["Users & Teams"]} timeout="auto" unmountOnExit>
            <List sx={{ ml: 2, mt: -1 }} component="div" disablePadding>
              <ListItem
                button
                onClick={() =>
                  handleNavigation("/dashboard/users/", "User List")
                }
                sx={{
                  pl: 5,
                  color: selectedItem === "User List" ? "#006990" : "gray",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemText sx={{ ml: 2 }}>
                  <p className={styles.nav_title}>User List</p>
                </ListItemText>
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  handleNavigation(
                    "/dashboard/users/leave-management",
                    "User Management"
                  )
                }
                sx={{
                  mt: -1,
                  pl: 5,
                  color:
                    selectedItem === "User Management" ? "#006990" : "gray",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemText sx={{ ml: 2 }}>
                  <p className={styles.nav_title}>Users Leave Management</p>
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Box>
    </>
  );
}

export default Sidebar;
