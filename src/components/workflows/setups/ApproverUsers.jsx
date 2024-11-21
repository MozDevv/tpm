import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import endpoints, { apiService } from '@/components/services/setupsApi';

function ApproverUsers() {
  const [users, setUsers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await apiService.get(endpoints.getApprovalUsers);
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
        const res = await apiService.get(endpoints.getUsers);
        const usersData = res.data.data.map((item) => ({
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

    const fetchData = async () => {
      await fetchApprovers();
      await fetchUsers();
    };

    fetchData();
  }, []);

  const approverDetails = approvers.map((approver) => {
    const user = users.find((user) => user.id === approver.userId);
    return user ? { ...approver, ...user } : approver;
  });

  const columnDefs = [
    {
      headerName: 'First Name',
      field: 'firstName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      sortable: true,
      filter: true,
    },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'MDA ID', field: 'mdaId', sortable: true, filter: true },
    { headerName: 'Role ID', field: 'roleId', sortable: true, filter: true },
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
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add More Approvers
      </Button>
      <div
        className="ag-theme-quartz"
        style={{ height: 400, width: '100%', marginTop: 20 }}
      >
        <AgGridReact
          rowData={approverDetails}
          columnDefs={columnDefs}
          pagination={false}
          domLayout="autoHeight"
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add More Approvers</DialogTitle>
        <DialogContent>
          <div
            className="ag-theme-quartz"
            style={{ height: 400, width: '100%' }}
          >
            <AgGridReact
              rowData={users}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              rowSelection="single"
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
