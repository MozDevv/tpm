'use client';
import React, { use, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { formatNumber } from '@/utils/numberFormatters';
import PayrollPensionerDetails from './PayrollPensionerDetails';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import PayrollDeductionDetails from './PayrollDeductionDetails';
import { Backdrop, Dialog, IconButton } from '@mui/material';
import { useFetchAsyncV2 } from '@/components/hooks/DynamicFetchHook';
import RunIncrement from './RunIncrement';
import { Launch } from '@mui/icons-material';
import ViewAllEarningsDialog from './ViewAllEarningsDialog';

const MainPayroll = ({ stage, status }) => {
  const columnDefs = [
    {
      field: 'period',
      headerName: 'Period',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
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
      field: 'totalGross',
      headerName: 'Total Gross',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },

      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalNet',
      headerName: 'Total Net',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalDeductions',
      headerName: 'Total Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalTaxDeductions',
      headerName: 'Total Tax Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalStatutoryDeductions',
      headerName: 'Total Statutory Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalIndividualDeductions',
      headerName: 'Total Individual Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalGrossArrears',
      headerName: 'Total Gross Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalNetArrears',
      headerName: 'Total Net Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalArrearsDeductions',
      headerName: 'Total Arrears Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
    }));
  };

  const [computing, setComputing] = React.useState(false);
  const [openRunIncrement, setOpenRunIncrement] = React.useState(false);

  const handlers = {};

  const baseCardHandlers = {
    edit: () => {},
    trialRun: () => {
      trialRun();
    },
  };

  const trialRun = async (id) => {
    setComputing(true);
    try {
      const res = await payrollApiService.post(payrollEndpoints.trialRun, {});
      if (res.status === 200) {
        setComputing(false);
      }
    } catch (error) {
      console.log('Error computing payroll >>>>>>>>>>>:', error);
    }
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Payroll - ' + clickedItem.period
    : 'Create New Main Payroll';

  const [payrollDetails, setPayrollDetails] = React.useState(null);

  const fetchPayrollDetails = async (id) => {
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.getPeriodSchedule(id)
      );
      if (res.status === 200) {
        setPayrollDetails(res.data);
      }
    } catch (error) {
      console.log('Error fetching payroll details', error);
    }
  };

  useEffect(() => {
    if (clickedItem) {
      fetchPayrollDetails(clickedItem.periodId);
    }
  }, [clickedItem]);

  const { data: incrementMaster } = useFetchAsyncV2(
    payrollEndpoints.getIncreamentMasters,
    payrollApiService
  );

  const fields = [
    {
      name: 'payrollType',
      label: 'Payroll Type',
      type: 'text',
      disabled: true,
    },

    {
      name: 'period',
      label: 'Period',
      type: 'text',
      disabled: true,
    },
    {
      name: 'totalGross',
      label: 'Total Gross',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNet',
      label: 'Total Net',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalDeductions',
      label: 'Total Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalTaxDeductions',
      label: 'Total Tax Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalStatutoryDeductions',
      label: 'Total Statutory Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalIndividualDeductions',
      label: 'Total Individual Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalGrossArrears',
      label: 'Total Gross Arrears',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNetArrears',
      label: 'Total Net Arrears',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalArrearsDeductions',
      label: 'Total Arrears Deductions',
      type: 'amount',
      disabled: true,
    },
  ];

  const [openViewAll, setOpenViewAll] = React.useState(false);

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
            Computing
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}

      <Dialog
        open={openRunIncrement}
        onClose={() => setOpenRunIncrement(false)}
        sx={{
          '& .MuiDialog-paper': {
            height: '300px',
            width: '500px',
          },
          p: 4,
        }}
      >
        <RunIncrement incrementMaster={incrementMaster} />
      </Dialog>

      <ViewAllEarningsDialog
        openDrilldown={openViewAll}
        setOpenDrilldown={setOpenViewAll}
        title="Earnings"
      >
        <PayrollPensionerDetails payrollDetails={payrollDetails} />
      </ViewAllEarningsDialog>

      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        isClaim={true}
      >
        {clickedItem ? (
          <div className="flex flex-col gap-2">
            <div className=" overflow-y-auto ">
              <BaseCollapse name="Summary">
                <BaseInputCard
                  fields={fields}
                  apiEndpoint={payrollEndpoints.updateVendorPostingGroup}
                  postApiFunction={payrollApiService.post}
                  clickedItem={clickedItem}
                  useRequestBody={true}
                  setOpenBaseCard={setOpenBaseCard}
                />
              </BaseCollapse>
              <div className="relative">
                <BaseCollapse name="Earnings">
                  <IconButton
                    onClick={() => setOpenViewAll(true)}
                    sx={{ position: 'absolute', right: '40px', top: '20px' }}
                  >
                    <Launch />
                  </IconButton>
                  <div className="pt-2">
                    <PayrollPensionerDetails payrollDetails={payrollDetails} />
                  </div>
                </BaseCollapse>
              </div>
            </div>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.addVendorPostingGroup}
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
        fetchApiEndpoint={payrollEndpoints.getPayrollSummaryByStage(
          stage,
          status
        )}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Main Payroll"
        currentTitle="Main Payroll"
        isPayroll={true}
      />
    </div>
  );
};

export default MainPayroll;
