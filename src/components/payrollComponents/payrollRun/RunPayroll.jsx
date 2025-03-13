'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { Backdrop } from '@mui/material';

const RunPayroll = () => {
  const [computing, setComputing] = React.useState(false);
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold underline ">
            {params.value}
          </p>
        );
      },
    },
    {
      field: 'code',
      headerName: 'Code',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },

    {
      field: 'maximumPayableAmount',
      headerName: 'Maximum Payable Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'isTaxable',
      headerName: 'Is Taxable',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };

  const trialRun = async () => {
    setComputing(true);
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.trialRun(clickedItem.id)
      );
      if (res.status === 200) {
        setComputing(false);
      } else {
        message.error('Error running payroll');
      }
    } catch (error) {
      console.log('Error computing payroll >>>>>>>>>>>:', error);
    } finally {
      setComputing(false);
    }
  };

  const [selectedRows, setSelectedRows] = React.useState([]);
  const handlers = {
    runPayroll: async () => {
      if (selectedRows.length > 0) {
        setComputing(true);
        try {
          for (const row of selectedRows) {
            const res = await payrollApiService.get(
              payrollEndpoints.trialRun(row.id)
            );
            if (res.status !== 200) {
              message.error('Error running payroll for period ID: ' + row.id);
              break;
            }
          }
          setComputing(false);
        } catch (error) {
          console.log('Error computing payroll >>>>>>>>>>>:', error);
        } finally {
          setComputing(false);
        }
      } else {
        message.warning('No rows selected');
      }
    },
  };

  const baseCardHandlers = {
    runPayroll: () => trialRun(),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? clickedItem?.name : 'Create New Payroll Types"';

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      disabled: true,
    },
    {
      name: 'type',
      label: 'Type',
      disabled: true,
      type: 'select',
      options: [
        { value: 0, label: 'Main' },
        { value: 1, label: 'Injury' },
        { value: 2, label: 'Dependent' },
        { value: 3, label: 'Agency' },
      ],
    },
    {
      name: 'maximumPayableAmount',
      label: 'Maximum Payable Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'isTaxable',
      label: 'Is Taxable',
      type: 'switch',
      disabled: true,
    },
  ];

  return (
    <div className="">
      {computing && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 99999999999 }}
          open={open}
          onClick={() => setComputing(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Running Payroll
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        // // deleteApiEndpoint={payrollEndpoints.deletePayrollTypes(clickedItem?.id)}
        // deleteApiService={payrollApiService.get}
      >
        {clickedItem ? (
          <BaseInputCard
            disableAll={true}
            fields={fields}
            apiEndpoint={payrollEndpoints.updatePayrollTypes}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.createPayrollTypes}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getPayrollTypes}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Run Payroll"
        currentTitle="Run Payroll"
        isPayroll={true}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default RunPayroll;
