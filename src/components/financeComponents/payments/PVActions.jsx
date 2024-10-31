import { parseDate } from '@/utils/dateFormatter';
import {
  Button,
  DialogActions,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { Alert, List, message } from 'antd';
import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { formatNumber } from '@/utils/numberFormatters';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { CheckCircleOutline } from '@mui/icons-material';
import { truncateMessage } from '@/utils/handyFuncs';

function PVActions({
  selectedRows,
  setSelectedRows,
  setOpenPostGL,
  setOpenBaseCard,
  clickedItem,
  isSchedule,
  status,
}) {
  const [errors, setErrors] = React.useState({
    status: false,
    message: '',
  });

  useEffect(() => {
    if (clickedItem) {
      setSelectedRows([clickedItem]);
    }
  }, [clickedItem, setSelectedRows]);
  const handlePostToGL = async () => {
    const selectedIds = selectedRows.map((journal) => ({
      id: journal.id,
    }));

    try {
      let endpoint;
      let successMessage;
      let errorMessage;
      let requestData;

      if (status === 2) {
        if (isSchedule) {
          console.log('isSchedule >>', isSchedule);
          // Case for scheduling
          endpoint = financeEndpoints.createPaymentSchedule;
          successMessage = 'Payment Vouchers scheduled successfully';
          errorMessage = 'Failed to schedule Payment Vouchers';
          requestData = {
            payments: selectedIds.map((item) => ({ paymentsId: item.id })),
          };

          // Make the API call for scheduling
          const res = await apiService.post(endpoint, requestData);

          if (res && res.data && res.data.succeeded && res.status === 200) {
            setSelectedRows([]);
            setOpenPostGL(false);
            setOpenBaseCard && setOpenBaseCard(false);
            message.success(successMessage);
          } else if (
            res &&
            res.data &&
            res.data.messages.length > 0 &&
            !res.data.succeeded
          ) {
            setErrors({
              status: true,
              message: res.data.messages[0],
            });
            message.error(truncateMessage(res.data.messages[0], 100));
          } else {
            message.error(errorMessage);
          }
        } else {
          endpoint = financeEndpoints.postPaymentToLedger;
          successMessage = 'Payment Voucher(s) Posted to Legder successfully';
          errorMessage = 'Failed to post Payment Vouchers';
          requestData = {
            paymentsList: selectedIds.map((item) => ({ paymentId: item.id })),
          };
          // Make the API call for scheduling
          const res = await apiService.post(endpoint, requestData);

          if (res && res.data && res.data.succeeded && res.status === 200) {
            setSelectedRows([]);
            setOpenPostGL(false);
            setOpenBaseCard && setOpenBaseCard(false);
            message.success(successMessage);
          } else if (
            res &&
            res.data &&
            res.data.messages.length > 0 &&
            !res.data.succeeded
          ) {
            setErrors({
              status: true,
              message: res.data.messages[0],
            });
            message.error(truncateMessage(res.data.messages[0], 100));
          } else {
            message.error(errorMessage);
          }

          return; // Exit the function after processing case 2 actions
        }
      } else if (status === 3) {
        endpoint = financeEndpoints.postScheduledPaymentToLedger;
        successMessage = 'Payment Vouchers Posted successfully';
        errorMessage = 'Failed to schedule Payment Vouchers';
        requestData = {
          paymentSchedulesList: selectedIds.map((item) => ({
            paymentScheduleId: item.id,
          })),
        };

        // Make the API call for scheduling
        const res = await apiService.post(endpoint, requestData);

        if (res && res.data && res.data.succeeded && res.status === 200) {
          setSelectedRows([]);
          setOpenPostGL(false);
          setOpenBaseCard && setOpenBaseCard(false);
          message.success(successMessage);
        } else if (
          res &&
          res.data &&
          res.data.messages.length > 0 &&
          !res.data.succeeded
        ) {
          setErrors({
            status: true,
            message: res.data.messages[0],
          });
          message.error(truncateMessage(res.data.messages[0], 100));
        } else {
          message.error(errorMessage);
        }
      } else {
        const processRequests = selectedIds.map(async ({ id }) => {
          switch (status) {
            case 0:
              endpoint = financeEndpoints.submitPVforApproval(id);
              successMessage =
                'Payment Voucher submitted for approval successfully';
              errorMessage = 'Failed to submit Payment Voucher for approval';
              break;
            case 1:
              endpoint = financeEndpoints.approvePv(id);
              successMessage = 'Payment Voucher approved successfully';
              errorMessage = 'Failed to approve Payment Voucher';
              break;
            case 3:
              endpoint = financeEndpoints.postPaymentVoucher(id);
              successMessage = 'Payment Voucher posted successfully';
              errorMessage = 'Failed to post Payment Voucher';
              break;
            default:
              message.error('Invalid action');
              return;
          }

          // Make API call for each ID
          const res = await apiService.post(endpoint);

          if (res && res.data && res.data.succeeded && res.status === 200) {
            return { success: true, id };
          } else if (
            res &&
            res.data &&
            res.data.messages.length > 0 &&
            !res.data.succeeded
          ) {
            setErrors({
              status: true,
              message: res.data.messages[0],
            });
            message.error(truncateMessage(res.data.messages[0], 100));
            return { success: false, id };
          } else {
            message.error(errorMessage);
            return { success: false, id };
          }
        });

        // Execute all individual requests concurrently
        const results = await Promise.all(processRequests);
        const allSucceeded = results.every(
          (result) => result && result.success
        );

        if (allSucceeded) {
          setSelectedRows([]);
          setOpenPostGL(false);
          setOpenBaseCard && setOpenBaseCard(false);
          message.success(successMessage);
        } else {
          message.error('Some actions failed, please check the details above.');
        }
      }
    } catch (error) {
      console.error('Error processing action:', error);
      message.error(
        'An unexpected error occurred while processing the action.'
      );
    }
  };

  const navTitle =
    status === 0
      ? 'Submit'
      : status === 1
      ? 'Approve'
      : status === 2
      ? isSchedule
        ? 'Schedule'
        : 'Post to Ledger'
      : status === 3
      ? 'Post'
      : 'Post';

  return (
    <div className="p-5">
      <div className="flex  px-3 flex-col">
        <div className="flex items-center gap-2">
          <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
            {navTitle} Payment Voucher(s) {status === 0 && 'for Approval'}
          </h5>
        </div>
        {errors.status && (
          <div className="w-full mt-2">
            <Alert
              message={truncateMessage(errors.message, 100)}
              type="error"
              showIcon
              closable
            />
          </div>
        )}
        {/* {JSON.stringify(selectedRows)} */}

        {selectedRows.length > 0 && (
          <div className="py-3 mx-5 flex flex-col">
            <div className="text-primary mt-3 text-[15px] font-normal mb-6"></div>

            <TableContainer sx={{ maxHeight: '400px' }}>
              {status === 3 ? (
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Schedule No</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell align="right">Schedule Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRows.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            color: '#006990',
                            textDecoration: 'underline',
                          }}
                        >
                          {doc.scheduleNo}
                        </TableCell>

                        <TableCell align="center">{doc.totalAmount}</TableCell>

                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {parseDate(doc.scheduleDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document No</TableCell>
                      <TableCell>On Behalf Of</TableCell>
                      <TableCell align="right">Payee</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRows.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontWeight: 'bold',
                            color: '#006990',
                            textDecoration: 'underline',
                          }}
                        >
                          {doc.documentNo}
                        </TableCell>

                        <TableCell>{doc.onBehalfOf}</TableCell>

                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {doc.payee}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </div>
        )}
      </div>
      <DialogActions
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          px: '25px',
          mt: '20px',
        }}
      >
        <Button
          onClick={() => {
            setOpenPostGL(false);
            setSelectedRows([]);
          }}
          color="error"
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePostToGL}
          color="primary"
          variant="contained"
          size="small"
        >
          {navTitle}
        </Button>
      </DialogActions>
    </div>
  );
}

export default PVActions;
