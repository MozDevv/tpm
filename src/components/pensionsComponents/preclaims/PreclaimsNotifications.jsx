'use client';
import React, { use, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  MenuItem,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import endpoints from '@/components/services/setupsApi';
import { useAlert } from '@/context/AlertContext';
import { useMda } from '@/context/MdaContext';
import { Checkbox, List, message } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { ExpandLess, KeyboardArrowRight } from '@mui/icons-material';
import useFetchAsync from '@/components/hooks/DynamicFetchHook';

function PreclaimsNotifications({
  isSendNotificationEnabled,
  fetchAllPreclaims,
  openNotification,
  setOpenNotification,
  igcDeathDcouments,

  selectedRows,
}) {
  const [scheduleStartDate, setScheduleStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');
  const [comments, setComments] = useState('');

  const { mdaId } = useMda();

  const handleCancel = () => {
    setOpenNotification(false);
  };

  const { setAlert } = useAlert();

  const formatDateToISOString = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas);
      setMdas(res.data.data);
    } catch (error) {
      console.error('Error fetching MDAs:', error);
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []); // [2]

  const { auth } = useAuth();

  const handleSend = async () => {
    setComments(
      `Notification sent to prospective retiree at ${new Date().toLocaleString()} by ${
        auth?.user?.email
      }`
    );
    const ids = selectedRows.map((row) => row.id);
    const currentDate = new Date();
    const oneMinuteLater = new Date(currentDate.getTime() + 60000); // Adding 1 minute

    const formatDateToISOString = (date) => {
      return date.toISOString();
    };

    if (mdaId === '' || mdaId === null) {
      message.error('Login as an MDA user to send notifications');
      return;
    }

    const data = {
      mda_id: mdaId,
      schedule_start_date: formatDateToISOString(currentDate),
      period_end_date: formatDateToISOString(oneMinuteLater),
      comments: comments,
      lines: ids.map((id) => ({ prospective_pensioner_id: id })),
    };

    try {
      const res = await apiService.post(
        preClaimsEndpoints.sendNotifications,
        data
      );

      if (res.data.succeeded === true) {
        await fetchAllPreclaims();
        setAlert({
          message: 'Record(s) scheduled for notification',
          severity: 'success',
          open: true,
        });

        //  message.success("Notification sent successfully");
      } else {
        if (Array.isArray(res.data.messages) && res.data.messages.length > 0) {
          message.error(res.data.messages[0]);
        } else {
          message.error('Failed to send notification');
        }
      }
    } catch (error) {
      console.log(error.response);
      console.log('data', data);
    } finally {
      setOpenNotification(false);
    }
  };

  const [mdas, setMdas] = useState([]); // [1

  const [awardDocuments, setAwardDocuments] = useState([]);

  const fetchAwardDocuments = async (ids) => {
    try {
      const documentsByRetiree = {};

      for (const id of ids.map((row) => row.id)) {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        const retireeDetails = res.data?.data[0];

        console.log('retireeDetails', retireeDetails);

        if (retireeDetails) {
          const retireeKey = retireeDetails?.personal_number; // Using personal number as the unique key

          // Use igcDeathDocuments if mortality_status === 1
          const documents =
            retireeDetails.mortality_status === 1
              ? igcDeathDcouments.map((doc) => ({
                  id: doc.id,
                  name: doc.documentTypeSetup.name,
                  description: doc.documentTypeSetup.description,
                  required: doc.required,
                  pensioner_upload: doc.front || doc.back,
                  side: doc.front ? 'Front' : doc.back ? 'Back' : null,
                  has_two_sides: doc.documentTypeSetup.has_two_sides,
                }))
              : retireeDetails?.prospectivePensionerDocumentSelections?.map(
                  (selection) => ({
                    id: selection.id,
                    name: selection.documentType.name,
                    description: selection.documentType.description,
                    required: selection.required,
                    pensioner_upload: selection.pensioner_upload,
                    side: selection.side,
                    has_two_sides: selection.documentType.has_two_sides,
                  })
                ) || [];

          documentsByRetiree[retireeKey] = {
            isDeceased: retireeDetails.mortality_status === 1,
            retireeName:
              retireeDetails?.first_name + ' ' + retireeDetails?.surname,
            retireePersonalNumber: retireeDetails?.personal_number,
            documents,
          };
        }
      }

      setAwardDocuments(documentsByRetiree);
    } catch (error) {
      console.error('Error fetching award documents:', error);
    }
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      fetchAwardDocuments(selectedRows);
      // console.log(
      //   "prospectivePensionerDocumentSelections",
      //   selectedRows.map((r) => r.id)
      // );
    }
  }, [selectedRows]);

  const [selectedDocuments, setSelectedDocuments] = useState({});

  const handleCheckboxChange = (retireeKey, docId, checked) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [retireeKey]: {
        ...prev[retireeKey],
        [docId]: checked,
      },
    }));
  };
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.log('awardDocuments', awardDocuments);
  }, [selectedRows]);
  return (
    <Dialog
      open={
        openNotification && isSendNotificationEnabled && selectedRows.length > 0
      }
      onClose={() => setOpenNotification(false)}
      fullWidth
      maxWidth="sm"
      sx={{
        padding: '20px',
      }}
    >
      {/* {JSON.stringify(awardDocuments)} */}
      <div className="p-8">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h5 className="text-[19px] text-primary font-semibold">
              Notify Prospective Retiree(s)
            </h5>
          </div>
        </div>

        {/* {JSON.stringify(awardDocuments)} */}

        {Object.keys(awardDocuments).length > 0 && (
          <div className="py-3 mx-5">
            <div className="text-primary mt-3 text-[15px] font-normal mb-4">
              List of documents to be uploaded by the retiree(s)
            </div>
            {Object.entries(awardDocuments).map(([retireeKey, retiree]) => (
              <div key={retireeKey} className="mb-4">
                <h6 className="text-[16px] font-semibold text-primary flex items-center ">
                  {retiree.retireeName}
                  <IconButton
                    sx={{ zIndex: 1 }}
                    onClick={() => setIsOpen((prevState) => !prevState)}
                  >
                    {isOpen ? (
                      <ExpandLess
                        sx={{ color: 'primary.main', fontSize: '14px' }}
                      />
                    ) : (
                      <KeyboardArrowRight
                        sx={{ color: 'primary.main', fontSize: '14px' }}
                      />
                    )}
                  </IconButton>
                </h6>
                <List
                  size="small"
                  bordered
                  style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    mx: '20px',
                  }}
                  // dataSource={retiree.documents.filter(
                  //   (doc) => doc.pensioner_upload
                  // )}
                  dataSource={
                    retiree.isDeceased
                      ? retiree.documents
                      : retiree.documents.filter((doc) => doc.pensioner_upload)
                  }
                  renderItem={(doc) => (
                    <List.Item>
                      <div className="flex gap-2 items-center">
                        <Checkbox
                          checked={
                            selectedDocuments[retireeKey]?.[doc.id] ?? true
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              retireeKey,
                              doc.id,
                              e.target.checked
                            )
                          }
                        />
                        <p className="font-sans flex gap-2 cursor-pointer">
                          {doc.name}{' '}
                          {doc.has_two_sides && doc.side && (
                            <Chip
                              label={doc.side}
                              size="small"
                              variant="contained"
                              sx={{
                                maxHeight: '20px',
                                fontSize: '9px',
                                mb: '10px',
                                borderWidth: '2px',
                              }}
                              color={
                                doc.side === 'Front' ? 'primary' : 'secondary'
                              }
                            />
                          )}
                        </p>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* <div className="p-6">
          <div>
            <label
              htmlFor="comments"
              className=" text-xs font-medium text-gray-70mo0"
            >
              Comments
            </label>
            <TextareaAutosize
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
              minRows={3}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid gray",
              }}
            />
          </div>
        </div> */}
        <div
          style={{ boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)' }}
          className="flex gap-8 w-full justify-between  sticky bottom-0 pb-6  bg-white pt-6 z-30"
        >
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSend}>
            Notify
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default PreclaimsNotifications;
