import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tree } from 'antd';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useAlert } from '@/context/AlertContext';
import { BASE_CORE_API } from '@/utils/constants';

const MenuList = ({ roleId, roleName }) => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  const { setAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuItemsResponse, menuRolesResponse] = await Promise.all([
          axios.get(`${BASE_CORE_API}/api/MenuItemsSetup/GetMenuItems`),
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
          setCheckedKeys(findCheckedKeys(formattedData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [roleId]);

  const formatData = (items, menuRoles) => {
    const map = {};
    const treeData = [];

    items.forEach((item) => {
      map[item.menuItemId] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item?.parentMenuId && map[item?.parentMenuId]) {
        map[item?.parentMenuId].children.push(map[item?.menuItemId]);
      } else {
        treeData.push(map[item?.menuItemId]);
      }
    });

    const traverseAndCheck = (data) =>
      data.map((item) => ({
        ...item,
        title: item.name,
        key: item.menuItemId.toString(),
        children:
          item.children.length > 0 ? traverseAndCheck(item.children) : [],
        checked: menuRoles.some((role) => role.name === item.name),
      }));

    return traverseAndCheck(treeData);
  };

  const findCheckedKeys = (data) => {
    const keys = [];
    const traverseTree = (items) => {
      items.forEach((item) => {
        if (item.checked) keys.push(item.key);
        if (item.children && item.children.length > 0)
          traverseTree(item.children);
      });
    };
    traverseTree(data);
    return keys;
  };

  const onCheck = (checkedKeysValue, { node }) => {
    const isChecked = checkedKeysValue.includes(node.key);

    setCheckedKeys(checkedKeysValue);

    handleRoleMenuChange(node.key, isChecked);

    if (node.children && node.children.length > 0) {
      handleChildren(node.children, isChecked);
    }
  };

  const handleChildren = (children, isChecked) => {
    children.forEach((child) => {
      handleRoleMenuChange(child.key, isChecked);
      if (child.children && child.children.length > 0) {
        handleChildren(child.children, isChecked);
      }
    });
  };

  const handleRoleMenuChange = async (menuItemId, isChecked) => {
    if (!menuItemId) return;

    const formData = new FormData();
    formData.append('roleId', roleId);
    formData.append('menuItemId', menuItemId);

    try {
      const res = await apiService.post(endpoints.updateMenuRole, formData);
      if (res.status === 201) {
        setAlert({
          open: true,
          message: `Menu updated for ${roleName} successfully!`,
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating menu role:', error);
    } finally {
      // onCheck(checkedKeys, { node: { key: menuItemId } });
    }
  };

  return (
    <div className="flex justify-between w-full">
      <Tree
        style={{ marginLeft: '20px' }}
        checkable
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
      {/* <div className="mt-4">{JSON.stringify(checkedKeys)}</div> */}
    </div>
  );
};

export default MenuList;
