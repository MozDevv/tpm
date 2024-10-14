import React, { useEffect } from 'react';
import {
  List,
  Card,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import workflowsEndpoints, {
  workflowsApiService,
} from '@/components/services/workflowsApi';
import { useAuth } from '@/context/AuthContext';
import authEndpoints, { AuthApiService } from '@/components/services/authApi';
import { ArticleOutlined, LaunchOutlined } from '@mui/icons-material';
import { Empty } from 'antd';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';

function DueForApproval() {
  const [rowData, setRowData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const { auth } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const userId = auth.user ? auth.user.userId : null;

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchRowData = async () => {
    // Fetch data from API
    try {
      const res = await workflowsApiService.post(
        workflowsEndpoints.getUserApprovals,
        {
          userId,
        }
      );
      console.log(
        res.data.data,
        'Approvals data here ****************************'
      );
      // Update rowData state with fetched data
      setRowData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers);
      if (res.status === 200) {
        setUsers(res.data.data);
        fetchRowData();
      }

      console.log('User details fetched successfully:', res.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const [openApprove, setOpenApprove] = React.useState(0);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const baseCardHandlers = {
    approvalRequest: () => console.log('Approval Request clicked'),

    approveDocument: () => setOpenApprove(3),
    rejectDocumentApproval: () => setOpenApprove(4),
    delegateApproval: () => {
      setOpenApprove(5);
    },
  };
  useEffect(() => {
    fetchRowData();
  }, [openBaseCard, openApprove]);

  const fields = [
    { name: 'documentNo', label: 'Document No', type: 'text', disabled: true },
    { name: 'comments', label: 'Comments', type: 'text', disabled: true },
    {
      name: 'senderId',
      label: 'Sender',
      type: 'select',
      options: users.map((user) => ({ id: user.id, name: user.name })),
      disabled: true,
    },
    { name: 'dateSent', label: 'Date Sent', type: 'date', disabled: true },
  ];

  return (
    <div className="">
      <BaseApprovalCard
        clickedItem={clickedItem}
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={clickedItem?.documentNo}
      />
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={clickedItem?.documentNo}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        <BaseInputCard
          fields={fields}
          clickedItem={clickedItem}
          useRequestBody={true}
          setOpenBaseCard={setOpenBaseCard}
        />
      </BaseCard>

      <Card
        sx={{
          backgroundColor: 'white',
          height: '450px',
          borderRadius: '20px',
          p: '10px',
          m: '0 20px',
        }}
      >
        <Box
          sx={{
            ml: '20px',
            fontWeight: 600,
          }}
        >
          <div className="flex flex-row w-full items-center justify-between">
            <div className="text-base font-semibold p-3 text-gray-700">
              Documents Pending Approvals
            </div>
            <Button
              size="small"
              sx={{ maxHeight: '24px', fontSize: '12px' }}
              endIcon={<LaunchOutlined />}
            >
              View All
            </Button>
          </div>
        </Box>
        <List>
          {Array.isArray(rowData) && rowData.length > 0 ? (
            <>
              {' '}
              {rowData.map((item) => (
                <ListItem key={item.documentNo} sx={{ alignItems: 'center' }}>
                  <ListItemAvatar>
                    <ArticleOutlined
                      sx={{ height: '25px', width: '25px', color: '#C0C0C0' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      fontSize: '12px',
                      color: '#006990',
                      ml: '-20px',
                    }}
                    primary={
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'underline',
                        }}
                      >
                        {item.documentNo}
                      </Typography>
                    }
                  />
                  <ListItemText
                    sx={{ fontSize: '12px', color: 'gray', ml: '3px' }}
                    primary={
                      <Typography sx={{ fontSize: '13px' }}>
                        {new Date(item.dateSent).toLocaleDateString()}
                      </Typography>
                    }
                  />

                  <Button
                    variant="contained"
                    sx={{
                      marginLeft: 1,
                      maxHeight: '20px',
                      textTransform: 'none',
                      fontSize: '12px',
                    }}
                    onClick={() => {
                      setOpenBaseCard(true);
                      setClickedItem(item);
                    }}
                  >
                    view
                  </Button>
                </ListItem>
              ))}
            </>
          ) : (
            <div className="mt-20">
              <Empty description="" />
            </div>
          )}
        </List>
      </Card>
    </div>
  );
}

export default DueForApproval;
