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

function PushToFinance({
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
      id: journal.id_claim,
    }));

    console.log('selectedIds >>', selectedIds);

    try {
      let endpoint = financeEndpoints.postClaimtoFinance;
      let successMessage =
        'Claim successfully approved. Check list of payment vouchers to view';
      let errorMessage = 'Error moving claim to finance.';

      const promises = selectedIds.map(async (id) => {
        return apiService.post(endpoint, { ClaimId: id.id });
      });

      const responses = await Promise.all(promises);

      const succeededPromises = responses.filter(
        (res) => res.status === 200 && res.data.succeeded === true
      );

      if (succeededPromises.length === selectedIds.length) {
        message.success(successMessage);
        setOpenPostGL(false);
        setOpenBaseCard(false);
        setSelectedRows([]);
      } else {
        const failedResponses = responses.filter(
          (res) => res.status !== 200 || res.data.succeeded !== true
        );

        if (failedResponses.length > 0) {
          const firstErrorMessage = failedResponses[0].data.messages[0];
          setErrors({
            status: true,
            message: firstErrorMessage,
          });
          message.error(truncateMessage(firstErrorMessage, 100));
        } else {
          message.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error processing action:', error);
      message.error(
        'An unexpected error occurred while processing the action.'
      );
    }
  };

  const navTitle = 'Create Payment Voucher';

  return (
    <div className="p-5">
      <div className="flex  px-3 flex-col">
        <div className="flex items-center gap-2">
          <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
            {navTitle}
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
            <Divider
              sx={{
                my: '5px',
              }}
            />

            <TableContainer sx={{ maxHeight: '400px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Claim No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Pensioner Number</TableCell>
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
                        {doc.claim_id}
                      </TableCell>

                      <TableCell>
                        {doc.first_name} {doc.surname}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {
                          doc?.prospectivePensionerAwards[0]?.pension_award
                            ?.prefix
                        }
                        {doc?.pensioner_number}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
          Proceed
        </Button>
      </DialogActions>
    </div>
  );
}

export default PushToFinance;
