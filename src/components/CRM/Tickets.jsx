'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate } from '@/utils/dateFormatter';
import BaseCRMTable from '../baseComponents/BaseCRMTable';
import useFetchAsync from '../hooks/DynamicFetchHook';
import dayjs from 'dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { message } from 'antd';
import { useRefreshDataStore } from '@/zustand/store';

const Tickets = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const { data: categories } = useFetchAsync(
    endpoints.getServiceCategories,
    apiService
  );
  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
    }));
  };
  const columnDefs = [
    {
      field: 'ticketNumber',
      headerName: 'Ticket Number',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      pinned: 'left', // Pinning to the left ensures it's the first column
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: 'initiatorName',
      headerName: 'Initiator Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'initiatorEmail',
      headerName: 'Initiator Email',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'initiatorPhone',
      headerName: 'Initiator Phone',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'ticketType',
      headerName: 'Ticket Type',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const ticketTypeMap = {
          0: { name: 'Walk In', color: '#1976d2' },
          1: { name: 'Direct Booking', color: '#fbc02d' },
          2: { name: 'Reservation', color: '#2e7d32' },
          3: { name: 'Follow Up', color: '#d32f2f' },
        };
        const ticketType = ticketTypeMap[params.value];
        return ticketType ? (
          <span style={{ color: ticketType.color, fontWeight: 'bold' }}>
            {ticketType.name}
          </span>
        ) : null;
      },
    },
    {
      field: 'appointmentStart',
      headerName: 'Appointment Start',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) =>
        dayjs(params.value).format('YYYY-MM-DD HH:mm'),
    },
    {
      field: 'appointmentEnd',
      headerName: 'Appointment End',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) =>
        dayjs(params.value).format('YYYY-MM-DD HH:mm'),
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const statusMap = {
          0: { name: 'Open', color: '#1976d2' },
          1: { name: 'Pending', color: '#fbc02d' },
          2: { name: 'Re-assigned', color: '#ff9800' },
          3: { name: 'Closed', color: '#2e7d32' },
        };
        const status = statusMap[params.value];
        return status ? (
          <span style={{ color: status.color, fontWeight: 'bold' }}>
            {status.name}
          </span>
        ) : null;
      },
    },
    {
      field: 'priority',
      headerName: 'Priority',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const priorityMap = {
          0: { name: 'Low', color: '#1976d2' },
          1: { name: 'Normal', color: '#fbc02d' },
          2: { name: 'High', color: '#ff5722' },
          3: { name: 'Urgent', color: '#d32f2f' },
        };
        const priority = priorityMap[params.value];
        return priority ? (
          <span style={{ color: priority.color, fontWeight: 'bold' }}>
            {priority.name}
          </span>
        ) : null;
      },
    },
    {
      field: 'created_date',
      headerName: 'Created Date',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) =>
        dayjs(params.value).format('YYYY-MM-DD HH:mm'),
    },
  ];

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [openEditCard, setOpenEditCard] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const { setRefreshData } = useRefreshDataStore();

  const handleSelectedRows = () => {
    //loop selected rows change status to 3 data to send per req is /**{
    /*"ticketId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "ticketNumber": "string",
  "status": 0
} */

    const updatedRows = selectedRows.map((row) => ({
      ticketId: row.id,
      ticketNumber: row.ticketNumber,
      status: 3,
    }));

    try {
      const promises = updatedRows.map((row) => {
        return apiService.patch(endpoints.updateTicket, row);
      });

      Promise.all(promises)
        .then((responses) => {
          message.success('Tickets closed successfully!');
          console.log('All tickets closed successfully:', responses);
          setRefreshData((prev) => !prev); // Trigger a refresh of the data
          // Optionally, refresh the table data or show a success message
        })
        .catch((error) => {
          message.error('Error closing tickets. Please try again.');
          console.error('Error closing tickets:', error);
          // Optionally, show an error message to the user
        });
    } catch (error) {
      console.log(error);
    }
  };

  const title = clickedItem ? 'Ticket' : 'Create New Ticket';

  const fields = [
    ...(clickedItem
      ? [
          {
            name: 'ticketNumber',
            label: 'Ticket Number',
            type: 'text',
            disabled: true,
          },
        ]
      : []),
    {
      name: 'initiator',
      label: 'Initiator',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'System User' },
        { id: 1, name: 'Self Service' },
        { id: 2, name: 'API Integration' },
        { id: 3, name: 'Agent Assisted' },
      ],
    },
    {
      name: 'initiatorName',
      label: 'Initiator Name',
      type: 'text',
      required: true,
    },
    {
      name: 'initiatorEmail',
      label: 'Initiator Email',
      type: 'email',
      required: true,
    },
    {
      name: 'initiatorPhone',
      label: 'Initiator Phone',
      type: 'phone_number',
      required: true,
    },

    {
      name: 'categoryId',
      label: 'Category',
      type: 'autocomplete',
      required: true,
      options:
        (categories &&
          categories?.map((category) => ({
            id: category.id,
            name: category.description,
          }))) ||
        [], // Populate dynamically with categories
      // Populate dynamically with categories
    },
    {
      name: 'ticketType',
      label: 'Ticket Type',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Walk In' },
        { id: 1, name: 'Direct Booking' },
        { id: 2, name: 'Reservation' },
        { id: 3, name: 'Follow Up' },
      ],
    },
    {
      name: 'appointmentStart',
      label: 'Appointment Start',
      type: 'datetime',
      required: true,
    },
    {
      name: 'appointmentEnd',
      label: 'Appointment End',
      type: 'datetime',
      required: true,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Low' },
        { id: 1, name: 'Normal' },
        { id: 2, name: 'High' },
        { id: 3, name: 'Urgent' },
      ],
    },
  ];

  const assignFields = [
    /**{
  "mode": 0,
  "ticketId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "ticketNumber": "string",
  "toUserId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
} */
    {
      name: 'mode',
      label: 'Mode',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Re-assign' },
        { id: 1, name: 'Assign' },
      ],
    },
    {
      name: 'ticketId',
      label: 'Ticket ID',
      type: 'text',
      required: true,
    },
    {
      name: 'ticketNumber',
      label: 'Ticket Number',
      type: 'text',
      required: true,
    },
    {
      name: 'toUserId',
      label: 'To User ID',
      type: 'text',
      required: true,
    },
  ];

  return (
    <div className="">
      <Dialog
        open={openEditCard}
        onClose={() => setOpenEditCard(false)}
        maxWidth="sm"
        fullWidth
        //add padding to the dialog
        PaperProps={{
          style: {
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <h5 className="text-[19px] text-primary font-semibold ml-5 mt-5">
          Close Selected Tickets
        </h5>
        <h5 className="text-[13px] text-gray-500 font-semibold ml-5 mt-2 mb-2">
          These tickets will be closed and cannot be reopened.
        </h5>
        <TableContainer
          sx={{ maxHeight: '400px', padding: '20px', mb: '20px' }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Ticket Number</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRows.map((doc, index) => (
                <TableRow
                  key={doc.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {/* Ticket Number */}
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: 'bold',
                      color: '#006990',
                      textDecoration: 'underline',
                    }}
                  >
                    {doc.ticketNumber}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#006990',

                      textAlign: 'right',
                    }}
                  >
                    {dayjs(doc.created_date).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
            onClick={() => setOpenEditCard(false)}
            color="error"
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSelectedRows();
              console.log('Updated Rows:', selectedRows);
              setOpenEditCard(false);
            }}
            color="primary"
            variant="contained"
            size="small"
          >
            Close Ticket(s)
          </Button>
        </DialogActions>
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteTicket(clickedItem?.id)}
        deleteApiService={apiService.delete}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            disableAll={true}
            apiEndpoint={endpoints.updateTicket}
            postApiFunction={apiService.patch}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createTicket}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseCRMTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getTickets}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        title="Tickets"
        setOpenEditCard={setOpenEditCard}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default Tickets;
