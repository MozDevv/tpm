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
import { message } from 'antd';
import axios from 'axios';
import { PAYROLL_BASE_URL } from '@/utils/constants';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';

const SuspendedPayroll = ({ hideTableHeader }) => {
  const [refreshData, setRefreshData] = React.useState(false);

  const statusIcons = {
    0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
    1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
    2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
    3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
  };
  const columnDefs = [
    {
      headerName: 'Pensioner No',
      field: 'pensionerNo',
      sortable: true,
      filter: true,
      width: 200,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      valueGetter: (params) => {
        const awardPrefix = params.data.awardPrefix || '';
        const pensionerNo = params.data.pensionerNo || '';
        return `${awardPrefix}${pensionerNo}`;
      },
      cellRenderer: (params) => {
        return (
          <p className="underline text-primary font-semibold">{params.value}</p>
        );
      },
    },

    {
      headerName: 'Reason',
      field: 'reason.description',
      sortable: true,
      filter: true,
      width: 250,
    },
    {
      headerName: 'Period',
      field: 'period',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Pensioner Name',
      field: 'fullName',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Suspension Date',
      field: 'suspensionDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) => parseDate(params.value),
    },
    {
      headerName: 'Approval Status',
      field: 'documentStatus',
      width: 150,
      filter: true,
      cellRenderer: (params) => {
        const status = statusIcons[params.value];
        if (!status) return null;

        const IconComponent = status.icon;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconComponent
              style={{
                color: status.color,
                marginRight: '6px',
                fontSize: '17px',
              }}
            />
            <span
              style={{
                color: status.color,
                fontWeight: 'semibold',
                fontSize: '13px',
              }}
            >
              {status.name}
            </span>
          </div>
        );
      },
    },
    {
      headerName: 'Gross Amount',
      field: 'grossAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',

      cellRenderer: (params) => {
        const statusMap = {
          0: { label: 'Unadmitted', color: '#007bff' }, // Blue
          1: { label: 'Active', color: '#28a745' }, // Bright Green
          2: { label: 'Suspended', color: '#ffc107' }, // Yellow
          3: { label: 'Inactive', color: '#dc3545' }, // Bright Red
          4: { label: 'Stopped', color: '#6f42c1' }, // Violet
          5: { label: 'Deleted', color: '#000000' }, // Black
          6: { label: 'Pending Admission', color: '#17a2b8' }, // Cyan
          7: { label: 'Admission Rejected', color: '#ff6347' }, // Tomato Red
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
      headerName: 'Last Pay Gross Amount',
      field: 'lastPayGrossAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
    {
      headerName: 'Last Pay Net Amount',
      field: 'lastPayNetAmount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => formatNumber(params.value),
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,

      suspensionId: item.suspensionId,
      payrollId: item.payrollId,
      reasonId: item.reasonId,
      suspensionDate: item.suspensionDate,
      suspensionPeriod: item.suspensionPeriod,
      suspensionApprovalDate: item.suspensionApprovalDate,
      resumptionDate: item.resumptionDate,
      resumedBy: item.resumedBy,
      firstName: item.pensionerDetail?.firstName || '',
      surname: item.pensionerDetail?.surname || '',
      otherName: item.pensionerDetail?.otherName || '',
      awardPrefix: item.pensionerDetail?.awardPrefix || '',
      pensionerNo: item.pensionerDetail?.pensionerNo || '',
      pensionerCode: item.pensionerDetail?.pensionerCode || '',
      grossAmount: item.pensionerDetail?.grossAmount || 0,
      status: item.pensionerDetail?.status || '',
      startDate: item.pensionerDetail?.startDate || '',
      endDate: item.pensionerDetail?.endDate || '',
      suspensionStartDate: item.pensionerDetail?.suspensionStartDate || '',
      resumptionDate: item.pensionerDetail?.resumptionDate || '',
      lastPayDate: item.pensionerDetail?.lastPayDate || '',
      retirementDate: item.pensionerDetail?.retirementDate || '',
      lastPayGrossAmount: item.pensionerDetail?.lastPayGrossAmount || 0,
      lastPayNetAmount: item.pensionerDetail?.lastPayNetAmount || 0,
      reasonDescription: item.reason?.description || '',
      reasonType: item.reason?.reasonType || '',
      fullName:
        item.pensionerDetail?.firstName +
        ' ' +
        item.pensionerDetail?.surname +
        ' ' +
        item.pensionerDetail?.otherName,

      ...item,
    }));
  };

  const [computing, setComputing] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handlers = {
    edit: () => {},

    resumePayroll: () => {
      selectedRows.forEach(async (item) => {
        try {
          await resumePayroll(item);
        } catch (error) {
          console.log('Error resuming payroll', error);
        }
      });
    },
    // approvePayrollStop: () => {},
  };

  const baseCardHandlers = {
    edit: () => {},

    resumePayroll: () => {
      resumePayroll(clickedItem);
    },
  };
  const resumePayroll = async (clickedItem) => {
    setComputing(true);
    try {
      const response = await axios.post(
        `${PAYROLL_BASE_URL}/api/Pensioner/ResumePensioner/srr-resume`,
        JSON.stringify(clickedItem.suspensionId),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Payroll resumed successfully');
        setRefreshData(!refreshData);
      }
      setComputing(false);
      return response;
    } catch (error) {
      setComputing(false);
      message.error('Failed to resume payroll');
      console.error('Error resuming payroll:', error);
      throw error;
    }
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Payroll - ' + clickedItem?.awardPrefix + clickedItem?.pensionerNo
    : 'Create New Main Payroll';

  const { data: incrementMaster } = useFetchAsyncV2(
    payrollEndpoints.getSuspensionReasons,
    payrollApiService
  );

  const fields = [
    {
      name: 'pensionerNo',
      label: 'Pensioner No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'fullName',
      label: 'Pensioner Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'awardPrefix',
      label: 'Award Prefix',
      type: 'text',
      disabled: true,
    },
    {
      name: 'grossAmount',
      label: 'Gross Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'text',
      disabled: true,
    },
    {
      name: 'lastPayDate',
      label: 'Last Pay Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastPayGrossAmount',
      label: 'Last Pay Gross Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'lastPayNetAmount',
      label: 'Last Pay Net Amount',
      type: 'number',
      disabled: true,
    },
    {
      name: 'suspensionDate',
      label: 'Suspension Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'suspensionPeriod',
      label: 'Suspension Period',
      type: 'date',
      disabled: true,
    },
    {
      name: 'resumptionDate',
      label: 'Resumption Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'reasonId',
      label: 'Reason',
      type: 'select',
      disabled: true,
      options:
        incrementMaster &&
        incrementMaster.map((item) => {
          return {
            id: item.reasonId,
            name: item.description,
          };
        }),
    },
  ];
  const segmentOptions2 = [
    { label: 'Open', value: 0 },
    { label: 'Pending Approval', value: 1 },
    { label: 'Approved', value: 2 },
    { label: 'Rejected', value: 3 },
  ];
  return (
    <div className="">
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
              <BaseInputCard
                fields={fields}
                apiEndpoint={payrollEndpoints.updateVendorPostingGroup}
                postApiFunction={payrollApiService.post}
                clickedItem={clickedItem}
                useRequestBody={true}
                setOpenBaseCard={setOpenBaseCard}
                disableAll={true}
              />
            </div>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            disableAll={true}
            apiEndpoint={payrollEndpoints.addVendorPostingGroup}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        hideTableHeader={hideTableHeader}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getSuspensions}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        segmentOptions2={segmentOptions2}
        segmentFilterParameter2="documentStatus"
        breadcrumbTitle="Suspended Payroll"
        currentTitle="Suspended Payroll"
        isPayroll={true}
        refreshData={refreshData}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default SuspendedPayroll;
