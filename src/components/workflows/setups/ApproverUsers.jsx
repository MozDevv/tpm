import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  DialogTitle,
} from '@mui/material';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { Add, PersonAddAlt1, PersonRemove, Remove } from '@mui/icons-material';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';

function ApproverUsers() {
  const [users, setUsers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mdas, setMdas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedMda, setSelectedMda] = useState('');

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await apiService.get(endpoints.getApprovalUsers, {
          'paging.pageSize': 1000,
        });
        const approversData = res.data.data.map((item) => ({
          userId: item.primary_approver_id,
        }));
        setApprovers(approversData);
      } catch (error) {
        console.error('Error fetching approvers:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await apiService.get(endpoints.getUsers, {
          'paging.pageSize': 1000,
        });
        const usersData = res.data.data.map((item, index) => ({
          no: index,
          id: item.id,
          name: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          mdaId: item.mdaId,
          roleId: item.roleId,
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchMdas = async () => {
      try {
        const res = await apiService.get(endpoints.mdas, {
          'paging.pageNumber': 1,
          'paging.pageSize': 1000,
        });
        setMdas(
          res.data.data.map((mda) => ({
            id: mda.id,
            name: mda.description,
          }))
        );
      } catch (error) {
        console.error('Error fetching MDAs:', error);
        return [];
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await apiService.get(endpoints.getRoles, {
          'paging.pageSize': 1000,
        });
        setRoles(
          res.data.data.map((role) => ({
            id: role.roleId,
            name: role.description,
          }))
        );
      } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
      }
    };

    const fetchData = async () => {
      await fetchApprovers();
      await fetchUsers();
    };

    fetchRoles();
    fetchData();
    fetchMdas();
  }, []);

  const approverDetails = approvers.map((approver) => {
    const user = users.find((user) => user.id === approver.userId);
    return user ? { ...approver, ...user } : approver;
  });

  const filteredUsers = users.filter(
    (user) =>
      (!selectedRole || user.roleId === selectedRole) &&
      (!selectedMda || user.mdaId === selectedMda)
  );

  const columnDefs = [
    {
      headerName: 'No.',
      field: 'no',
      sortable: true,
      filter: true,
      width: 20,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      sortable: true,
      filter: true,
      flex: 1,
    },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'MDA',
      field: 'mdaId',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return params.value
          ? mdas.find((mda) => mda.id === params.value)?.name
          : '';
      },
    },
    {
      headerName: 'Role',
      field: 'roleId',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return params.value
          ? roles.find((role) => role.id === params.value)?.name
          : '';
      },
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddApprover = (selectedUser) => {
    setApprovers((prevApprovers) => [
      ...prevApprovers,
      { userId: selectedUser.id },
    ]);
    handleCloseDialog();
  };

  return (
    <div>
      <div className="flex gap-8 items-center">
        <Button
          variant="text"
          color="primary"
          startIcon={<PersonAddAlt1 />}
          onClick={handleOpenDialog}
        >
          Add More Approvers
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={handleOpenDialog}
          startIcon={<PersonRemove />}
        >
          Remove Approver
        </Button>
      </div>
      <div
        className="ag-theme-quartz min-h-[500px] max-h-[600px] h-[200px] mt-3"
        style={{ height: 400, width: '100%' }}
      >
        <AgGridReact
          rowData={approverDetails}
          columnDefs={columnDefs}
          pagination={false}
          domLayout="normal"
          noRowsOverlayComponent={BaseEmptyComponent}
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '80vh',
            minWidth: '60vw',
            pt: 5,
            px: 5,
          },
        }}
      >
        <DialogTitle className="text-primary font-bold text-lg">
          Select Approvers for this Approval Stage
        </DialogTitle>

        <DialogContent>
          <div className="flex space-x-4 mb-4 mt-4">
            {/* Role Filter */}
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {},
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <InputLabel sx={{ color: 'primary.main' }}>
                Filter by Role
              </InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Filter by Role"
                sx={{
                  height: 45,
                  '& .MuiSelect-icon': { color: 'primary.main' },
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* MDA Filter */}
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {},
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.light',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <InputLabel sx={{ color: 'primary.main' }}>
                Filter by MDA
              </InputLabel>
              <Select
                value={selectedMda}
                onChange={(e) => setSelectedMda(e.target.value)}
                label="Filter by MDA"
                sx={{
                  height: 45,
                  '& .MuiSelect-icon': { color: 'primary.main' },
                }}
              >
                <MenuItem value="">All MDAs</MenuItem>
                {mdas.map((mda) => (
                  <MenuItem key={mda.id} value={mda.id}>
                    {mda.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div
            className="ag-theme-quartz min-h-[600px] max-h-[600px] h-[200px]"
            style={{ height: 400, width: '100%' }}
          >
            <AgGridReact
              rowData={filteredUsers}
              noRowsOverlayComponent={BaseEmptyComponent}
              columnDefs={columnDefs}
              pagination={false}
              paginationPageSize={10}
              rowSelection="single"
              domLayout="normal"
              onRowSelected={(event) => handleAddApprover(event.data)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ApproverUsers;
