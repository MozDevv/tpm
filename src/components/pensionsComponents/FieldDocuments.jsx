import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextareaAutosize,
  Divider,
  Button,
  Chip,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import endpoints, { apiService } from '../services/setupsApi';
import { Empty, message } from 'antd';
import useFetchAsync from '../hooks/DynamicFetchHook';
import { ArrowBack, Cancel, Verified } from '@mui/icons-material';

export const FieldDocuments = ({
  fieldData,
  clickedItem,
  isPreclaim,
  status,
  handleOnClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comments, setComments] = useState('');
  const [approved, setApproved] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: users } = useFetchAsync(endpoints.getUsers, apiService);

  const handleTabSelection = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchCurrentExitGround = async () => {
    try {
      const res = await apiService.get(
        endpoints.getExitGroundbyId(clickedItem?.exit_grounds)
      );
      if (res.data.succeeded) {
        const documents = res.data.data[0].awardDocuments.map((doc) => ({
          ...doc,
          document: doc.document,
          required: doc.required,
          pensionerUpload: doc.pensioner_upload,
          has_two_sides: doc.has_two_sides,
          front: doc.front,
          back: doc.back,

          verificationSections: doc.verificationSections,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCurrentExitGround();
  }, []);
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });

  if (!fieldData || !fieldData.documents || fieldData.documents.length === 0) {
    return <Typography>No documents available</Typography>;
  }

  const handleTabChange = (event, newIndex) => {
    setSelectedIndex(newIndex);
  };

  const handleApprove = async () => {
    const data = {
      selectionId: fieldData.documents[selectedIndex].selectionId,
      comments,
    };
    try {
      const response = await apiService.post(
        endpoints.verifyPensionerDocument,
        data
      );
      if (response.data.succeeded) {
        message.success('Document approved successfully');
      } else if (
        response.data.succeeded === false &&
        response.data.messages &&
        response.data.messages.length > 0
      ) {
        message.error(response.data.messages[0]);
      } else {
        message.error('An error occurred while approving document');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMatchingVerification = (document, isPreclaim, status) => {
    return document.documentSelectionVerifications.find((verification) => {
      const statusMatch = isPreclaim
        ? verification.prospective_pensioner_notification_status === status
        : verification.claim_stage === status;
      return statusMatch;
    });
  };

  const preclaimsStatus = {
    0: { name: 'UNNOTIFIED', color: '#e74c3c' }, // Light Red
    1: { name: 'SCHEDULED', color: '#f39c12' }, // Bright Orange
    2: { name: 'NOTIFIED', color: '#3498db' }, // Light Blue
    3: { name: 'SUBMITTED', color: '#970FF2' }, // Amethyst
    4: { name: 'IN REVIEW', color: '#970FF2' }, // Carrot Orange
    5: { name: 'PENDING APPROVAL', color: '#1abc9c' }, // Light Turquoise
    6: { name: 'CLAIM CREATED', color: '#49D907' }, // Belize Hole Blue
    7: { name: 'RETURNED FOR CLARIFICATION', color: '#E4A11B' }, // Light Green
  };

  const claimsStatus = {
    0: { name: 'VERIFICATION', color: '#3498db' }, // Light Red
    1: { name: 'VALIDATION', color: '#f39c12' }, // Bright Orange
    2: { name: 'APPROVAL', color: '#2ecc71' }, // Light Blue
    3: { name: 'ASSESSMENT DATA CAPTURE', color: '#f39c12' }, // Bright Orange
    4: { name: 'ASSESSMENT APPROVAL', color: '#2ecc71' }, // Light Blue
    5: { name: 'DIRECTORATE', color: '#f39c12' }, // Bright Orange
    6: { name: 'Controller of Budget', color: '#f39c12' }, // Bright Orange
    7: { name: 'Finance', color: '#2ecc71' }, // Light Blue
    8: { name: 'Voucher Preparation', color: '#f39c12' }, // Bright Orange
    9: { name: 'Voucher Approval', color: '#3498db' }, // Light Blue
    10: { name: 'Voucher Scheduled', color: '#f39c12' }, // Bright Orange
    11: { name: 'Voucher Paid', color: '#8b4513' }, // Light Blue
  };

  const statusIcons = {
    1: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    2: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };

  return (
    <Box sx={{ padding: 3, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        <IconButton
          sx={{
            border: '1px solid #006990',
            borderRadius: '50%',
            padding: '3px',
            marginRight: '10px',
            color: '#006990',
          }}
          onClick={handleOnClose}
        >
          <ArrowBack sx={{ color: '#006990' }} />
        </IconButton>
        Documents for: {fieldData.name}
      </Typography>

      {/* Tab Navigation for Multiple Documents */}
      <Tabs
        value={selectedIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          marginBottom: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: '#006990', // Unselected tab color
          },
          '& .Mui-selected': {
            color: '#006990', // Selected tab color
          },
        }}
      >
        {fieldData.documents.map((doc, index) => (
          <Tab key={index} label={doc.name} />
        ))}
      </Tabs>

      <Grid container>
        {/* Left Side: Document Viewer */}
        <Grid item xs={9}>
          <Card
            sx={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* {fieldData.documents[selectedIndex].fileUrl ? (
              <iframe
                src={fieldData.documents[selectedIndex].fileUrl }
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '8px' }}
                title="Document Preview"
              />
            ) : (
              <Typography >
                No file available for preview
              </Typography>
            )} */}

            <iframe
              src="https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Document Preview"
            />
          </Card>
        </Grid>

        <Grid item xs={3}>
          {/* Right Side: Document Details */}
          <Tabs
            value={selectedTab}
            onChange={handleTabSelection}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              mt: -2,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: '#006990', // Unselected tab color
                p: 0,
              },
              '& .Mui-selected': {
                color: '#006990', // Selected tab color
              },
            }}
          >
            <Tab
              sx={{
                fontSize: '12px',
                p: 0,
              }}
              label="Document Details"
            />
            <Tab
              sx={{
                fontSize: '12px',
                p: 0,
              }}
              label="Approval Details"
            />
          </Tabs>
          {selectedTab === 1 && (
            <div className="p-4">
              <h6 className="text-base font-semibold mb-4 text-primary">
                Verifications
              </h6>
              {fieldData.documents[selectedIndex].documentSelectionVerifications
                .length > 0 ? (
                fieldData.documents[
                  selectedIndex
                ].documentSelectionVerifications.map((verification, index) => {
                  const status =
                    verification.claim_stage !== null
                      ? claimsStatus[verification.claim_stage]
                      : preclaimsStatus[
                          verification.prospective_pensioner_notification_status
                        ];

                  const userDetails = users?.find(
                    (user) => user.id === verification.verified_by_id
                  );

                  const isVerified = verification.verified_by_id !== null;

                  return (
                    <Card
                      key={index}
                      sx={{
                        mb: 2,
                        px: 2,
                        py: '3px',
                        borderLeft: `6px solid ${status.color}`,
                        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Stack spacing={1}>
                        <div className="flex w-full justify-between items-center">
                          <Chip
                            label={status.name}
                            size="small"
                            sx={{
                              backgroundColor: status.color,
                              height: '18px',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '10px',
                              alignSelf: 'start',
                            }}
                          />
                          {isVerified ? (
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Verified
                                style={{
                                  color: '#2e7d32',
                                  marginRight: '3px',
                                  fontSize: '19px',
                                }}
                              />
                              <span
                                style={{
                                  color: '#2e7d32',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                }}
                              >
                                Verified
                              </span>
                            </div>
                          ) : (
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Cancel
                                style={{
                                  color: '#d32f2f',
                                  marginRight: '3px',
                                  fontSize: '19px',
                                }}
                              />
                              <span
                                style={{
                                  color: '#d32f2f',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                }}
                              >
                                Not Verified
                              </span>
                            </div>
                          )}
                        </div>
                        <Typography variant="body2">
                          <strong>Verified By:</strong>
                          {'   '}
                          {userDetails
                            ? `${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`
                            : 'Not Verified'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Email:</strong>
                          {'   '}
                          {userDetails?.email ?? 'Not Verified'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Department:</strong>
                          {'   '}
                          {userDetails?.department?.name ?? 'Not Verified'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date Verified:</strong>
                          {'   '}
                          {new Date(
                            verification.date_verified
                          ).toLocaleDateString()}
                        </Typography>
                        {verification.verification_comments && (
                          <Alert severity="info" sx={{ mt: 1 }}>
                            {verification.verification_comments}
                          </Alert>
                        )}
                      </Stack>
                    </Card>
                  );
                })
              ) : (
                <div className="">
                  <Empty
                    style={{
                      marginTop: '20px',
                    }}
                    description="No verifications available"
                  />
                </div>
              )}
            </div>
          )}

          {selectedTab === 0 && (
            <div className="">
              <div className="">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    Document Details
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                    }}
                  >
                    <strong>Name:</strong>{' '}
                    {fieldData.documents[selectedIndex].name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                    }}
                  >
                    <strong>Description:</strong>{' '}
                    {fieldData.documents[selectedIndex].description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                    }}
                  >
                    <strong>File Type:</strong>{' '}
                    {fieldData.documents[selectedIndex].extenstions}
                  </Typography>
                </CardContent>
              </div>

              <Divider
                sx={{
                  mb: 2,
                }}
              />
              <div className="pl-3 pb-2">
                {fieldData.documents[
                  selectedIndex
                ].documentSelectionVerifications.some((verification) => {
                  const statusMatch = isPreclaim
                    ? verification.prospective_pensioner_notification_status ===
                      status
                    : verification.claim_stage === status;
                  return statusMatch && verification.verified_by_id !== null;
                }) ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Verified
                      style={{
                        color: '#2e7d32',
                        marginRight: '3px',
                        fontSize: '22px',
                      }}
                    />
                    <span
                      style={{
                        color: '#2e7d32',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      Verified
                    </span>
                  </div>
                ) : fieldData.documents[
                    selectedIndex
                  ].documentSelectionVerifications.some((verification) => {
                    const statusMatch = isPreclaim
                      ? verification.prospective_pensioner_notification_status ===
                        status
                      : verification.claim_stage === status;
                    return statusMatch && verification.verified_by_id === null;
                  }) ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Cancel
                      style={{
                        color: '#d32f2f',
                        marginRight: '3px',
                        fontSize: '22px',
                      }}
                    />
                    <span
                      style={{
                        color: '#d32f2f',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      Not Verified
                    </span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {fieldData.documents[
                selectedIndex
              ].documentSelectionVerifications.some((verification) => {
                const statusMatch = isPreclaim
                  ? verification.prospective_pensioner_notification_status ===
                    status
                  : verification.claim_stage === status;
                return statusMatch && verification.verified_by_id !== null;
              }) ? (
                <div className="pl-3">
                  <div className="text-base text-primary font-semibold mb-3">
                    Document Verification & Approval
                  </div>
                  <label
                    htmlFor="comments"
                    className="text-xs font-medium text-gray-700"
                  >
                    Add Comments
                  </label>
                  <TextareaAutosize
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    error={errors.status}
                    minRows={3}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid gray',
                    }}
                  />
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="approveCheckbox"
                        className="mr-2"
                        onChange={(e) => setApproved(e.target.checked)}
                        checked={approved}
                      />
                      <label
                        htmlFor="approveCheckbox"
                        className="text-[12px] text-gray-700"
                      >
                        I hereby reject the validity and accuracy of this
                        document
                      </label>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleApprove}
                      sx={{ mt: 5 }}
                      disabled={!approved} // Disable the button if not approved
                    >
                      Reject Document
                    </Button>
                  </div>
                </div>
              ) : fieldData.documents[
                  selectedIndex
                ].documentSelectionVerifications.some((verification) => {
                  const statusMatch = isPreclaim
                    ? verification.prospective_pensioner_notification_status ===
                      status
                    : verification.claim_stage === status;
                  return statusMatch && verification.verified_by_id === null;
                }) ? (
                <div className="pl-3">
                  <div className="text-base text-primary font-semibold mb-3">
                    Document Verification & Approval
                  </div>
                  <label
                    htmlFor="comments"
                    className="text-xs font-medium text-gray-700"
                  >
                    Add Comments
                  </label>
                  <TextareaAutosize
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    error={errors.status}
                    minRows={3}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid gray',
                    }}
                  />
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="approveCheckbox"
                        className="mr-2"
                        onChange={(e) => setApproved(e.target.checked)}
                        checked={approved}
                      />
                      <label
                        htmlFor="approveCheckbox"
                        className="text-[12px] text-gray-700 "
                      >
                        I hereby approve this document is valid and accurate.
                      </label>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleApprove}
                      sx={{ mt: 5 }}
                      disabled={!approved} // Disable the button if not approved
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
