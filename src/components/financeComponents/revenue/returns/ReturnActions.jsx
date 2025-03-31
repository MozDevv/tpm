import React, { useEffect, useState } from 'react';
import {
  Button,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Alert, message } from 'antd';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { truncateMessage } from '@/utils/handyFuncs';
import { parseDate } from '@/utils/dateFormatter';

function ReturnActions({
  selectedRows,
  setSelectedRows,
  setOpenPostGL,
  clickedItem,
  status,
  postApiFunction,
  postApiService,
  isReceiptVoucher,
}) {
  const [errors, setErrors] = useState({ status: false, message: '' });

  useEffect(() => {
    if (clickedItem) {
      setSelectedRows([clickedItem]);
    }
  }, [clickedItem, setSelectedRows]);

  const handlePostToGL = async () => {
    const selectedIds = selectedRows.map((journal) => ({
      receiptId: journal.id,
    }));

    try {
      const res = await postApiService(postApiFunction, {
        receiptList: selectedIds,
      });
      if (res.status === 200 && res.data.succeeded) {
        message.success('Receipt(s) Posted to Ledger successfully');
        setOpenPostGL(false);
        setSelectedRows([]);
      } else if (res.status === 200 && !res.data.succeeded) {
        message.error(res.data.message[0]);
      }
    } catch (error) {
      console.error('Error processing action:', error);
      message.error(
        'An unexpected error occurred while processing the action.'
      );
    }
  };

  const navTitle = (() => {
    switch (status) {
      case 0:
        return 'Create';
      case 2:
        return 'Post';
    }
  })();

  return (
    <div className="p-5">
      <div className="flex px-3 flex-col">
        <div className="flex items-center gap-2">
          <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
            Post Reciept(s)
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
        {selectedRows.length > 0 && (
          <div className="py-3 mx-5 flex flex-col">
            <TableContainer sx={{ maxHeight: '400px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Document No</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell align="right">Return Date</TableCell>
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
                      <TableCell>{doc.totalAmount}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {parseDate(doc.returnDate)}
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
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}

export default ReturnActions;
