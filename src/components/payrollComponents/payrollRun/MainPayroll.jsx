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
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import { message } from 'antd';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import {
  useSelectedSegmentStore,
  useStageStore,
  useStatusStore,
} from '@/zustand/store';
import SuspendedPayroll from './SuspendedPayroll';

const MainPayroll = ({
  stage,
  isApproval,
  openApprovalBase,
  setOpenApprovalBase,
  clickedApproval,
}) => {
  const { status } = useStatusStore();
  const columnDefs = [
    {
      field: 'payrollPeriod.documentNo',
      headerName: 'Document No',
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
      field: 'payrollPeriod.period',
      headerName: 'Period',
      headerClass: 'prefix-header',
      filter: true,
      width: 130,
      cellRenderer: (params) => {
        return <p className="text-primary font-semibold  ">{params.value}</p>;
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
        return (
          <p className="text-right text-primary font-semibold">
            {formatNumber(params.value)}
          </p>
        );
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
      field: 'payrollPeriod.stage',
      headerName: 'Status',
      headerClass: 'prefix-header',
      width: 180,
      cellRenderer: (params) => {
        const statusMap = {
          0: { label: 'Open', color: '#007bff' }, // Blue
          1: { label: 'Pending Approval', color: '#ffc107' }, // Yellow
          2: { label: 'Review', color: '#28a745' }, // Green
          3: { label: 'Closed', color: '#dc3545' }, // Red
        };

        const status = statusMap[params.value] || {
          label: 'Unknown',
          color: 'gray',
        };

        return (
          <span
            style={{
              color: status.color,
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'inline-flex', // Use inline-flex for alignment
              alignItems: 'center', // Vertically center the text
              justifyContent: 'center', // Horizontally center the text
              width: '100%', // Ensure it takes the full width of the cell
              height: '100%', // Ensure it takes the full height of the cell
            }}
          >
            {status.label}
          </span>
        );
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
      documentNo: item.payrollPeriod.documentNo,
      no_series: item.payrollPeriod.documentNo,
    }));
  };

  const [computing, setComputing] = React.useState(false);
  const [openRunIncrement, setOpenRunIncrement] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openApprove, setOpenApprove] = React.useState(0);

  const baseCardHandlers = {
    ...(status === 0
      ? {
          sendPayrollForApproval: () => {
            sendPayrollForApproval(clickedItem);
          },
        }
      : {}),
    ...(status === 2 || status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const handlers = {
    ...(status === 0
      ? {
          sendPayrollForApproval: () => {
            if (selectedRows.length > 0) {
              selectedRows.forEach(async (item) => {
                await sendPayrollForApproval(item);
              });
            }
          },
        }
      : {}),
    ...(status === 2 || status === 1
      ? {
          approvalRequest: () => console.log('Approval Request clicked'),
          sendApprovalRequest: () => setOpenApprove(1),
          cancelApprovalRequest: () => setOpenApprove(2),
          approveDocument: () => setOpenApprove(3),
          rejectDocumentApproval: () => setOpenApprove(4),
          delegateApproval: () => {
            setOpenApprove(5);
            setWorkFlowChange(Date.now());
          },
        }
      : {}),
  };

  const [refreshData, setRefreshData] = React.useState(false);
  const sendPayrollForApproval = async (clickedItem) => {
    try {
      const res = await payrollApiService.get(
        payrollEndpoints.sendPeriodForApproval(clickedItem?.periodId)
      );
      if (res.status === 200) {
        setRefreshData((prev) => !prev);
        message.success('Payroll sent for approval');
        console.log('Payroll sent for approval');
      }
    } catch (error) {
      message.error(error.response.data);
      console.log('Error sending payroll for approval', error);
    }
  };

  const trialRun = async () => {
    setComputing(true);
    try {
      const res = await payrollApiService.get(payrollEndpoints.trialRun, {
        periodTypeId: clickedItem?.periodId,
      });
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
        setPayrollDetails(res.data.data);
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

  const getTitle = (stage, status) => {
    const stageTitles = ['Main', 'Injury', 'Dependent', 'Agency'];
    const statusTitles = [
      'Main Payroll',
      'Injury Approval',
      'Depen Review',
      'Closed Payroll',
    ];

    const stageTitle = stageTitles[stage] || 'Unknown Stage';
    const statusTitle = statusTitles[status] || 'Unknown Status';

    return {
      currentTitle: statusTitle,
    };
  };

  const { breadcrumbTitle, currentTitle } = getTitle(stage, status);

  const fields = [
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

  const tabPanes = [
    {
      key: '1',
      title: 'Summary',
      content: (
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
      ),
    },
    {
      key: '2',
      title: 'Earnings',
      content: (
        <BaseCollapse name="Earnings">
          <div className="pt-2">
            <PayrollPensionerDetails
              clickedItem={clickedItem}
              setPayrollDetails={setPayrollDetails}
              payrollDetails={payrollDetails}
            />
          </div>
        </BaseCollapse>
      ),
    },
  ];

  useEffect(() => {
    if (clickedApproval) {
      setClickedItem({
        ...clickedApproval,
        documentNo: clickedApproval.payrollPeriod?.documentNo,
        no_series: clickedApproval.payrollPeriod?.documentNo,
      });
    }
  }, [clickedApproval]);

  const { selectedSegment } = useSelectedSegmentStore();

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
            Running Test Simulation
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}

      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />

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
      {isApproval && (
        <BaseCard
          openBaseCard={openApprovalBase}
          setOpenBaseCard={setOpenApprovalBase}
          handlers={baseCardHandlers}
          title={title}
          clickedItem={clickedItem}
          isUserComponent={false}
          isClaim={true}
        >
          {clickedItem ? (
            <>
              <BaseTabs tabPanes={tabPanes} />
            </>
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
      )}
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
          <>
            <BaseTabs tabPanes={tabPanes} />
          </>
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
        display={isApproval ? 'none' : 'block'}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getPayrollSummaryByStageOnly(stage)}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle={
          stage === 0
            ? 'Main Payroll'
            : stage === 1
            ? 'Injury Approval'
            : stage === 2
            ? 'Dependent Review'
            : 'Agency Payroll'
        }
        currentTitle={
          stage === 0
            ? 'Main Payroll'
            : stage === 1
            ? 'Injury Approval'
            : stage === 2
            ? 'Dependent Review'
            : 'Agency Payroll'
        }
        // isPayroll={true}
        stage={stage}
        refreshData={refreshData}
        onSelectionChange={(selectedRows) => {
          setSelectedRows(selectedRows);

          console.log('Selected Rows:', selectedRows);
        }}
        segmentFilterParameter="Stage"
        segmentOptions={[
          { value: 0, label: 'Open' },
          { value: 1, label: 'Pending Approval' },
          { value: 2, label: 'Review' },
          { value: 3, label: 'Closed' },
          { value: 4, label: 'Suspensions' },
        ]}
      />
    </div>
  );
};

export default MainPayroll;
