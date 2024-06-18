"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { PeopleAltOutlined } from "@mui/icons-material";
import styles from "./sidebar.module.css";
import { Box, Divider, IconButton } from "@mui/material";
import { BarChart, Payments, SupportAgent } from "@mui/icons-material";
import { useSelectedItem } from "@/context/NavItemContext";
import { useIsLoading } from "@/context/LoadingContext";

function Sidebar() {
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

  useEffect(() => {
    const claimsChildren = ["Claims Management", "Claims Approval"];
    if (claimsChildren.includes(selectedItem)) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        ["Claims"]: true,
      }));
    }
  }, [selectedItem]);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/pensions",
      icon: <DashboardOutlinedIcon />,
    },
    {
      title: "Claims",

      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Claims Management",
          path: "/pensions/claims-management",
        },
        {
          title: "Claims Approval",
          path: "/pensions/claims-approval",
        },
      ],
    },
    {
      title: "Assessment",
      path: "/pensions/assessment",
      icon: <BarChart />,
    },
    {
      title: "Directorate",
      path: "/pensions/directorate",
      icon: <ArticleOutlinedIcon />,
    },
    {
      title: "Controller of Budget",
      path: "/pensions/cob",
      icon: <Payments />,
    },
    {
      title: "Accounts",
      path: "/pensions/accounts",
      icon: <DashboardOutlinedIcon />,
    },
    {
      title: "Customer Relations",
      path: "/pensions",
      icon: <SupportAgent />,
    },
  ];

  return (
    <>
      <img src="/logo.png" alt="" height={200} width={400} />
      <h6 className={styles.h6}>MAINMENU</h6>
      <List sx={{ mt: "10px" }} component="nav">
        {menuItems.map((item) => (
          <div key={item.title}>
            {!item.path ? (
              <ListItem
                onClick={() =>
                  item.children
                    ? handleToggle(item.title)
                    : setSelectedItem(item.title)
                }
                sx={{
                  mb: "5px",
                  backgroundColor: item.children
                    ? open[item.title] && selectedItem === item.title
                      ? "#E5F0F4"
                      : "transparent"
                    : selectedItem === item.title
                    ? "#E5F0F4"
                    : "transparent",
                  borderRadius: "30px",
                  color: item.children
                    ? open[item.title] && selectedItem === item.title
                      ? "#006990"
                      : "rgb(153, 153, 153)"
                    : selectedItem === item.title
                    ? "#006990"
                    : "rgb(153, 153, 153)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.children
                      ? open[item.title] && selectedItem === item.title
                        ? "#006990"
                        : "gray"
                      : selectedItem === item.title
                      ? "#006990"
                      : "gray",
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
            ) : (
              <Link
                href={item.path}
                className="no-underline hover:no-underline"
              >
                <ListItem
                  onClick={() =>
                    item.children
                      ? handleToggle(item.title)
                      : setSelectedItem(item.title)
                  }
                  sx={{
                    mb: "5px",
                    backgroundColor: item.children
                      ? open[item.title] && selectedItem === item.title
                        ? "#E5F0F4"
                        : "transparent"
                      : selectedItem === item.title
                      ? "#E5F0F4"
                      : "transparent",
                    borderRadius: "30px",
                    color: item.children
                      ? open[item.title] && selectedItem === item.title
                        ? "#006990"
                        : "rgb(153, 153, 153)"
                      : selectedItem === item.title
                      ? "#006990"
                      : "rgb(153, 153, 153)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 105, 144, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.children
                        ? open[item.title] && selectedItem === item.title
                          ? "#006990"
                          : "gray"
                        : selectedItem === item.title
                        ? "#006990"
                        : "gray",
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
              </Link>
            )}
            {item.children && (
              <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <Link
                      href={child.path}
                      key={child.title}
                      className="no-underline hover:no-underline"
                    >
                      <ListItem
                        button
                        onClick={() => setSelectedItem(child.title)}
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
                          <p className={styles.nav_title}>{child.title}</p>
                        </ListItemText>
                      </ListItem>
                    </Link>
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
          <Collapse in={open["Users & Teams"]}>
            <List sx={{ ml: 3, pr: 1 }} component="div" disablePadding>
              <Link
                href="/pensions/users/"
                className="no-underline hover:no-underline"
              >
                <ListItem
                  button
                  onClick={() => setSelectedItem("User List")}
                  sx={{
                    p: 0,
                    borderRadius: "10px",
                    ml: 6,
                    py: "3px",
                    px: "3px",
                    color: selectedItem === "User List" ? "#006990" : "gray",
                  }}
                >
                  <ListItemText>
                    <p className={styles.nav_title}>User List</p>
                  </ListItemText>
                </ListItem>
              </Link>
              <Link
                className="no-underline hover:no-underline"
                href="/pensions/users/leave-management"
              >
                <ListItem
                  button
                  onClick={() => setSelectedItem("User Management")}
                  sx={{
                    p: 0,
                    width: "100%",
                    ml: 6,
                    px: "3px",
                    py: "3px",
                    borderRadius: "10px",
                    color:
                      selectedItem === "User Management" ? "#006990" : "gray",
                  }}
                >
                  <ListItemText>
                    <p className={styles.nav_title}>Leave Management</p>
                  </ListItemText>
                </ListItem>
              </Link>
            </List>
          </Collapse>
        </List>
      </Box>
    </>
  );
}

export default Sidebar;
