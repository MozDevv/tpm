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
import BaseExpandCard from '@/components/baseComponents/BaseExpandCard';

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

  const [selectedDocumentsPerId, setSelectedDocumentsPerId] = useState([]);

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
  const [selectedDocuments, setSelectedDocuments] = useState({});

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
    const lines = Object.entries(selectedDocuments).map(
      ([retireeKey, documents]) => ({
        prospective_pensioner_id: retireeKey,
        document_ids: Object.keys(documents).filter(
          (docId) => documents[docId]
        ), // Only include selected document IDs
      })
    );

    const data = {
      mda_id: mdaId,
      schedule_start_date: formatDateToISOString(currentDate),
      period_end_date: formatDateToISOString(oneMinuteLater),
      comments: comments,
      lines,
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
          const retireeKey = retireeDetails?.id; // Using personal number as the unique key

          // Use igcDeathDocuments if mortality_status === 1
          const documents =
            retireeDetails.mortality_status === 1
              ? igcDeathDcouments.map((doc) => ({
                  id: doc.document_type_id,
                  name: doc.documentTypeSetup.name,
                  description: doc.documentTypeSetup.description,
                  required: doc.required,
                  pensioner_upload: doc.front || doc.back,
                  side: doc.front ? 'Front' : doc.back ? 'Back' : null,
                  has_two_sides: doc.documentTypeSetup.has_two_sides,
                }))
              : retireeDetails?.prospectivePensionerDocumentSelections?.map(
                  (selection) => ({
                    id: selection.document_type_id,
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
            retireePersonalNumber: retireeDetails?.id,
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
    <BaseExpandCard
      open={
        openNotification && isSendNotificationEnabled && selectedRows.length > 0
      }
      onClose={() => setOpenNotification(false)}
      title="Schedule Prospective Retiree(s) for Notification"
    >
      {/* {JSON.stringify(awardDocuments)} */}
      <div className="space-y-6 px-6">
        {Object.keys(awardDocuments).length > 0 && (
          <>
            <div className="flex justify-between items-center w-full mt-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-primary">
                  Required Documents
                </h3>
                <p className="text-sm text-primary">
                  Select documents each retiree needs to submit
                </p>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                disabled={Object.keys(selectedDocuments).length === 0}
              >
                Schedule Notification(s)
              </Button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[60vh]">
              {Object.entries(awardDocuments).map(([retireeKey, retiree]) => (
                <div
                  key={retireeKey}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">
                      {retiree.retireeName}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({retiree.documents.length} documents)
                      </span>
                      <span className="ml-2 text-sm font-normal text-green-600">
                        {
                          Object.values(
                            selectedDocuments[retireeKey] || {}
                          ).filter(Boolean).length
                        }{' '}
                        selected
                      </span>
                    </h4>
                    <IconButton>
                      {isOpen ? (
                        <ExpandLess
                          sx={{ color: 'primary.main', fontSize: '20px' }}
                        />
                      ) : (
                        <KeyboardArrowRight
                          sx={{ color: 'primary.main', fontSize: '20px' }}
                        />
                      )}
                    </IconButton>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {retiree.documents.map((doc) => (
                          <label
                            key={doc.id}
                            className="flex items-start space-x-3 rounded p-2 hover:bg-gray-100"
                          >
                            <Checkbox
                              checked={
                                selectedDocuments[retireeKey]?.[doc.id] ?? false
                              }
                              onChange={(e) =>
                                handleCheckboxChange(
                                  retireeKey,
                                  doc.id,
                                  e.target.checked
                                )
                              }
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex flex-1 items-center">
                              <span className="text-sm font-medium text-gray-700">
                                {doc.name}
                              </span>
                              {doc.has_two_sides && doc.side && (
                                <span
                                  className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    doc.side === 'Front'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {doc.side}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </BaseExpandCard>
  );
}

export default PreclaimsNotifications;
