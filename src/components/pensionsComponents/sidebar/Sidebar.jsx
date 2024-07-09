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
import { Box, Divider } from "@mui/material";
import { BarChart, Payments, SupportAgent } from "@mui/icons-material";
import { useSelectedItem } from "@/context/NavItemContext";
import { useIsLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

function Sidebar() {
  const [open, setOpen] = useState({});
  const { selectedItem, setSelectedItem } = useSelectedItem();
  const { isLoading, setIsLoading } = useIsLoading();

  const handleToggle = (title) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [title]: !prevOpen[title],
    }));
  };

  useEffect(() => {
    const allItems = [...menuItems, ...adminItems];
    const allChildren = allItems
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

  const { auth } = useAuth();

  console.log("first", auth);

  const getMenus = async (role) => {
    try {
      if (!role) {
        throw new Error("Role is not defined");
      }
      const res = await axios.get(
        `https://pmis.agilebiz.co.ke/GetMenuJSON?Role=${role}`
      );

      console.log("sidebar Items", res.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.log("Error response:", error.response);
      } else if (error.request) {
        // Request was made but no response was received
        console.log("Error request:", error.request);
      } else {
        // Something else happened while setting up the request
        console.log("Error message:", error.message);
      }
      console.log("Role:", role);
    }
  };

  useEffect(() => {
    getMenus(auth?.user?.roles);
  }, [auth?.user?.roles]);

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
          title: "Retirees",

          subChildren: [
            {
              title: "Retirees List",
              path: "/pensions/preclaims/listing",
            },
            {
              title: "Unnotified Retirees",
              path: "/pensions/preclaims/listing/unnotified",
            },
            {
              title: "Notified Retirees",
              path: "/pensions/preclaims/listing/notified",
            },
            {
              title: "Submissions",
              path: "/pensions/preclaims/listing/submissions",
            },
          ],
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
          title: "Pending Approvals",
          path: "/pensions/preclaims/approvals",
        },
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
          title: "Departments Setups",
          path: "/pensions/users/setups/departments-setups",
        },
        {
          title: "Roles Setups",
          path: "/pensions/users/setups/roles-setups",
        },
        {
          title: "Permissions Setups",
          path: "/pensions/users/setups/permissions-setups",
        },
        {
          title: "Menus",
          path: "/pensions/setups/menus",
        },
        {
          title: "Tables Setups",
          path: "/pensions/users/setups/tables-setups",
        },

        {
          title: "Roles & Permissions",
          path: "/pensions/users/roles-permissions",
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
        {
          title: "Counties",
          path: "/pensions/setups/banks",
        },
        {
          title: "Constituencies",
          path: "/pensions/setups/banks",
        },
      ],
    },
  ];

  const renderSubChildren = (subChildren) => (
    <List component="div" disablePadding>
      {subChildren.map((subChild) => (
        <Link
          href={subChild.path}
          className="no-underline hover:no-underline"
          key={subChild.title}
        >
          <ListItem
            button
            onClick={() => setSelectedItem(subChild.title)}
            sx={{
              pl: 11,
              py: "3px",

              color:
                selectedItem === subChild.title
                  ? "#006990"
                  : "rgb(153, 153, 153)",
              "&:hover": {
                backgroundColor: "rgba(0, 105, 144, 0.1)",
              },
            }}
          >
            <ListItemText>
              <p className={styles.nav_title}>{subChild.title}</p>
            </ListItemText>
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const renderChildren = (children) => (
    <List component="div" disablePadding>
      {children.map((child) => (
        <div key={child.title}>
          {!child.path ? (
            <>
              <ListItem
                button
                onClick={() => handleToggle(child.title)}
                sx={{
                  pl: 10,
                  py: "5px",
                  borderRadius: "30px",

                  //  backgroundColor: open[child.title] ? "#E5F0F4" : "transparent",
                  color: open[child.title] ? "#006990" : "rgb(153, 153, 153)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemText
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  <p className={styles.nav_title}>{child.title}</p>
                </ListItemText>
                {child?.subChildren ? (
                  open[child.title] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItem>
            </>
          ) : (
            <>
              <Link
                href={child.path}
                className="no-underline hover:no-underline"
                key={child.title}
              >
                <ListItem
                  button
                  onClick={() => setSelectedItem(child.title)}
                  sx={{
                    pl: 10,
                    py: "5px",
                    borderRadius: "30px",

                    //  backgroundColor: open[child.title] ? "#E5F0F4" : "transparent",
                    color:
                      selectedItem === child.title
                        ? "#006990"
                        : "rgb(153, 153, 153)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 105, 144, 0.1)",
                    },
                  }}
                >
                  <ListItemText
                    sx={{ display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <p className={styles.nav_title}>{child.title}</p>
                  </ListItemText>
                  {child?.subChildren ? (
                    open[child.title] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItem>{" "}
              </Link>
            </>
          )}
          {child.subChildren && (
            <Collapse in={open[child.title]} timeout="auto" unmountOnExit>
              {renderSubChildren(child.subChildren)}
            </Collapse>
          )}
        </div>
      ))}
    </List>
  );

  return (
    <div className="pb-8">
      <div className="sticky top-0 bg-white z-50">
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
                  onClick={() => setSelectedItem(item.title)}
                  sx={{
                    mb: "5px",
                    backgroundColor:
                      selectedItem === item.title ? "#E5F0F4" : "transparent",
                    borderRadius: "30px",
                    color:
                      selectedItem === item.title
                        ? "#006990"
                        : "rgb(153, 153, 153)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 105, 144, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        selectedItem === item.title
                          ? "#006990"
                          : "rgb(153, 153, 153)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <p className={styles.nav_title}>{item.title}</p>
                  </ListItemText>
                </ListItem>
              </Link>
            )}
            {item.children && (
              <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                {renderChildren(item.children)}
              </Collapse>
            )}
          </div>
        ))}
      </List>
      <Divider />
      <Box>
        <h6 className={styles.h6}>ADMIN</h6>
        <List sx={{ mt: "10px" }} component="nav">
          {adminItems.map((item) => (
            <div key={item.title}>
              <ListItem
                onClick={() =>
                  item.children
                    ? handleToggle(item.title)
                    : setSelectedItem(item.title)
                }
                sx={{
                  mb: "5px",
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
                  open[item.title] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItem>
              {item.children && (
                <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                  {renderChildren(item.children)}
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
