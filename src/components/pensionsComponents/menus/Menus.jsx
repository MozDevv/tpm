'use client';
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  Divider,
  Button,
  Typography,
  Grid,
  Checkbox,
  Box,
} from '@mui/material';
import CreatePermission from '../Roles/CreatePermission';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useAlert } from '@/context/AlertContext';
import MenuList from './MenuList';

const Menus = () => {
  const [clickedRole, setClickedRole] = useState(null);
  const [createPermission, setCreatePermission] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permissionRoles, setPermissionRoles] = useState({});

  const fetchMenuItems = async (id) => {
    try {
      const res = await apiService.get(endpoints.getMenuRole(id));
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error.response);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles);
      if (res.status === 200) {
        setRolesList(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const { alert, setAlert } = useAlert();

  return (
    <div className="px-5 mt-6">
      {createPermission && (
        <CreatePermission
          createPermission={createPermission}
          setCreatePermission={setCreatePermission}
        />
      )}
      <div className="flex w-full justify-between items-center">
        <Button variant="contained" color="primary">
          Create Role
        </Button>
      </div>
      <Grid container sx={{ bgcolor: 'white', mt: 4 }}>
        <Grid item xs={2.5} sx={{ maxHeight: '100%' }}>
          <p className="text-primary mb-3 ml-5 mt-5 text-base">Roles</p>
          <Divider />
          <List
            sx={{
              mt: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {rolesList.map((role) => (
              <ListItem
                key={role.roleId}
                onClick={() => {
                  setClickedRole(role);
                  fetchMenuItems(role.roleId);
                }}
                sx={{
                  cursor: 'pointer',
                  py: '12px',
                  borderRadius: '5px',
                  backgroundColor:
                    clickedRole && clickedRole.roleId === role.roleId
                      ? '#E5F0F4'
                      : '',
                }}
              >
                <p className="text-gray-600 font-medium text-[13px]">
                  {role.name}
                </p>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={9.5}>
          {clickedRole ? (
            <div>
              <p className="text-primary mb-5 ml-6 mt-5 text-base font-semibold">
                Sidebar Menu Items allowed for{' '}
                {
                  rolesList.find((role) => role.roleId === clickedRole.roleId)
                    ?.name
                }
              </p>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: '60vh',
                  overflowY: 'auto',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <MenuList
                    roleId={clickedRole.roleId}
                    roleName={clickedRole?.name}
                  />
                </Box>
              </Box>
            </div>
          ) : (
            <>
              <p className="text-gray-400 p-3 font-semibold text-base mt-8 ml-6">
                Select a role to display the allowed Menu Items.
              </p>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Menus;
