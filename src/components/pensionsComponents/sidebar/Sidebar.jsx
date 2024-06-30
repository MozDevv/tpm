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
import {
  KeyboardArrowRight,
  PeopleAltOutlined,
  Widgets,
} from "@mui/icons-material";
import styles from "./sidebar.module.css";
import { Box, Divider, IconButton } from "@mui/material";
import { BarChart, Payments, SupportAgent } from "@mui/icons-material";
import { useSelectedItem } from "@/context/NavItemContext";
import { useIsLoading } from "@/context/LoadingContext";

function Sidebar() {
  const [open, setOpen] = useState({});
  const { selectedItem, setSelectedItem } = useSelectedItem();
  const { isLoading, setIsLoading } = useIsLoading();
  const [parentSelected, setParentSelected] = useState("");

  const handleToggle = (title) => {
    setSelectedItem(title);
    setOpen((prevOpen) => ({
      ...prevOpen,
      [title]: !prevOpen[title],
    }));
  };

  useEffect(() => {
    const allChildren = adminItems
      .filter((item) => item.children)
      .flatMap((item) =>
        item.children.map((child) => ({ ...child, parent: item.title }))
      );

    const selectedChild = allChildren.find(
      (child) => child.title === selectedItem
    );

    if (selectedChild) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [selectedChild.parent]: true,
      }));
    }
  }, [selectedItem]);

  useEffect(() => {
    const allChildren = menuItems
      .filter((item) => item.children)
      .flatMap((item) =>
        item.children.map((child) => ({ ...child, parent: item.title }))
      );

    const selectedChild = allChildren.find(
      (child) => child.title === selectedItem
    );

    if (selectedChild) {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [selectedChild.parent]: true,
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
      title: "Preclaims",

      icon: <ArticleOutlinedIcon />,
      children: [
        {
          title: "Preclaims",
          path: "/pensions/preclaims/listing",
        },

        {
          title: "Approvals",
          path: "/pensions/preclaims/approvals",
        },
        {
          title: "Returned Claims",
          path: "/pensions/preclaims/returned-claims",
        },

        {
          title: "Verification",
          path: "/pensions/claims-approval",
        },
      ],
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

  const adminItems = [
    {
      title: "Users & Teams",
      icon: <PeopleAltOutlined />,
      children: [
        {
          title: "User List",
          path: "/pensions/users",
        },
        {
          title: "Leave Management",
          path: "/pensions/users/leave-management",
        },
      ],
    },
    {
      title: "Setups",
      icon: <Widgets />,
      children: [
        {
          title: "Document Types",
          path: "/pensions/setups/document-types",
        },

        {
          title: "Pension Caps",
          path: "/pensions/setups/pension-caps",
        },

        {
          title: "Terms of Service",
          path: "/pensions/setups/termsofservice",
        },
        {
          title: "MDAs",
          path: "/pensions/setups/mdas",
        },
        {
          title: "Pension Awards",
          path: "/pensions/setups/pension-awards",
        },
        {
          title: "Banks",
          path: "/pensions/setups/banks",
        },
      ],
    },
  ];

  return (
    <div className="pb-8">
      <div className="sticky top-0 bg-white z-50">
        {" "}
        <img src="/logo.png" alt="" height={200} width={400} />
      </div>
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
                  /* backgroundColor: item.children
                    ? open[item.title] && selectedItem === item.title
                      ? 
                      : "transparent"
                    : selectedItem === item.title
                    ? "#E5F0F4"
                    : "transparent",*/
                  backgroundColor: open[item.title] ? "#E5F0F4" : "transparent",
                  borderRadius: "30px",
                  color: open[item.title] ? "#006990" : "rgb(153, 153, 153)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: open[item.title] ? "#006990" : "rgb(153, 153, 153)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText>
                  <p className={styles.nav_title}>{item.title}</p>
                </ListItemText>
                {item.children ? (
                  !open[item.title] ? (
                    <KeyboardArrowRight />
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
                    !open[item.title] ? (
                      <KeyboardArrowRight />
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

      {/******************************************  ADMINISTRATION  ********************************************** */}
      <Box>
        <h6 className={styles.h6}>ADMINISTRATION</h6>
        <List sx={{ mt: "10px" }}>
          {adminItems.map((item) => (
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
                    backgroundColor: open[item.title]
                      ? "#E5F0F4"
                      : "transparent",
                    borderRadius: "30px",
                    color: open[item.title] ? "#006990" : "rgb(153, 153, 153)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 105, 144, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: open[item.title]
                        ? "#006990"
                        : "rgb(153, 153, 153)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <p className={styles.nav_title}>{item.title}</p>
                  </ListItemText>
                  {item.children ? (
                    !open[item.title] ? (
                      <KeyboardArrowRight />
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
                      !open[item.title] ? (
                        <KeyboardArrowRight />
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
      </Box>
    </div>
  );
}

export default Sidebar;
