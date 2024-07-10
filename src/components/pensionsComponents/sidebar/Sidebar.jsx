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
  const [fetchedMenuItems, setFetchedMenuItems] = useState([]);

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

  const getMenus = async (role) => {
    try {
      if (!role) {
        throw new Error("Role is not defined");
      }
      const res = await axios.get(
        `https://pmis.agilebiz.co.ke/GetMenuJSON?Role=${role}`
      );

      setFetchedMenuItems(res.data.data);

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
          title: "Menu Setups",
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

  const filterMenuItems = (items, fetchedItems) => {
    return items
      .map((item) => {
        const fetchedItem = fetchedItems.find(
          (fetched) => fetched.name === item.title
        );
        if (!fetchedItem) return null;

        const children = item.children
          ? filterMenuItems(item.children, fetchedItem.children || [])
          : null;
        return {
          ...item,
          children,
        };
      })
      .filter((item) => item !== null);
  };

  const filteredMenuItems = filterMenuItems(menuItems, fetchedMenuItems);
  const filteredAdminItems = filterMenuItems(adminItems, fetchedMenuItems);

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

              "&:hover": {
                backgroundColor: "rgba(0, 105, 144, 0.1)",
              },
            }}
          >
            <ListItemText
              sx={{
                color: selectedItem === subChild.title ? "#006990" : "#1F1F1F",
              }}
            >
              {subChild.title}
            </ListItemText>
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const renderChildren = (children) => (
    <List component="div" disablePadding>
      {children.map((child) => (
        <React.Fragment key={child.title}>
          {child.subChildren ? (
            <React.Fragment>
              <ListItem
                button
                onClick={() => handleToggle(child.title)}
                sx={{ pl: 10, py: "3px" }}
              >
                <ListItemText
                  sx={{
                    color: open[child.title] ? "#006990" : "#1F1F1F",
                    fontWeight: "700",
                  }}
                >
                  {child.title}
                </ListItemText>
                {open[child.title] ? (
                  <ExpandLess sx={{ color: "gray" }} />
                ) : (
                  <ExpandMore sx={{ color: "gray" }} />
                )}
              </ListItem>
              <Collapse in={open[child.title]} timeout="auto" unmountOnExit>
                {renderSubChildren(child.subChildren)}
              </Collapse>
            </React.Fragment>
          ) : (
            <Link href={child.path} className="no-underline hover:no-underline">
              <ListItem
                button
                onClick={() => setSelectedItem(child.title)}
                sx={{
                  pl: 10,
                  py: "3px",
                  color: selectedItem === child.title ? "#006990" : "#1F1F1F",
                  "&:hover": {
                    backgroundColor: "rgba(0, 105, 144, 0.1)",
                  },
                }}
              >
                <ListItemText
                  sx={{
                    color: selectedItem === child.title ? "#006990" : "#1F1F1F",
                  }}
                >
                  {child.title}
                </ListItemText>
              </ListItem>
            </Link>
          )}
        </React.Fragment>
      ))}
    </List>
  );

  const renderMenuItems = (items) =>
    items.map((item) => (
      <React.Fragment key={item.title}>
        <Link
          href={item.path || "#"}
          className="no-underline hover:no-underline"
        >
          <ListItem
            button
            onClick={() => {
              if (!item.children) {
                setSelectedItem(item.title);
              }
              if (item.children) {
                handleToggle(item.title);
              }
            }}
            sx={{
              mb: "5px",
              backgroundColor:
                open[item.title] || selectedItem === item.title
                  ? "#E5F0F4"
                  : "transparent",
              borderRadius: "30px",
              color:
                open[item.title] || selectedItem === item.title
                  ? "#006990"
                  : "#1F1F1F",
              "&:hover": {
                backgroundColor: "rgba(0, 105, 144, 0.1)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  open[item.title] || selectedItem === item.title
                    ? "#006990"
                    : "#1F1F1F",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                color:
                  open[item.title] || selectedItem === item.title
                    ? "#006990"
                    : "#1F1F1F",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </ListItemText>
            {item.children &&
              (open[item.title] ? (
                <ExpandLess sx={{ color: "gray" }} />
              ) : (
                <ExpandMore sx={{ color: "gray" }} />
              ))}
          </ListItem>
        </Link>
        {item.children && (
          <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
            {renderChildren(item.children)}
          </Collapse>
        )}
      </React.Fragment>
    ));

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <div className="sticky top-0 bg-white z-50">
        <img src="/logo.png" className="w-full h-[60px] pt-2 mb-3 " alt="" />
      </div>
      <List>
        <h6 className={styles.h6}>MAIN MENU</h6>
        {renderMenuItems(filteredMenuItems)}

        <Divider />
        <h6 className={styles.h6}>ADMINISTRATION</h6>
        {renderMenuItems(filteredAdminItems)}
      </List>
    </Box>
  );
}

export default Sidebar;
