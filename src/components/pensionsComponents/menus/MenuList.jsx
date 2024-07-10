import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tree } from "antd";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

const MenuList = ({ roleId, roleName }) => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const { setAlert } = useAlert();

  useEffect(() => {
    // Fetch menu items and roles based on roleId
    const fetchData = async () => {
      try {
        const [menuItemsResponse, menuRolesResponse] = await Promise.all([
          axios.get("https://pmis.agilebiz.co.ke/GetMenuItems"),
          apiService.get(endpoints.getMenuRole(roleId)),
        ]);

        if (
          menuItemsResponse.data.isSuccess &&
          menuRolesResponse.data.isSuccess
        ) {
          const formattedData = formatData(
            menuItemsResponse.data.data,
            menuRolesResponse.data.data
          );
          setTreeData(formattedData);
          setCheckedKeys(
            findCheckedKeys(formattedData, menuRolesResponse.data.data)
          );
        }
        console.log("roleID", roleId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [roleId]);

  // Function to format data recursively and mark checked items
  const formatData = (items, menuRoles) => {
    const map = {};
    const treeData = [];

    items.forEach((item) => {
      map[item.menuItemId] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parentMenuId) {
        map[item.parentMenuId].children.push(map[item.menuItemId]);
      } else {
        treeData.push(map[item.menuItemId]);
      }
    });

    const traverseAndCheck = (data) => {
      return data.map((item) => ({
        ...item,
        title: item.name,
        key: item.menuItemId.toString(),
        children:
          item.children.length > 0 ? traverseAndCheck(item.children) : null,
        checked: menuRoles.some((role) => role.name === item.name), // Check if item's name is in menuRoles
      }));
    };

    return traverseAndCheck(treeData);
  };

  // Function to find checked keys recursively
  const findCheckedKeys = (data, menuRoles) => {
    const checkedKeys = [];

    const traverseTree = (items) => {
      items.forEach((item) => {
        if (item.checked) {
          checkedKeys.push(item.key);
        }

        if (item.children) {
          traverseTree(item.children);
        }
      });
    };

    traverseTree(data);
    return checkedKeys;
  };

  const onCheck = (checkedKeysValue, { node }) => {
    const menuItemId = node.key;
    const isChecked = checkedKeysValue.includes(menuItemId);

    setCheckedKeys(checkedKeysValue);
    handleRoleMenuChange(menuItemId, isChecked);
  };

  const handleRoleMenuChange = async (menuItemId, isChecked) => {
    if (!menuItemId) return; // Handle no role selected

    const formData = new FormData();
    formData.append("roleId", roleId);
    formData.append("menuItemId", menuItemId);
    // formData.append("isChecked", isChecked); // Indicate whether it's checked or not

    try {
      const res = await apiService.post(endpoints.updateMenuRole, formData);
      console.log(res.data);
      if (res.status === 201) {
        setAlert({
          open: true,
          message: `Menu updated for ${roleName} successfully!`,
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error);
      console.log("formData", formData);
    }
  };

  return (
    <Tree
      style={{ marginLeft: "20px" }}
      checkable
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={treeData}
    />
  );
};

export default MenuList;
