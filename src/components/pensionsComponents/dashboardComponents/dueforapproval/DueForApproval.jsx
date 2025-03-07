import React, { useEffect } from 'react';
import {
  List,
  Card,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArticleOutlined,
  LaunchOutlined,
  OpenInFull,
} from '@mui/icons-material';
import { Empty, Spin } from 'antd';
import { useAuth } from '@/context/AuthContext';
import workflowsEndpoints, {
  workflowsApiService,
} from '@/components/services/workflowsApi';
import authEndpoints, { AuthApiService } from '@/components/services/authApi';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import GeneralBudget from '@/components/financeComponents/generalLedger/generalBudget/GeneralBudget';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import Preclaims from '../../preclaims/Preclaims';
import ListNavigation from '@/components/baseComponents/ListNavigation';

function DueForApproval() {
  const [rowData, setRowData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const { auth } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const userId = auth.user ? auth.user.userId : null;
  const [filteredData, setFilteredData] = React.useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchRowData = async () => {
    try {
      const res = await workflowsApiService.post(
        workflowsEndpoints.getUserApprovals,
        { userId }
      );
      setFilteredData(res.data.data);
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
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const [openApprove, setOpenApprove] = React.useState(0);
  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [openApprovalBase, setOpenApprovalBase] = React.useState(false);
  const [fetchedDoc, setFetchedDoc] = React.useState(null);
  const [searchedValue, setSearchedValue] = React.useState('');
  const [loadingDoc, setLoadingDoc] = React.useState(null);

  const [expand, setExpand] = React.useState(false);

  const [numberingSections, setNumberingSections] = React.useState([
    {
      name: 'PROSPECTIVE PENSIONER',
      section: 0,
      numberSeriesId: 'd0ac4419-44f7-4660-a4d5-9e8f8b82cf9f',
      numberSeries: {
        code: 'Mil',
        description: 'Military No. series',
        id: 'd0ac4419-44f7-4660-a4d5-9e8f8b82cf9f',
        created_by: null,
        created_date: '2024-10-22T17:39:50.990271Z',
        updated_by: null,
        updated_date: null,
      },
      id: '8f8597f2-651c-48b4-bd1d-08cc094154ad',
      created_by: null,
      created_date: null,
      updated_by: null,
      updated_date: '2024-10-22T17:46:07.78948Z',
    },
    {
      name: 'BUDGET',
      section: 23,
      numberSeriesId: '8b9b5f40-0a61-4cdb-847d-58784b91cb70',
      numberSeries: {
        code: 'BGT',
        description: 'BUDGET',
        id: '8b9b5f40-0a61-4cdb-847d-58784b91cb70',
        created_by: 'fa2d588b-d2e4-4eb8-a69b-f61991e7b33d',
        created_date: '2025-01-16T09:18:27.514888Z',
        updated_by: null,
        updated_date: null,
      },
      id: 'ea074def-b666-4264-82cf-60d44d19dfd6',
      created_by: null,
      created_date: null,
      updated_by: 'fa2d588b-d2e4-4eb8-a69b-f61991e7b33d',
      updated_date: '2025-01-16T09:19:31.921456Z',
    },
  ]);

  useEffect(() => {
    fetchRowData();
  }, [openBaseCard, openApprove]);

  const fetchNumberingSections = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getNumberingSections);
      //  setNumberingSections(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNumberingSections();
  }, []);

  // const numberingSections = [
  //   {
  //     name: 'BUDGET',
  //     section: 23,
  //     numberSeriesId: '8b9b5f40-0a61-4cdb-847d-58784b91cb70',
  //     numberSeries: {
  //       code: 'BGT',
  //       description: 'BUDGET',
  //       id: '8b9b5f40-0a61-4cdb-847d-58784b91cb70',
  //       created_by: 'fa2d588b-d2e4-4eb8-a69b-f61991e7b33d',
  //       created_date: '2025-01-16T09:18:27.514888Z',
  //       updated_by: null,
  //       updated_date: null,
  //     },
  //     id: 'ea074def-b666-4264-82cf-60d44d19dfd6',
  //     created_by: null,
  //     created_date: null,
  //     updated_by: 'fa2d588b-d2e4-4eb8-a69b-f61991e7b33d',
  //     updated_date: '2025-01-16T09:19:31.921456Z',
  //   },
  // ];

  const sectionMapper = (sectionName, item) => {
    switch (sectionName) {
      case 'BUDGET':
        return {
          component: (
            <GeneralBudget
              isApproval={true}
              status={1}
              openApprovalBase={openApprovalBase}
              setOpenApprovalBase={setOpenApprovalBase}
              clickedApproval={fetchedDoc}
            />
          ),
          fetchClickedRowEnpoint: financeEndpoints.getBudgetByDocNumber,
          fetchClickedRowApiService: apiService,
        };

      case 'PROSPECTIVE PENSIONER':
        return {
          component: (
            <Preclaims
              status={1}
              isApproval={true}
              openApprovalBase={openApprovalBase}
              setOpenApprovalBase={setOpenApprovalBase}
              clickedApproval={fetchedDoc}
            />
          ),
          fetchClickedRowEnpoint: financeEndpoints.getPreclaimByDocNo,
          fetchClickedRowApiService: apiService,
        };
      // Add more cases here for different section names
      default:
        return { component: <Empty /> };
    }
  };

  const fetchClickedRow = async (item) => {
    let fetchClickedRowEnpoint, fetchClickedRowApiService;
    for (const section of numberingSections) {
      if (item.documentNo.startsWith(section.numberSeries.code)) {
        console.log('Matched section:', section);
        console.log('Item:', item);
        ({ fetchClickedRowEnpoint, fetchClickedRowApiService } = sectionMapper(
          section.name,
          item
        ));
        break;
      }
    }
    setLoadingDoc(item.documentNo);

    try {
      const res = await fetchClickedRowApiService.get(
        fetchClickedRowEnpoint(item.documentNo)
      );
      setFetchedDoc(res.data.data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDoc(null);
    }
  };

  const ComponentToOpen = (documentNo, fetchedDoc) => {
    for (const section of numberingSections) {
      if (documentNo.startsWith(section.numberSeries.code)) {
        return sectionMapper(section.name, fetchedDoc).component;
      }
    }
    return (
      <BaseApprovalCard
        clickedItem={clickedItem}
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={clickedItem?.documentNo}
      />
    );
  };

  const handleSearch = () => {
    const filtered = filteredData.filter((item) =>
      item.documentNo.toLowerCase().includes(searchedValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handlers = {
    search: handleSearch,
  };

  return (
    <div className="">
      {openBaseCard && ComponentToOpen(clickedItem?.documentNo, fetchedDoc)}

      <Dialog
        open={expand}
        maxWidth="lg"
        sx={{
          '& .MuiPaper-root': {
            minHeight: '85vh',
            maxHeight: '75vh',
            minWidth: '70vw',
            maxWidth: '70vw',
            overflow: 'hidden',
          },
          p: 10,
        }}
        onClose={() => setExpand(false)}
      >
        <div className="px-10">
          <div className="flex items-center px-2 pt-4 justify-between w-full sticky top-0 z-[99999999] bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex  w-full items-center mt-6">
                <IconButton
                  sx={{
                    border: '1px solid #006990',
                    borderRadius: '50%',
                    padding: '3px',
                    marginRight: '10px',
                    color: '#006990',
                  }}
                  onClick={() => setExpand(false)}
                >
                  <ArrowBack sx={{ color: '#006990' }} />
                </IconButton>
                <p className="text-lg text-primary font-semibold">
                  Documents Pending Approvals
                </p>
              </div>
              <div className="absolute right-0">
                <IconButton>
                  <Tooltip>
                    <OpenInFull
                      color="primary"
                      sx={{
                        fontSize: '18px',
                        mt: '4px',
                      }}
                    />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col mt-[20px] mb-4 gap-4 ml-2">
            <ListNavigation
              handlers={handlers}
              permissions={[]}
              setSearchedValue={setSearchedValue}
            />
            <Divider sx={{ mx: 2 }} />
          </div>
          <div className="w-full overflow-y-auto h-[70vh]">
            <List sx={{}}>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                <>
                  {filteredData.map((item) => (
                    <ListItem
                      key={item.documentNo}
                      sx={{ alignItems: 'center' }}
                    >
                      <ListItemAvatar>
                        <ArticleOutlined
                          sx={{
                            height: '25px',
                            width: '25px',
                            color: '#C0C0C0',
                          }}
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
                        onClick={async () => {
                          setLoadingDoc(item.documentNo); // Set loading state for this document
                          setClickedItem(item);

                          await fetchClickedRow(item);

                          setLoadingDoc(null); // Reset loading state after fetch
                          setOpenApprovalBase(true);
                          setOpenBaseCard(true);
                        }}
                      >
                        {loadingDoc === item.documentNo ? (
                          <CircularProgress size={16} sx={{ color: 'white' }} /> // Show loader inside button
                        ) : (
                          'View'
                        )}
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
          </div>
        </div>
      </Dialog>

      {/*************************🟢🟢🟢❌❌❌***********************(()) */}
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
          <div className="flex flex-row w/full items-center justify-between">
            <div className="text-base font-semibold p-3 text-gray-700">
              Documents Pending Approvals
            </div>
            <Button
              size="small"
              sx={{ maxHeight: '24px', fontSize: '12px' }}
              endIcon={<LaunchOutlined />}
              onClick={() => setExpand(!expand)}
            >
              View All
            </Button>
          </div>
        </Box>

        <div className="h-[380px] overflow-y-auto ">
          <List sx={{}}>
            {Array.isArray(rowData) && rowData.length > 0 ? (
              <>
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

                        fontSize: '12px',
                      }}
                      onClick={async () => {
                        setLoadingDoc(item.documentNo); // Set loading state for this document
                        setClickedItem(item);

                        await fetchClickedRow(item);

                        setLoadingDoc(null); // Reset loading state after fetch
                        setOpenApprovalBase(true);
                        setOpenBaseCard(true);
                      }}
                      //  disabled={loadingDoc === item.documentNo}
                    >
                      {loadingDoc === item.documentNo ? (
                        <CircularProgress size={16} /> // Show loader inside button
                      ) : (
                        'View'
                      )}
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
        </div>
      </Card>
    </div>
  );
}

export default DueForApproval;
